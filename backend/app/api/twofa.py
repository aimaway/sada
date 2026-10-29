"""API 2FA : enrollment/vérification/désactivation SMS + TOTP, et vérification du second facteur.

Sécurité :
- Codes SMS stockés hachés (sha256), expiration courte, max tentatives, cooldown de renvoi,
  consommation unique (pas de réutilisation).
- Secret TOTP chiffré au repos ; visible UNIQUEMENT pendant l'enrôlement (pending) ;
  activé seulement après vérification d'un code valide ; anti-rejeu par compteur.
- Le jeton "partial" (stage=2fa) ne donne accès à AUCUNE route protégée
  (get_current_user exige stage=="full").
"""
from datetime import datetime, timedelta
from typing import Optional

import jwt as _jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.config import settings
from app.core.rbac import get_current_user
from app.database import get_db
from app.models import User, SmsVerificationCode, UserTotpSecret, Notification
from app.security import (
    decrypt_secret, encrypt_secret, generate_sms_code, generate_totp_secret,
    hash_sms_code, totp_provisioning_uri, verify_totp,
)

router = APIRouter(prefix="/api/v1/auth/2fa", tags=["2FA"])

PARTIAL_TOKEN_MINUTES = 5

# HTTPBearer separe (auto_error=False) pour les routes qui acceptent le jeton
# partiel stage="2fa" — get_current_user refuse ces jetons volontairement.
_partial_security = HTTPBearer(auto_error=False)


# ---------- Adaptateur SMS (dev/test clairement étiqueté, jamais un faux "envoyé") ----------

def send_sms(db: Session, user: User, message: str) -> dict:
    """Retourne {delivered: bool, adapter: 'twilio'|'console_test', simulated: bool}.

    En production sans Twilio configuré : echec explicite (jamais de faux succes).
    En demo/dev sans Twilio : adaptateur console — le code N'EST PAS journalisé en prod;
    il est renvoyé uniquement quand DEMO_MODE est actif et ENVIRONMENT != production,
    pour permettre les tests E2E (clairement etiquete 'simule').
    """
    if settings.SMS_PROVIDER == "twilio" and settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:  # pragma: no cover - dépend du réseau
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            client.messages.create(to=user.phone, from_=settings.TWILIO_PHONE_NUMBER, body=message)
            return {"delivered": True, "adapter": "twilio", "simulated": False}
        except Exception:
            return {"delivered": False, "adapter": "twilio", "simulated": False}
    if settings.DEMO_MODE and settings.ENVIRONMENT != "production":
        # On persiste une trace in-app pour que la démo soit testable sans opérateur SMS.
        db.add(Notification(
            user_id=user.id, type="sms_simulated",
            title="[DEMO] SMS simulé",
            body=f"(destinataire {user.phone}) {message}",
            link=None, data={"adapter": "console_test"},
        ))
        return {"delivered": True, "adapter": "console_test", "simulated": True}
    return {"delivered": False, "adapter": "none", "simulated": False}


