"""
API IFIX AI — sessions de diagnostic, droit d'usage (3 sessions gratuites),
consentement de partage, enregistrements d'audit.
Application côté serveur faisant autorite ; le frontend ne peut pas la contourner.
Moteur de regles local ETIQUETE comme tel (pas de faux LLM, pas de facturation reelle).
"""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import Base, get_db
from app.core.rbac import get_current_user
from app.models import User, UserRole, ProviderProfile

router = APIRouter(prefix="/api/v1/ifix", tags=["ifix-ai"])

FREE_SESSION_ALLOWANCE = 3

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func as sqlfunc

# ---- Modeles dedies (n'existent pas encore dans models/__init__.py) ----

class AiSession(Base):
    __tablename__ = "ai_sessions"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    vehicle_summary = Column(String(255), nullable=True)
    scenario_slug = Column(String(100), nullable=True)
    status = Column(String(30), default="active")  # active|completed|abandoned
    result_json = Column(JSON, nullable=True)
    consent_status = Column(String(20), default="pending")  # pending|granted|declined
    shared_summary_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=sqlfunc.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)


class AiMessage(Base):
    __tablename__ = "ai_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("ai_sessions.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # user|assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=sqlfunc.now())


class ConsentAudit(Base):
    __tablename__ = "ifix_consent_audit"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("ai_sessions.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decision = Column(String(20), nullable=False)  # granted|declined|revoked
    shared_fields = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=sqlfunc.now())


def ensure_ifix_tables(db: Session):
    Base.metadata.create_all(bind=db.bind, tables=[
        AiSession.__table__, AiMessage.__table__, ConsentAudit.__table__])


# ---- Moteur de regles local (reponses ETIQUETES "moteur de regles", non un LLM) ----

SAFETY_KEYWORDS = {
    "frein": "Probleme de freinage potentiel : arretez le vehicule en securite et faites appel a un professionnel avant de reprendre la route.",
    "brake": "Braking issue detected: stop the vehicle safely and seek professional inspection before driving again.",
    "fumee": "Fumee observee : risque de surchauffe ou de fuite. Arretez le moteur et consultez en urgence.",
    "smoke": "Smoke observed: possible overheating or leak. Stop the engine and seek urgent help.",
    "surchauffe": "Surchauffe : arretez le vehicule, laissez refroidir, ne ouvrez pas le radiateur chaud.",
    "overheat": "Overheating: stop the vehicle, let it cool; never open a hot radiator cap.",
    "essence": "Odeur/fuite de carburant possible : eloignez-vous des sources d'etincelle et contactez un professionnel.",
    "fuel leak": "Possible fuel leak: avoid sparks, do not smoke, contact a professional immediately.",
    "direction": "Probleme de direction : ne conduisez pas, demandez une assistance professionnelle.",
}

RULE_SETS = {
    "no-start": {
        "questions": ["Entendez-vous un clic en demarrant ?", "Les phares s'allument-ils normalement ?"],
        "causes": ["Batterie dechargee (probable)", "Alternateur (possible)", "Demarreur (moins probable)"],
        "category_id": "1",
    },
    "brake-noise": {
        "questions": ["La pedale vibre-t-elle ?", "Le voyant de frein est-il allume ?"],
        "causes": ["Plaquettes usees (probable)", "Disques rayures (possible)"],
        "category_id": "3",
    },
    "overheat": {
        "questions": ["Le temperature monte-t-elle rapidement ?", "Voyant rouge au tableau de bord ?"],
        "causes": ["Refroidissement defectueux (probable)", "Fuite de liquide (possible)"],
        "category_id": "6",
    },
    "default": {
        "questions": ["Quand le probleme apparait-il ?", "Depuis quand ?"],
        "causes": ["Cause incertaine — inspection professionnelle recommandee"],
        "category_id": "8",
    },
}


def _match_rule(text: str):
    low = text.lower()
    for kw, advice in SAFETY_KEYWORDS.items():
        if kw in low:
            return {"safety": advice}
    for slug, rs in RULE_SETS.items():
        if slug != "default" and slug.replace("-", " ") in low:
            return {"rule": rs}
    return {"rule": RULE_SETS["default"]}


# ---- Droits d'usage (server-side, resistant aux requetes concurrentes) ----

def used_sessions(db: Session, customer_id: int) -> int:
    """Nombre de sessions REELLEMENT creees avec succes (les echecs ne comptent pas)."""
    return db.query(func.count(AiSession.id)).filter(
        AiSession.customer_id == customer_id).scalar() or 0


