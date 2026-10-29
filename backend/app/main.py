"""
Application FastAPI principale pour TomoBily
"""
from pydantic import BaseModel, EmailStr, Field
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from app.config import settings
from app.database import get_db, engine
from app.models import User, UserRole, ProviderProfile, Job, JobStatus, ServiceRequest, Plan, Subscription
from app.websocket.manager import ConnectionManager

# Import seller and tuner routers
from app.api import seller, tuner
# Import marketplace & IFIX AI routers (TomoBily)
from app.api import marketplace, ifix_ai
# Import admin router (contrôle total des comptes)
from app.api import admin as _admin
# Import 2FA, partnerships et boutique mécanicien
from app.api import twofa, partnerships, mechstore

# Create tables
from app.database import Base
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer(auto_error=False)

# WebSocket manager
ws_manager = ConnectionManager()

# FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API backend pour la plateforme TomoBily",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Utility Functions ============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifier un mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hasher un mot de passe (bcrypt limite à 72 octets — tronqué ici)."""
    return pwd_context.hash(password.encode("utf-8")[:72].decode("utf-8", errors="ignore"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Créer un token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Obtenir l'utilisateur actuel depuis le token JWT"""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        # Jeton d'authentification partielle (2FA en attente) : refuse sur
        # toutes les routes protegees (identique a app/core/rbac.py).
        if payload.get("stage") == "2fa":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Second facteur requis"
            )
        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            user_id = None
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
    except HTTPException:
        raise
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )

    if (user.status or "active") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte désactivé"
        )

    # Snapshot des attributs : les sessions d'injection de dépendances sont
    # closes en fin de requête et certains handlers appellent db.commit()
    # (expire_on_commit=True) ; un objet attaché accédé plus tard (ex.
    # current_user.role dans rbac.get_current_user, ou req.customer_id !=
    # user.id après commit dans marketplace.accept_offer) lèverait un
    # DetachedInstanceError. On renvoie donc une instance User détachée
    # dont tous les attributs colonnes sont pré-chargés — le handler peut
    # lire n'importe quel champ sans session. Pour les endpoints qui
    # MUTENT current_user, utiliser rebind_user() ci-dessous.
    state = {c.key: getattr(user, c.key) for c in User.__mapper__.column_attrs}
    # Instance detachee « fully loaded » : __new__ sans passer par __init__
    # (qui marquerait l'objet pending) + __dict__ pré-rempli => SQLAlchemy
    # considere tous les attributs comme charges ; aucun refresh apres commit.
    detached = User.__new__(User)
    detached.__dict__.update(state)
    return detached


def rebind_user(db: Session, current_user: User) -> User:
    """Recharger current_user depuis la base dans la session `db` courante.

    À appeler dans les handlers qui modifient current_user (le snapshot
    renvoyé par get_current_user est détaché et ne peut pas être persisté).
    """
    fresh = db.query(User).filter(User.id == current_user.id).first()
    if fresh is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    return fresh


# ============ Authentication Endpoints ============

@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(
    phone: str,
    password: str,
    full_name: str,
    role: UserRole = UserRole.CUSTOMER,
    db: Session = Depends(get_db)
):
    """Inscription d'un nouvel utilisateur"""
    # Vérifier si le téléphone existe déjà
    existing_user = db.query(User).filter(User.phone == phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce numéro de téléphone est déjà utilisé"
        )
    
    # Créer l'utilisateur
    hashed_password = get_password_hash(password)
    user = User(
        phone=phone,
        password_hash=hashed_password,
        full_name=full_name,
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Créer le token
    access_token = create_access_token(data={"sub": str(user.id), "stage": "full"})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "role": user.role
        }
    }


