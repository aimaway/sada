"""
API Marketplace SADA — demandes, distribution aux providers éligibles, offres inDrive-style.
Réutilise les modèles existants (ServiceRequest, Offer, Job) et ajoute les colonnes
nécessaires (catégorie, urgence, éligibilité, source AI) sans créer de tables en double.
"""
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Response
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.rbac import get_current_user
from app.models import User, UserRole, ProviderProfile, ServiceRequest, Offer, Job, JobStatus

router = APIRouter(prefix="/api/v1/marketplace", tags=["marketplace"])

# ---- Règles métier (miroir de src/ifix/ifixStore.ts côté frontend) ----
MIN_PRICE_CENTS = 50 * 100      # 50 MAD
MAX_PRICE_CENTS = 20000 * 100   # 20 000 MAD
REQUEST_EXPIRY_HOURS = 48

class _ReqStatus:
    """Statuts canoniques de ServiceRequest. La colonne `status` est une String;
    les valeurs stockees sont les noms des membres de l'Enum legacy
    (open/offers_received/accepted/cancelled/expired). Un seul point de verite."""
    OPEN = "open"
    OFFERS_RECEIVED = "offers_received"
    ACCEPTED = "accepted"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


OPEN_STATUSES = (_ReqStatus.OPEN, _ReqStatus.OFFERS_RECEIVED)
CLOSED_FOR_OFFERS = (_ReqStatus.ACCEPTED, _ReqStatus.CANCELLED, _ReqStatus.EXPIRED, "closed")


def _ensure_columns(db: Session, table: str, cols: List[tuple]):
    """ALTER TABLE idempotent + rafraîchit la reflection SQLAlchemy.

    Sans refresh, les nouvelles colonnes sont invisibles à l'ORM : un objet
    chargé ensuite renverrait getattr(...) == MISSING et l'accès aux relations
    déclencherait des SELECT sur des colonnes inexistantes.
    """
    from sqlalchemy import text, inspect as sa_inspect
    if db.bind.dialect.name != "sqlite":
        return  # en prod : migrations Alembic dédiées
    existing = {r[1] for r in db.execute(text(f"PRAGMA table_info({table})"))}
    changed = False
    for col, ddl in cols:
        if col not in existing:
            db.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {ddl}"))
            changed = True
    db.commit()
    if changed:
        try:
            db.bind.engine.table_schema.reflect_table(
                db.bind.engine.tables[table], None)
        except Exception:
            pass


def ensure_marketplace_columns(db: Session):
    """Ajoute les colonnes marketplace manquantes si besoin (SQLite dev, idempotent)."""
    _ensure_columns(db, "service_requests", [
        ("category_id", "VARCHAR(50)"),
        ("urgency", "VARCHAR(20) DEFAULT 'normal'"),
        ("source", "VARCHAR(20) DEFAULT 'customer'"),
        ("ai_session_id", "INTEGER"),
        ("eligible_provider_ids", "TEXT"),
        ("preferred_time", "VARCHAR(100)"),
        ("service_mode", "VARCHAR(30)"),
        ("vehicle_summary", "VARCHAR(255)"),
    ])
    _ensure_columns(db, "offers", [
        ("availability_at", "DATETIME"),
        ("estimated_duration_min", "INTEGER"),
        ("client_request_id", "VARCHAR(64)"),
    ])


def compute_eligible_providers(db: Session, category_id: str) -> List[int]:
    """Providers approuvés dont les specialites/services couvrent la catégorie."""
    providers = (
        db.query(ProviderProfile)
        .filter(ProviderProfile.verification_status == "approved")
        .all()
    )
    eligible = []
    for p in providers:
        tags = set((p.specialties or []) + (p.services or []))
        if category_id in tags or any(category_id.lower() in str(t).lower() for t in tags):
            eligible.append(p.id)
    return eligible


class CreateRequestBody(BaseModel):
    category_id: str = Field(..., min_length=1)
    description: str = Field(..., min_length=10)
    vehicle_type: str = "car"
    vehicle_summary: Optional[str] = None
    urgency: str = Field("normal", pattern="^(low|normal|urgent)$")
    preferred_time: Optional[str] = None
    service_mode: str = Field("at_garage", pattern="^(at_garage|at_home|roadside)$")
    location: str = "Casablanca"
    lat: float = 33.5731
    lng: float = -7.5898
    proposed_price: Optional[int] = Field(None, ge=0)
    ai_session_id: Optional[int] = None
    source: str = Field("customer", pattern="^(customer|ai_assisted)$")