@router.get("/entitlement")
def entitlement(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ensure_ifix_tables(db)
    used = used_sessions(db, user.id)
    remaining = max(FREE_SESSION_ALLOWANCE - used, 0)
    return {"ok": True, "free_allowance": FREE_SESSION_ALLOWANCE,
            "used": used, "remaining": remaining,
            "premium_active": False,  # facturation non implementee (placeholder explicite)
            "upgrade_available": False}


class StartSessionBody(BaseModel):
    vehicle_summary: Optional[str] = None
    first_message: str = Field(..., min_length=3, max_length=2000)


@router.post("/sessions", status_code=status.HTTP_201_CREATED)
def start_session(body: StartSessionBody, db: Session = Depends(get_db),
                  user: User = Depends(get_current_user)):
    if user.role != UserRole.CUSTOMER:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Reserve aux clients")
    ensure_ifix_tables(db)
    # Comptage AVANT insertion ; l'insertion n'est validee que si le quota
    # est respecte (garde double : le post-check en dessous annule toute
    # creation concurrente qui depasserait le droit d'usage).
    used = used_sessions(db, user.id)
    if used >= FREE_SESSION_ALLOWANCE:
        raise HTTPException(status.HTTP_402_PAYMENT_REQUIRED,
                            {"error": "allowance_exhausted",
                             "message": "Vos 3 sessions gratuites sont utilisees. "
                                        "Passez a IFIX Premium pour continuer. "
                                        "Les conseils de securite restent accessibles."})
    sess = AiSession(customer_id=user.id, vehicle_summary=body.vehicle_summary,
                     status="active")
    db.add(sess)
    try:
        db.flush()
    except Exception:
        db.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR,
                            "Erreur de creation de session (non comptee)")
    # Concurrence : deux requetes simultanees peuvent toutes deux passer le
    # pre-check avant flush. On recompte APRES insertion ; si le nombre de
    # sessions validees depasse le quota, on annule cette creation (aucune
    # session fantome ne consomme le droit d'usage, l'erreur n'est pas comptee).
    total = used_sessions(db, user.id)
    if total > FREE_SESSION_ALLOWANCE:
        db.rollback()
        raise HTTPException(status.HTTP_402_PAYMENT_REQUIRED,
                            {"error": "allowance_exhausted",
                             "message": "Sessions gratuites epuisees."})
    match = _match_rule(body.first_message)
    intro = body.first_message[:200]
    db.add(AiMessage(session_id=sess.id, role="user", content=intro))
    reply = ("[IFIX AI — moteur de regles local, orientation informationnelle, "
             "diagnostic non confirme] ")
    if "safety" in match:
        reply += "⚠️ " + match["safety"]
        sess.scenario_slug = "safety"
    else:
        rs = match["rule"]
        sess.scenario_slug = next((k for k, v in RULE_SETS.items() if v is rs), "default")
        reply += "Questions utiles : " + " ; ".join(rs["questions"])
    sess.result_json = {"engine": "local-rule-v1", "llm": False, **match}
    db.add(AiMessage(session_id=sess.id, role="assistant", content=reply))
    db.commit(); db.refresh(sess)
    return {"ok": True, "session_id": sess.id, "reply": reply,
            "remaining_free": FREE_SESSION_ALLOWANCE - used_sessions(db, user.id)}