@app.post("/api/v1/auth/login")
def login(
    phone: str,
    password: str,
    db: Session = Depends(get_db)
):
    """Connexion d'un utilisateur.

    Si la 2FA est active sur le compte, ne delivre qu'un jeton partiel
    (stage="2fa") inutilisable sur les routes protegees ; le client doit
    appeler POST /api/v1/auth/2fa/challenge avec le code SMS ou TOTP.
    """
    user = db.query(User).filter(User.phone == phone).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Numéro de téléphone ou mot de passe incorrect"
        )

    # Mettre à jour last_login
    user.last_login = datetime.utcnow()
    db.commit()

    if user.twofa_method in ("sms", "totp"):
        # Authentification partielle : premier facteur OK, second requis.
        partial_token = create_access_token(
            data={"sub": str(user.id), "stage": "2fa"},
            expires_delta=timedelta(minutes=5),
        )
        return {
            "access_token": partial_token,
            "token_type": "bearer",
            "requires_2fa": True,
            "method": user.twofa_method,
            "user": {
                "id": user.id,
                "phone": user.phone,
                "full_name": user.full_name,
                "role": user.role,
            },
        }

    # Créer le token
    access_token = create_access_token(data={"sub": str(user.id), "stage": "full"})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "requires_2fa": False,
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "role": user.role
        }
    }