def issue_sms_code(db: Session, user: User, purpose: str) -> tuple[SmsVerificationCode, str]:
    """Invalide les codes précédents du même but, crée un code hashé + envoi SMS."""
    now = datetime.utcnow()
    last = (db.query(SmsVerificationCode)
            .filter(SmsVerificationCode.user_id == user.id,
                    SmsVerificationCode.purpose == purpose)
            .order_by(SmsVerificationCode.created_at.desc()).first())
    if last and last.created_at and (now - last.created_at.replace(tzinfo=None)) < timedelta(seconds=settings.SMS_RESEND_COOLDOWN_SECONDS):
        raise HTTPException(status_code=429, detail="Veuillez patienter avant de renvoyer un code.")
    (db.query(SmsVerificationCode)
     .filter(SmsVerificationCode.user_id == user.id,
             SmsVerificationCode.purpose == purpose,
             SmsVerificationCode.consumed_at.is_(None),
             SmsVerificationCode.invalidated_at.is_(None))
     .update({"invalidated_at": now}))
    code = generate_sms_code()
    rec = SmsVerificationCode(
        user_id=user.id, code_hash=hash_sms_code(code), purpose=purpose,
        expires_at=now + timedelta(seconds=settings.SMS_CODE_TTL_SECONDS),
        max_attempts=settings.SMS_MAX_ATTEMPTS,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec, code


def consume_sms_code(db: Session, user: User, code: str, purpose: str) -> None:
    """Vérifie et consomme un code. Erreurs génériques (pas d'info sensible)."""
    now = datetime.utcnow()
    rec = (db.query(SmsVerificationCode)
           .filter(SmsVerificationCode.user_id == user.id,
                   SmsVerificationCode.purpose == purpose,
                   SmsVerificationCode.consumed_at.is_(None),
                   SmsVerificationCode.invalidated_at.is_(None))
           .order_by(SmsVerificationCode.created_at.desc()).first())
    bad = HTTPException(status_code=400, detail="Code invalide ou expiré.")
    if rec is None:
        raise bad
    if rec.expires_at.replace(tzinfo=None) < now:
        raise HTTPException(status_code=400, detail="Code expiré, demandez un nouveau code.")
    if (rec.attempts or 0) >= rec.max_attempts:
        raise HTTPException(status_code=429, detail="Trop de tentatives. Demandez un nouveau code.")
    if rec.code_hash != hash_sms_code(code):
        rec.attempts = (rec.attempts or 0) + 1
        db.commit()
        raise bad
    rec.consumed_at = now  # usage unique : impossible de rejouer le même code
    db.commit()


# ---------- Schémas ----------

class VerifyBody(BaseModel):
    code: str = Field(min_length=4, max_length=10)


class TotpVerifyBody(BaseModel):
    code: str = Field(min_length=6, max_length=8)


class DisableBody(BaseModel):
    method: str  # 'sms' | 'totp'
    code: Optional[str] = None      # challenge second facteur (TOTP actuel)
    password: Optional[str] = None  # re-authentification par mot de passe


class SendLoginBody(BaseModel):
    """Corps vide accepte pour /sms/send-login (le token partiel porte l'identite)."""
    pass


# ---------- Statut ----------

@router.get("/status")
def two_fa_status(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    totp = db.query(UserTotpSecret).filter(UserTotpSecret.user_id == user.id).first()
    return {
        "enabled_method": user.twofa_method or None,
        "sms": {
            "available": bool(user.phone),
            "phone_verified": bool(user.phone_verified),
        },
        "totp": {
            "enrolled": bool(totp and totp.status == "active"),
            "pending": bool(totp and totp.status == "pending"),
        },
        "demo_mode": bool(settings.DEMO_MODE and settings.ENVIRONMENT != "production"),
    }


# ---------- SMS 2FA ----------

@router.post("/sms/enroll")
def enroll_sms(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Envoie un code de vérification du numéro pour activer le 2FA SMS."""
    if not user.phone:
        raise HTTPException(status_code=400, detail="Aucun numéro de téléphone sur le compte.")
    fresh = db.query(User).filter(User.id == user.id).first()
    rec, code = issue_sms_code(db, fresh, "2fa_phone_verify")
    res = send_sms(db, fresh, f"TomoBily : votre code de verification est {code} (expire dans {settings.SMS_CODE_TTL_SECONDS//60} min).")
    db.commit()
    body = {"sent": res["delivered"], "adapter": res["adapter"], "simulated": res["simulated"],
            "expires_in": settings.SMS_CODE_TTL_SECONDS}
    if res["simulated"]:
        body["dev_note"] = "ADAPTATEUR DE TEST : aucun SMS réel envoyé. Code visible ci-dessous (démo uniquement)."
        body["dev_code"] = code
    return body


@router.post("/sms/verify")
def verify_sms(body: VerifyBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fresh = db.query(User).filter(User.id == user.id).first()
    consume_sms_code(db, fresh, body.code, "2fa_phone_verify")
    fresh.phone_verified = True
    fresh.twofa_method = "sms"
    db.add(Notification(user_id=fresh.id, type="security_change",
                        title="2FA activé (SMS)", body="La vérification par SMS est active."))
    db.commit()
    return {"ok": True, "method": "sms"}


@router.post("/sms/resend")
def resend_sms(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fresh = db.query(User).filter(User.id == user.id).first()
    rec, code = issue_sms_code(db, fresh, "2fa_phone_verify")
    res = send_sms(db, fresh, f"TomoBily : votre code de verification est {code}.")
    db.commit()
    body = {"sent": res["delivered"], "adapter": res["adapter"], "simulated": res["simulated"]}
    if res["simulated"]:
        body["dev_code"] = code
    return body


@router.post("/sms/send-login")
def send_login_code(
    body: SendLoginBody,
    credentials: HTTPAuthorizationCredentials = Depends(_partial_security),
    db: Session = Depends(get_db),
):
    """Emet un code SMS pour completer une authentification partielle (etape 2FA du login).

    N'accepte QUE le token partiel stage="2fa" delivre par /auth/login.
    Erreurs generiques : ne revele aucune info sensible.
    """
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentification requise")
    try:
        payload = _jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except _jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    if payload.get("stage") != "2fa":
        raise HTTPException(status_code=400, detail="Jeton non applicable")
    try:
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token invalide")
    fresh = db.query(User).filter(User.id == user_id).first()
    if fresh is None or (fresh.status or "active") != "active":
        raise HTTPException(status_code=403, detail="Compte indisponible")
    if fresh.twofa_method != "sms":
        raise HTTPException(status_code=400, detail="Méthode SMS non active")
    rec, code = issue_sms_code(db, fresh, "2fa_login")
    res = send_sms(db, fresh, f"TomoBily : votre code de connexion est {code} (expire dans {settings.SMS_CODE_TTL_SECONDS//60} min).")
    db.commit()
    out = {"sent": res["delivered"], "adapter": res["adapter"], "simulated": res["simulated"]}
    if not res["delivered"]:
        raise HTTPException(status_code=502, detail="Envoi SMS indisponible. Réessayez ou utilisez l'autre méthode.")
    if res["simulated"]:
        out["dev_note"] = "ADAPTATEUR DE TEST : aucun SMS réel envoyé (démo uniquement)."
        out["dev_code"] = code
    return out


# ---------- TOTP 2FA ----------

@router.post("/totp/enroll")
def enroll_totp(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Génère un secret pending + URI otpauth (QR). Le secret n'est plus jamais renvoyé ensuite."""
    existing = db.query(UserTotpSecret).filter(UserTotpSecret.user_id == user.id).first()
    if existing and existing.status == "active":
        raise HTTPException(status_code=400, detail="TOTP déjà actif. Désactivez-le d'abord.")
    secret = generate_totp_secret()
    if existing:
        existing.secret_encrypted = encrypt_secret(secret)
        existing.status = "pending"
        existing.last_counter = None
        rec = existing
    else:
        rec = UserTotpSecret(user_id=user.id, secret_encrypted=encrypt_secret(secret), status="pending")
        db.add(rec)
    db.commit()
    label = user.email or user.phone or f"user-{user.id}"
    return {
        "provisioning_uri": totp_provisioning_uri(secret, label),
        "secret": secret,  # affiché UNE SEULE FOIS, pendant l'enrôlement pending
        "status": "pending",
        "note": "Scannez le QR dans Google Authenticator puis confirmez avec un code.",
    }


@router.post("/totp/verify")
def verify_totp_endpoint(body: TotpVerifyBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = db.query(UserTotpSecret).filter(UserTotpSecret.user_id == user.id).first()
    if not rec or rec.status != "pending":
        raise HTTPException(status_code=400, detail="Aucun enrôlement TOTP en attente.")
    secret = decrypt_secret(rec.secret_encrypted)
    ok, counter = verify_totp(secret, body.code, rec.last_counter)
    if not ok:
        raise HTTPException(status_code=400, detail="Code invalide (ou déjà utilisé).")
    rec.status = "active"
    rec.last_counter = counter
    rec.activated_at = datetime.utcnow()
    fresh = db.query(User).filter(User.id == user.id).first()
    fresh.twofa_method = "totp"
    db.add(Notification(user_id=user.id, type="security_change",
                        title="2FA activé (application d'authentification)",
                        body="TOTP vérifié et activé."))
    db.commit()
    return {"ok": True, "method": "totp"}


# ---------- Désactivation (re-authentification exigée) ----------

@router.post("/disable")
def disable_2fa(body: DisableBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fresh = db.query(User).filter(User.id == user.id).first()
    if not fresh.twofa_method:
        raise HTTPException(status_code=400, detail="Aucune méthode 2FA active.")
    if body.method == "totp":
        rec = db.query(UserTotpSecret).filter(UserTotpSecret.user_id == user.id, UserTotpSecret.status == "active").first()
        if not rec:
            raise HTTPException(status_code=400, detail="TOTP non actif.")
        secret = decrypt_secret(rec.secret_encrypted)
        ok, _ = verify_totp(secret, body.code or "", None)  # pas d'anti-rejeu pour la désactivation
        if not ok:
            raise HTTPException(status_code=400, detail="Code TOTP invalide.")
        db.delete(rec)
    elif body.method == "sms":
        if not body.password:
            raise HTTPException(status_code=400, detail="Mot de passe requis pour désactiver le 2FA SMS.")
        from app.main import verify_password
        if not verify_password(body.password, fresh.password_hash):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect.")
    else:
        raise HTTPException(status_code=400, detail="Méthode inconnue.")
    fresh.twofa_method = None
    db.add(Notification(user_id=user.id, type="security_change",
                        title=f"2FA désactivé ({body.method})", body="La double authentification est désactivée."))
    db.commit()
    return {"ok": True}


# ---------- Changement de mot de passe (reel, pas d'alerte simulee) ----------

class PasswordChangeBody(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


@router.post("/password")
def change_password(body: PasswordChangeBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Change le mot de passe apres verification du mot de passe actuel."""
    from app.main import verify_password, get_password_hash
    fresh = db.query(User).filter(User.id == user.id).first()
    if not verify_password(body.current_password, fresh.password_hash):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect.")
    fresh.password_hash = get_password_hash(body.new_password)
    db.add(Notification(user_id=fresh.id, type="security_change",
                        title="Mot de passe modifié",
                        body="Le mot de passe du compte a été changé."))
    db.commit()
    return {"ok": True}


# ---------- E-mail de contact support (verification) ----------

class SupportEmailBody(BaseModel):
    email: EmailStr


@router.post("/support-email/send-code")
def send_support_email_code(body: SupportEmailBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Emet un code de verification pour l'e-mail de contact support.

    NOTE D'ENVIRONNEMENT : l'envoi d'e-mail sortant n'est PAS configure dans ce
    depot (aucun integrateur SMTP/transactionnel existant a reutiliser). En mode
    demo/dev, le code est renvoyé explicitement comme SIMULE (jamais presente
    comme un vrai e-mail). En production sans configuration mail, la requete
    echoue avec une erreur explicite au lieu de mentir.
    """
    fresh = db.query(User).filter(User.id == user.id).first()
    rec, code = issue_sms_code(db, fresh, f"support_email:{body.email}")
    if settings.DEMO_MODE and settings.ENVIRONMENT != "production":
        db.add(Notification(user_id=fresh.id, type="email_simulated",
                            title="[DEMO] E-mail simulé (support contact)",
                            body=f"(destinataire {body.email}) Code de vérification : {code}"))
        db.commit()
        return {"sent": True, "adapter": "console_test", "simulated": True,
                "dev_note": "ADAPTATEUR DE TEST : aucun e-mail réel envoyé (service mail non configuré).",
                "dev_code": code}
    raise HTTPException(status_code=502, detail="Service d'e-mail non configuré (SMTP requis en production). Le contact support peut être enregistré sans vérification via les paramètres de profil.")


class SupportEmailVerifyBody(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=10)


@router.post("/support-email/verify")
def verify_support_email(body: SupportEmailVerifyBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fresh = db.query(User).filter(User.id == user.id).first()
    consume_sms_code(db, fresh, body.code, f"support_email:{body.email}")
    fresh.support_contact_email = str(body.email)
    fresh.support_email_verified = True
    db.add(Notification(user_id=fresh.id, type="security_change",
                        title="E-mail support vérifié",
                        body=f"{body.email} est désormais votre contact support."))
    db.commit()
    return {"ok": True, "support_contact_email": str(body.email), "verified": True}