class MessageBody(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


@router.post("/sessions/{session_id}/messages")
def add_message(session_id: int, body: MessageBody, db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    """Messages supplementaires DANS une session existante : ne consomment PAS de session."""
    ensure_ifix_tables(db)
    sess = db.get(AiSession, session_id)
    if not sess or sess.customer_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Session introuvable")
    db.add(AiMessage(session_id=sess.id, role="user", content=body.content))
    match = _match_rule(body.content)
    reply = "[IFIX AI — moteur de regles local] "
    if "safety" in match:
        reply += "⚠️ " + match["safety"]
    else:
        reply += "Pistes envisagees (non confirmees) : " + " ; ".join(match["rule"]["causes"])
    db.add(AiMessage(session_id=sess.id, role="assistant", content=reply))
    db.commit()
    return {"ok": True, "reply": reply}


@router.get("/sessions")
def list_sessions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Historique prive du client uniquement (isolation des donnees)."""
    ensure_ifix_tables(db)
    sess = db.query(AiSession).filter(AiSession.customer_id == user.id)\
             .order_by(AiSession.created_at.desc()).all()
    return {"ok": True, "sessions": [{"id": s.id, "status": s.status,
            "vehicle_summary": s.vehicle_summary, "scenario_slug": s.scenario_slug,
            "consent_status": s.consent_status,
            "created_at": s.created_at.isoformat() if s.created_at else None}
            for s in sess]}


class ShareBody(BaseModel):
    provider_id: int
    include_photos: bool = False


@router.post("/sessions/{session_id}/share")
def share_summary(session_id: int, body: ShareBody, db: Session = Depends(get_db),
                  user: User = Depends(get_current_user)):
    """Consentement EXPLICITE : construit un resume minimal, journalise la decision."""
    ensure_ifix_tables(db)
    sess = db.get(AiSession, session_id)
    if not sess or sess.customer_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Session introuvable")
    msgs = db.query(AiMessage).filter(AiMessage.session_id == sess.id).all()
    summary = {
        "vehicle": sess.vehicle_summary,
        "symptoms_reported": [m.content for m in msgs if m.role == "user"],
        "possible_causes_unconfirmed": (sess.result_json or {}).get("rule", {}).get("causes", [])
            if isinstance(sess.result_json, dict) else [],
        "safety_notes": (sess.result_json or {}).get("safety")
            if isinstance(sess.result_json, dict) else None,
        "photos_included": body.include_photos,
        "disclaimer": "Resume genere par IFIX AI (orientation informationnelle). Diagnostic NON CONFIRME — inspection professionnelle requise.",
    }
    sess.consent_status = "granted"
    sess.shared_summary_json = {"provider_id": body.provider_id, **summary}
    db.add(ConsentAudit(session_id=sess.id, customer_id=user.id,
                        decision="granted", shared_fields=list(summary.keys())))
    db.commit()
    return {"ok": True, "shared_summary": summary}


@router.post("/sessions/{session_id}/decline-share")
def decline_share(session_id: int, db: Session = Depends(get_db),
                  user: User = Depends(get_current_user)):
    ensure_ifix_tables(db)
    sess = db.get(AiSession, session_id)
    if not sess or sess.customer_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Session introuvable")
    sess.consent_status = "declined"
    db.add(ConsentAudit(session_id=sess.id, customer_id=user.id,
                        decision="declined", shared_fields=None))
    db.commit()
    return {"ok": True, "message": "Conversation restee privee."}


@router.get("/safety-guidance")
def safety_guidance(q: str, db: Session = Depends(get_db),
                    user: User = Depends(get_current_user)):
    """Conseils de securite TOUJOURS accessibles, meme quota epuise (jamais factures)."""
    ensure_ifix_tables(db)
    low = q.lower()
    for kw, advice in SAFETY_KEYWORDS.items():
        if kw in low:
            return {"ok": True, "advice": advice, "matched_keyword": kw,
                    "free": True, "consumes_session": False}
    return {"ok": True,
            "advice": "Aucun signe d'urgence immediate detecte dans votre description. "
                      "En cas de doute (freinage, direction, fumee, odeur de carburant), "
                      "arretez le vehicule et consultez un professionnel.",
            "matched_keyword": None, "free": True, "consumes_session": False}


@router.get("/recommend-providers")
def recommend_providers(category_id: str, limit: int = 6,
                        db: Session = Depends(get_db),
                        user: User = Depends(get_current_user)):
    """Providers REELS approuves pertinents ; <5 si peu de correspondances (rien d'invente)."""
    ensure_ifix_tables(db)
    providers = db.query(ProviderProfile).filter(
        ProviderProfile.verification_status == "approved").all()
    scored = []
    for p in providers:
        tags = set((p.specialties or []) + (p.services or []))
        relevant = category_id in tags or any(category_id.lower() in str(t).lower() for t in tags)
        if not relevant:
            continue
        reasons = []
        if p.rating and p.rating >= 4.5:
            reasons.append(f"Noté {p.rating}/5 ({p.review_count} avis)")
        if p.jobs_completed and p.jobs_completed > 50:
            reasons.append(f"{p.jobs_completed} interventions réalisées")
        if p.is_online:
            reasons.append("En ligne")
        scored.append({"id": p.id, "name": p.name, "city": p.city,
                       "rating": p.rating, "review_count": p.review_count,
                       "reason": " · ".join(reasons) or f"Spécialité : {category_id}"})
    scored.sort(key=lambda x: -(x["rating"] or 0))
    return {"ok": True, "providers": scored[:limit],
            "note": "Recommandations basees sur les donnees reels de la plateforme."}