class CreateOfferBody(BaseModel):
    request_id: int
    price: int = Field(..., ge=MIN_PRICE_CENTS, le=MAX_PRICE_CENTS)
    message: Optional[str] = Field(None, max_length=1000)
    estimated_arrival: Optional[int] = Field(None, ge=0, le=24 * 60)
    estimated_duration_min: Optional[int] = Field(None, ge=0, le=7 * 24 * 60)
    availability_at: Optional[datetime] = None
    includes_parts: bool = False
    client_request_id: Optional[str] = Field(None, max_length=64)  # idempotence


def _request_dict(r: ServiceRequest) -> dict:
    return {
        "id": r.id,
        "customer_id": r.customer_id,
        "category_id": getattr(r, "category_id", None),
        "description": r.description,
        "urgency": getattr(r, "urgency", "normal"),
        "status": r.status,
        "source": getattr(r, "source", "customer"),
        "ai_session_id": getattr(r, "ai_session_id", None),
        "eligible_provider_ids": getattr(r, "eligible_provider_ids", None),
        "vehicle_summary": getattr(r, "vehicle_summary", None),
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "offer_count": len([o for o in r.offers if o.status == "pending"]),
    }


@router.post("/requests", status_code=status.HTTP_201_CREATED)
def create_request(body: CreateRequestBody, db: Session = Depends(get_db),
                   user: User = Depends(get_current_user)):
    if user.role != UserRole.CUSTOMER:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Réservé aux clients")
    ensure_marketplace_columns(db)
    eligible = compute_eligible_providers(db, body.category_id)
    if not eligible:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY,
                            "Aucun professionnel éligible pour ce service")
    req = ServiceRequest(
        customer_id=user.id,
        scenario=body.category_id,
        family=body.category_id,
        vehicle_type=body.vehicle_type,
        description=body.description,
        lat=body.lat, lng=body.lng, address=body.location,
        proposed_price=body.proposed_price or 0,
        status="open",
        expires_at=datetime.utcnow() + timedelta(hours=REQUEST_EXPIRY_HOURS),
    )
    db.add(req); db.flush()  # récupère req.id avant d'écrire les colonnes étendues
    # Écriture explicite via SQL : ces colonnes sont ajoutées par ALTER TABLE
    # hors du ORM (Base.metadata ne les connaît pas -> setattr serait ignoré).
    ext = {
        "category_id": body.category_id,
        "urgency": body.urgency,
        "source": body.source,
        "ai_session_id": body.ai_session_id,
        "eligible_provider_ids": ",".join(str(i) for i in eligible),
        "preferred_time": body.preferred_time,
        "service_mode": body.service_mode,
        "vehicle_summary": body.vehicle_summary,
    }
    from sqlalchemy import text as _text
    sets = ", ".join(f"{k} = :{k}" for k in ext)
    db.execute(_text(f"UPDATE service_requests SET {sets} WHERE id = :rid"),
               {**ext, "rid": req.id})
    db.commit()
    req = db.get(ServiceRequest, req.id)
    db.refresh(req)
    return {"ok": True, "request": _request_dict(req), "eligible_provider_ids": eligible}


@router.get("/requests/mine")
def my_requests(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ensure_marketplace_columns(db)
    reqs = db.query(ServiceRequest).filter(ServiceRequest.customer_id == user.id)\
             .order_by(ServiceRequest.created_at.desc()).all()
    return {"ok": True, "requests": [_request_dict(r) for r in reqs]}


@router.get("/requests/{request_id}/offers")
def list_offers(request_id: int, db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    """Seul le propriétaire voit les offres (séparation des données)."""
    ensure_marketplace_columns(db)
    req = db.get(ServiceRequest, request_id)
    if not req:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Demande introuvable")
    if req.customer_id != user.id and user.role != UserRole.ADMIN:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    offers = [{"id": o.id, "provider_id": o.provider_id, "price": o.price,
               "message": o.message, "status": o.status,
               "estimated_arrival": o.estimated_arrival,
               "includes_parts": o.includes_parts}
              for o in req.offers if o.status != "withdrawn"]
    return {"ok": True, "request": _request_dict(req), "offers": offers}


@router.get("/providers/inbox")
def provider_inbox(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Uniquement les demandes ouvertes où CE provider est éligible."""
    ensure_marketplace_columns(db)
    pp = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    if not pp:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Profil provider requis")
    open_reqs = db.query(ServiceRequest).filter(
        ServiceRequest.status.in_(OPEN_STATUSES)).all()
    visible = []
    for r in open_reqs:
        snap = {int(x) for x in (str(getattr(r, "eligible_provider_ids", "") or "").split(",") if getattr(r, "eligible_provider_ids", "") else []) if x.isdigit()}
        cat = getattr(r, "category_id", None) or r.scenario
        live = set(compute_eligible_providers(db, cat)) if cat else set()
        if pp.id in snap or pp.id in live:
            d = _request_dict(r)
            # Ne pas exposer l'identité/adresse exacte du client avant acceptation
            d.pop("customer_id", None)
            d["address_masked"] = (r.address or "")[:8] + "…"
            d["your_offer"] = any(o.provider_id == pp.id and o.status == "pending"
                                  for o in r.offers)
            visible.append(d)
    return {"ok": True, "requests": visible}


@router.post("/offers", status_code=status.HTTP_201_CREATED)
def create_offer(body: CreateOfferBody, response: Response,
                 db: Session = Depends(get_db),
                 user: User = Depends(get_current_user)):
    ensure_marketplace_columns(db)
    pp = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    if not pp:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Profil provider requis")
    # Verrou pessimiste sur la demande -> évite les acceptations concurrentes
    req = db.query(ServiceRequest).filter(ServiceRequest.id == body.request_id)\
            .with_for_update().first()
    if not req:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Demande introuvable")
    if req.status not in OPEN_STATUSES:
        raise HTTPException(status.HTTP_409_CONFLICT, "La demande n'accepte plus d'offres")
    if req.expires_at and req.expires_at < datetime.utcnow():
        req.status = "expired"; db.commit()
        raise HTTPException(status.HTTP_409_CONFLICT, "Demande expirée")
    # Fraîcheur : recalcul de l'éligibilité à la requête (les providers
    # créés/aprouvés après l'ouverture de la demande peuvent soumettre une offre),
    # en respectant les règles métier (catégorie, vérification, statut).
    cat = getattr(req, "category_id", None) or req.scenario
    live_elig = set(compute_eligible_providers(db, cat)) if cat else set()
    snap = {int(x) for x in (str(getattr(req, "eligible_provider_ids", "") or "").split(",") if getattr(req, "eligible_provider_ids", "") else []) if x.isdigit()}
    if pp.id not in live_elig and pp.id not in snap:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Provider non éligible pour cette demande")
    # Idempotence : rejeu du même client_request_id renvoie l'offre existante
    if body.client_request_id:
        existing = db.query(Offer).filter(
            Offer.request_id == req.id,
            Offer.client_request_id == body.client_request_id).first()
        if existing:
            response.status_code = status.HTTP_200_OK
            return {"ok": True, "offer_id": existing.id, "replayed": True}
    dup = db.query(Offer).filter(Offer.request_id == req.id,
                                 Offer.provider_id == pp.id,
                                 Offer.status == "pending").first()
    if dup:
        raise HTTPException(status.HTTP_409_CONFLICT, "Vous avez déjà une offre active (retirez-la d'abord)")
    offer = Offer(request_id=req.id, provider_id=pp.id, price=body.price,
                  message=body.message, estimated_arrival=body.estimated_arrival,
                  includes_parts=body.includes_parts, status="pending")
    db.add(offer); db.flush()  # offer.id nécessaire pour les colonnes étendues hors ORM
    from sqlalchemy import text as _text
    ext = {
        "availability_at": body.availability_at,
        "estimated_duration_min": body.estimated_duration_min,
        "client_request_id": body.client_request_id,
    }
    sets = ", ".join(f"{k} = :{k}" for k in ext)
    db.execute(_text(f"UPDATE offers SET {sets} WHERE id = :rid"),
               {**ext, "rid": offer.id})
    if req.status == "open":
        req.status = "offers_received"
    db.commit()
    return {"ok": True, "offer_id": offer.id}


class AcceptBody(BaseModel):
    offer_id: int
    client_request_id: Optional[str] = None


@router.post("/offers/accept")
def accept_offer(body: AcceptBody, db: Session = Depends(get_db),
                 user: User = Depends(get_current_user)):
    ensure_marketplace_columns(db)
    offer = db.query(Offer).filter(Offer.id == body.offer_id).first()
    if not offer:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Offre introuvable")
    # Relecture fraiche de la demande : le cache d'identite SQLAlchemy peut
    # servir un statut perime quand la meme Session est reutilisee entre
    # deux requetes HTTP (cas TestClient + SQLite). db.expire_all() n'existe
    # pas sur Session (API 2.x) et db.expunge_all() detacherait `offer` en
    # plein milieu du handler -> DetachedInstanceError. La solution correcte
    # est db.refresh(obj) qui force un SELECT depuis la base.
    req = db.get(ServiceRequest, offer.request_id)
    if not req:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Demande introuvable")
    db.refresh(req)
    db.refresh(offer)
    if req.customer_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    # Idempotence stricte : une demande deja acceptee n'accepte QUE l'offre
    # qui a gagne le verrou (la seule en status='accepted'). Reaccepter la
    # meme offre renvoie le meme Job (rejeu reseau sur /offers/accept) ;
    # toute autre offre recoit 409 -> invariant "1 demande = 1 Job".
    if req.status == "accepted":
        existing_job = db.query(Job).filter(Job.request_id == req.id).first()
        if existing_job and offer.status == "accepted" and offer.provider_id == existing_job.provider_id:
            return {"ok": True, "job_id": existing_job.id, "already_accepted": True}
        raise HTTPException(status.HTTP_409_CONFLICT, "Demande déjà acceptée")
    if req.status not in OPEN_STATUSES:
        raise HTTPException(status.HTTP_409_CONFLICT, "Demande fermée")
    from sqlalchemy import text as _text
    # 1) Verrou atomique au niveau SQL sur la DEMANDE (open->accepted).
    #    Un seul appel concurrent réussit — indépendant du dialecte
    #    (SQLite ignore FOR UPDATE). NB: le statut est stocké en colonne
    #    String ; on compare via bind params pour éviter tout formatage
    #    repr()/Enum qui rendrait le WHERE jamais vérifié (deux acceptations
    #    concurrentes passeraient alors toutes les deux -> 2 Jobs).
    placeholders = ", ".join(f":st{i}" for i in range(len(OPEN_STATUSES)))
    params = {"rid": req.id}
    for i, st in enumerate(OPEN_STATUSES):
        params[f"st{i}"] = str(getattr(st, "value", st))
    claimed = db.execute(_text(
        f"UPDATE service_requests SET status='accepted' "
        f"WHERE id=:rid AND status IN ({placeholders})"),
        params).rowcount
    if not claimed:
        db.rollback()
        # La demande a ete acceptee par un autre appel concurrent : on
        # retombe sur la branche idempotente au prochain appel. Pas de
        # expunge_all ici (detacherait offer/req en plein milieu).
        raise HTTPException(status.HTTP_409_CONFLICT, "Demande déjà attribuée")
    # 2) Verrou atomique sur l'OFFRE (pending->accepted). Si échec : rollback
    #    du verrou demande -> aucune incohérence possible.
    c2 = db.execute(_text(
        "UPDATE offers SET status='accepted' "
        "WHERE id=:oid AND request_id=:rid AND status='pending'"),
        {"oid": offer.id, "rid": req.id}).rowcount
    if not c2:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Offre non disponible")
    # Publier le verrou AVANT d'inserer le Job : un accept concurrent qui
    # arrive apres ce commit verra status='accepted' (rowcount=0 -> 409),
    # garantissant l'invariant "1 demande = 1 Job" meme en ecriture simultanee.
    # Publier le verrou, puis recharger proprement via refresh (jamais
    # expire_all/expunge_all : absents de Session 2.x / detachent les objets).
    db.commit()
    req = db.get(ServiceRequest, req.id)
    offer = db.get(Offer, offer.id)
    db.refresh(req)
    db.refresh(offer)
    # 3) Rejeter les offres rivales encore pending.
    for other in req.offers:
        if other.id != offer.id and other.status == "pending":
            other.status = "rejected"
    job = Job(request_id=req.id, customer_id=user.id, provider_id=offer.provider_id,
              status=JobStatus.PENDING, agreed_price=offer.price,
              accepted_at=datetime.utcnow())
    db.add(job); db.commit(); db.refresh(job)
    return {"ok": True, "job_id": job.id, "agreed_price": offer.price}


class CancelBody(BaseModel):
    request_id: int


@router.post("/requests/cancel")
def cancel_request(body: CancelBody, db: Session = Depends(get_db),
                   user: User = Depends(get_current_user)):
    ensure_marketplace_columns(db)
    req = db.query(ServiceRequest).filter(ServiceRequest.id == body.request_id)\
            .with_for_update().first()
    if not req:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Demande introuvable")
    if req.customer_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    if req.status == "accepted":
        raise HTTPException(status.HTTP_409_CONFLICT,
                            "Demande déjà acceptée — contactez le support")
    req.status = "cancelled"
    for o in req.offers:
        if o.status == "pending":
            o.status = "rejected"
    db.commit()
    return {"ok": True}


@router.post("/offers/{offer_id}/withdraw")
def withdraw_offer(offer_id: int, db: Session = Depends(get_db),
                   user: User = Depends(get_current_user)):
    ensure_marketplace_columns(db)
    pp = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    if not pp:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Profil provider requis")
    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.provider_id == pp.id).first()
    if not offer:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Offre introuvable")
    if offer.status != "pending":
        raise HTTPException(status.HTTP_409_CONFLICT, "Seules les offres actives peuvent être retirées")
    offer.status = "withdrawn"
    db.commit()
    return {"ok": True}