@app.post("/api/v1/auth/2fa/challenge")
def two_fa_challenge(
    body: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Complete l'authentification partielle (2FA) par le second facteur.

    Accepte {"code": "..."} avec un jeton stage="2fa". Delivre un jeton
    complet uniquement apres verification SMS (code hache) ou TOTP server-side.
    """
    from app.api.twofa import consume_sms_code
    from app.models import UserTotpSecret
    from app.security import decrypt_secret, verify_totp

    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentification requise")
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    if payload.get("stage") != "2fa":
        raise HTTPException(status_code=400, detail="Jeton non applicable (2FA non en attente)")
    try:
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token invalide")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None or (user.status or "active") != "active":
        raise HTTPException(status_code=403, detail="Compte indisponible")
    if user.twofa_method not in ("sms", "totp"):
        raise HTTPException(status_code=400, detail="2FA non active sur ce compte")

    code = str(body.get("code") or "").strip()
    if not code:
        raise HTTPException(status_code=400, detail="Code requis")

    if user.twofa_method == "sms":
        # Le code de connexion est emis par /auth/2fa/sms/send-login (but 2fa_login).
        consume_sms_code(db, user, code, "2fa_login")
    else:
        rec = db.query(UserTotpSecret).filter(
            UserTotpSecret.user_id == user.id, UserTotpSecret.status == "active").first()
        if not rec:
            raise HTTPException(status_code=400, detail="TOTP non configuré")
        ok, counter = verify_totp(decrypt_secret(rec.secret_encrypted), code, rec.last_counter)
        if not ok:
            raise HTTPException(status_code=401, detail="Code invalide ou déjà utilisé")
        rec.last_counter = counter
        db.commit()

    full_token = create_access_token(data={"sub": str(user.id), "stage": "full"})
    return {"access_token": full_token, "token_type": "bearer", "user": {
        "id": user.id, "phone": user.phone, "full_name": user.full_name, "role": user.role}}


# ============ User Endpoints ============

@app.get("/api/v1/users/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Profil complet de l'utilisateur actuel (sans aucun secret : ni hash, ni TOTP)."""
    return _user_profile_dict(current_user)


class UserProfilePatch(BaseModel):
    """Sous-ensemble editable du profil — les champs privilegies sont ABSENTS
    par construction (role, status, password_hash, twofa_method, is_demo...)."""
    first_name: Optional[str] = Field(default=None, max_length=120)
    last_name: Optional[str] = Field(default=None, max_length=120)
    display_name: Optional[str] = Field(default=None, max_length=160)
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None            # email de CONNEXION (changement direct)
    support_contact_email: Optional[EmailStr] = None  # contact SUPPORT (distinct)
    language: Optional[str] = Field(default=None, max_length=10)
    country: Optional[str] = Field(default=None, max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    address: Optional[str] = Field(default=None, max_length=500)
    avatar_url: Optional[str] = Field(default=None, max_length=500)
    notification_prefs: Optional[dict] = None


@app.patch("/api/v1/users/me")
def patch_current_user_profile(
    body: UserProfilePatch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modifie le profil de l'utilisateur AUTHENTIFIE uniquement.

    - L'identite vient du token verifie (aucun user_id accepte dans la requete).
    - Champs privilegies inaccessibles (absents du schema).
    - support_contact_email : en production exige une verification via
      /auth/2fa/support-email/* ; en dev/demo il peut etre defini directement
      (statut verified conserve tant que l'adresse change -> reinitialisee a False).
    """
    from app.models import Notification
    current_user = rebind_user(db, current_user)
    data = body.model_dump(exclude_unset=True)
    errors = []

    if "email" in data and data["email"]:
        dup = db.query(User).filter(User.email == data["email"], User.id != current_user.id).first()
        if dup:
            errors.append({"field": "email", "message": "Cet e-mail est déjà utilisé."})
    if "notification_prefs" in data and data["notification_prefs"] is not None:
        np = data["notification_prefs"]
        if not isinstance(np, dict) or any(not isinstance(v, bool) for v in np.values()):
            errors.append({"field": "notification_prefs", "message": "Préférences invalides (booléens attendus)."})
        else:
            ALLOWED_PREF_KEYS = {"email", "sms", "push", "order_updates", "security_alerts"}
            unknown = set(np.keys()) - ALLOWED_PREF_KEYS
            if unknown:
                errors.append({"field": "notification_prefs", "message": f"Clés inconnues : {', '.join(sorted(unknown))}"})
    if errors:
        raise HTTPException(status_code=422, detail={"message": "Validation échouée", "errors": errors})

    changed_support = ("support_contact_email" in data and
                       (data.get("support_contact_email") or None) != (current_user.support_contact_email or None))
    for k, v in data.items():
        setattr(current_user, k, v)
    if changed_support:
        current_user.support_email_verified = False  # toute nouvelle adresse doit etre reverifiee
    if current_user.full_name:
        # display_name par defaut si vide
        if not current_user.display_name:
            current_user.display_name = current_user.full_name
    db.add(Notification(user_id=current_user.id, type="profile_update",
                        title="Profil mis à jour",
                        body="Vos informations de compte ont été enregistrées." +
                             (" L'e-mail support devra être re-vérifié." if changed_support else "")))
    db.commit()
    db.refresh(current_user)
    return {"ok": True, "user": _user_profile_dict(current_user)}


def _user_profile_dict(u: User) -> dict:
    return {
        "id": u.id, "phone": u.phone, "email": u.email,
        "full_name": u.full_name, "first_name": u.first_name, "last_name": u.last_name,
        "display_name": u.display_name or u.full_name,
        "avatar_url": u.avatar_url, "country": u.country, "city": u.city,
        "address": u.address, "language": u.language,
        "notification_prefs": u.notification_prefs or {},
        "support_contact_email": u.support_contact_email,
        "support_email_verified": bool(u.support_email_verified),
        "twofa_method": u.twofa_method, "phone_verified": bool(u.phone_verified),
        "role": u.role, "status": u.status,
        "created_at": u.created_at, "last_login": u.last_login,
    }


# ============ Provider Endpoints ============

@app.get("/api/v1/providers")
def get_providers(
    type: Optional[str] = None,
    city: Optional[str] = None,
    verified: Optional[bool] = None,
    online: Optional[bool] = None,
    min_rating: Optional[float] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtenir la liste des providers avec filtres"""
    query = db.query(ProviderProfile)
    
    if type:
        query = query.filter(ProviderProfile.type == type)
    if city:
        query = query.filter(ProviderProfile.city == city)
    if verified is not None:
        query = query.filter(ProviderProfile.verified == verified)
    if online is not None:
        query = query.filter(ProviderProfile.is_online == online)
    if min_rating is not None:
        query = query.filter(ProviderProfile.rating >= min_rating)
    
    providers = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": p.id,
            "slug": p.slug,
            "type": p.type,
            "name": p.name,
            "avatar": p.avatar,
            "bio": p.bio,
            "verified": p.verified,
            "rating": p.rating,
            "review_count": p.review_count,
            "jobs_completed": p.jobs_completed,
            "city": p.city,
            "is_online": p.is_online,
            "specialties": p.specialties,
            "response_time": p.response_time
        }
        for p in providers
    ]


@app.get("/api/v1/providers/{slug}")
def get_provider_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtenir le profil complet d'un provider"""
    provider = db.query(ProviderProfile).filter(ProviderProfile.slug == slug).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider non trouvé"
        )
    
    return {
        "id": provider.id,
        "slug": provider.slug,
        "type": provider.type,
        "name": provider.name,
        "avatar": provider.avatar,
        "cover": provider.cover,
        "bio": provider.bio,
        "verified": provider.verified,
        "badges": provider.badges,
        "rating": provider.rating,
        "review_count": provider.review_count,
        "jobs_completed": provider.jobs_completed,
        "response_time": provider.response_time,
        "completion_rate": provider.completion_rate,
        "city": provider.city,
        "address": provider.address,
        "service_zone": provider.service_zone,
        "is_online": provider.is_online,
        "languages": provider.languages,
        "specialties": provider.specialties,
        "brands": provider.brands,
        "vehicle_types": provider.vehicle_types,
        "services": provider.services,
        "certificates": provider.certificates,
        "equipment": provider.equipment,
        "gallery": provider.gallery,
        "videos": provider.videos,
        "member_since": provider.member_since
    }


@app.post("/api/v1/providers", status_code=status.HTTP_201_CREATED)
def create_provider_profile(
    type: str,
    slug: str,
    name: str,
    bio: Optional[str] = None,
    city: str = "Casablanca",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Créer un profil provider"""
    # Vérifier si l'utilisateur a déjà un profil provider
    existing = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà un profil provider"
        )
    
    # Vérifier si le slug est disponible
    slug_exists = db.query(ProviderProfile).filter(ProviderProfile.slug == slug).first()
    if slug_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce slug est déjà utilisé"
        )
    
    provider = ProviderProfile(
        user_id=current_user.id,
        type=type,
        slug=slug,
        name=name,
        bio=bio,
        city=city
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)
    
    return {"message": "Profil provider créé avec succès", "provider_id": provider.id}


# ============ Job Endpoints ============

@app.get("/api/v1/jobs")
def get_jobs(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtenir la liste des jobs de l'utilisateur"""
    query = db.query(Job).filter(Job.customer_id == current_user.id)
    
    if status:
        query = query.filter(Job.status == status)
    
    jobs = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": job.id,
            "status": job.status,
            "agreed_price": job.agreed_price,
            "provider_id": job.provider_id,
            "created_at": job.created_at,
            "accepted_at": job.accepted_at,
            "completed_at": job.completed_at
        }
        for job in jobs
    ]


@app.get("/api/v1/jobs/{job_id}")
def get_job_details(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtenir les détails d'un job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    # Vérifier que l'utilisateur est le client ou le provider
    if job.customer_id != current_user.id and job.provider.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == job.provider_id).first()
    
    return {
        "id": job.id,
        "status": job.status,
        "agreed_price": job.agreed_price,
        "provider": {
            "id": provider.id,
            "name": provider.name,
            "avatar": provider.avatar,
            "rating": provider.rating
        },
        "diagnosis": job.diagnosis,
        "quote_update": job.quote_update,
        "quote_update_approved": job.quote_update_approved,
        "accepted_at": job.accepted_at,
        "started_at": job.started_at,
        "completed_at": job.completed_at,
        "auto_close_deadline": job.auto_close_deadline,
        "before_photos": job.before_photos,
        "after_photos": job.after_photos,
        "final_amount": job.final_amount,
        "created_at": job.created_at
    }


@app.put("/api/v1/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    new_status: JobStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour le statut d'un job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    # Vérifier que l'utilisateur est le provider
    if job.provider.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul le provider peut mettre à jour le statut"
        )
    
    job.status = new_status
    
    # Mettre à jour les timestamps selon le statut
    if new_status == JobStatus.ACCEPTED:
        job.accepted_at = datetime.utcnow()
        job.auto_close_deadline = datetime.utcnow() + timedelta(hours=settings.AUTO_CLOSE_HOURS)
    elif new_status == JobStatus.IN_PROGRESS:
        job.started_at = datetime.utcnow()
    elif new_status == JobStatus.COMPLETED:
        job.completed_at = datetime.utcnow()
    
    db.commit()
    
    # Envoyer notification WebSocket au client
    # await ws_manager.send_to_user(job.customer_id, {"type": "job_status_updated", "job_id": job_id, "status": new_status})
    
    return {"message": "Statut mis à jour avec succès"}


@app.post("/api/v1/jobs/{job_id}/close")
def close_job(
    job_id: int,
    final_amount: int,
    before_photos: List[str] = [],
    after_photos: List[str] = [],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clôturer un job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    # Vérifier que l'utilisateur est le provider
    if job.provider.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul le provider peut clôturer le job"
        )
    
    job.status = JobStatus.COMPLETED
    job.completed_at = datetime.utcnow()
    job.final_amount = final_amount
    job.before_photos = before_photos
    job.after_photos = after_photos
    
    # Mettre à jour les stats du provider
    provider = job.provider
    provider.jobs_completed += 1
    
    # Calculer la commission (10%)
    commission = int(final_amount * 0.10)
    provider.wallet_balance -= commission
    
    db.commit()
    
    return {"message": "Job clôturé avec succès", "commission": commission}


# ============ Plan Endpoints ============

@app.get("/api/v1/plans")
def get_plans(
    audience: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Obtenir la liste des plans"""
    query = db.query(Plan).filter(Plan.status == "active")
    
    if audience:
        query = query.filter(Plan.audience == audience)
    
    plans = query.all()
    
    return [
        {
            "id": plan.id,
            "slug": plan.slug,
            "audience": plan.audience,
            "name": plan.name,
            "price": plan.price,
            "features": plan.features
        }
        for plan in plans
    ]


@app.get("/api/v1/plans/{slug}")
def get_plan_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtenir les détails d'un plan"""
    plan = db.query(Plan).filter(Plan.slug == slug).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan non trouvé"
        )
    
    return {
        "id": plan.id,
        "slug": plan.slug,
        "audience": plan.audience,
        "name": plan.name,
        "price": plan.price,
        "features": plan.features
    }


@app.post("/api/v1/plans/subscribe")
def subscribe_to_plan(
    plan_slug: str,
    payment_method: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """S'abonner à un plan"""
    plan = db.query(Plan).filter(Plan.slug == plan_slug).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan non trouvé"
        )
    
    # Vérifier que l'utilisateur n'a pas déjà un abonnement actif
    existing_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).first()
    
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà un abonnement actif"
        )
    
    # Créer l'abonnement
    subscription = Subscription(
        user_id=current_user.id,
        plan_id=plan.id,
        status="active",
        expires_at=datetime.utcnow() + timedelta(days=30),
        payment_method=payment_method,
        last_payment_at=datetime.utcnow()
    )
    db.add(subscription)
    db.commit()
    
    return {"message": "Abonnement activé avec succès", "expires_at": subscription.expires_at}


# ============ WebSocket Endpoints ============

@app.websocket("/ws/requests")
async def websocket_requests(websocket: WebSocket):
    """WebSocket pour les demandes en temps réel"""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast to all connected providers
            await ws_manager.broadcast({
                "type": "new_request",
                "data": data
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


@app.websocket("/ws/jobs/{job_id}")
async def websocket_job(websocket: WebSocket, job_id: int):
    """WebSocket pour un job spécifique"""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Send to job participants
            await ws_manager.send_personal_message({
                "type": "job_update",
                "job_id": job_id,
                "data": data
            }, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


# ============ Health Check ============

@app.get("/health")
def health_check():
    """Vérifier l'état de l'API"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }


from app.api import global_config as _gc
app.include_router(_gc.router, prefix="/api/v1", tags=["Global Config"])

# Include Seller and Tuner routers
app.include_router(seller.router, prefix="/api/v1", tags=["Seller Portal"])
app.include_router(marketplace.router)
app.include_router(ifix_ai.router)
app.include_router(tuner.router, prefix="/api/v1", tags=["Tuner Portal"])
app.include_router(_admin.router)
app.include_router(twofa.router)
app.include_router(partnerships.router, prefix="/api/v1", tags=["Partnerships"])
app.include_router(mechstore.router, prefix="/api/v1", tags=["Mechanic Store"])


@app.get("/")
def root():
    """Route racine"""
    return {
        "message": "Bienvenue sur l'API TomoBily",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }
