"""
API Admin — contrôle total des comptes (clients, mécaniciens, tuners, vendeurs),
vérifications KYC, litiges, modération et paramètres plateforme.

Tous les endpoints exigent le rôle "admin" (RBAC require_role).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func as sa_func
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.core.rbac import require_role
from app.models import (
    User, UserRole, ProviderProfile, ServiceRequest, Offer, Job, JobStatus, Review,
)

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


def get_password_hash(password: str) -> str:
    """Hash bcrypt local (évite l'import circulaire avec app.main)."""
    from passlib.context import CryptContext
    return CryptContext(schemes=["bcrypt"], deprecated="auto").hash(
        password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    )


def _uid(user: User) -> int:
    """id numérique fiable (current_user est un snapshot détaché)."""
    return int(str(user.id))


def _user_dict(u: User, provider: Optional[ProviderProfile] = None) -> dict:
    d = {
        "id": u.id,
        "phone": u.phone,
        "email": u.email,
        "full_name": u.full_name,
        "role": u.role.value if hasattr(u.role, "value") else u.role,
        "status": u.status or "active",
        "language": u.language,
        "is_demo": bool(u.is_demo),
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "last_login": u.last_login.isoformat() if u.last_login else None,
    }
    if provider is not None:
        d["provider"] = {
            "id": provider.id,
            "type": provider.type.value if hasattr(provider.type, "value") else provider.type,
            "name": provider.name,
            "slug": provider.slug,
            "verified": bool(provider.verified),
            "verification_status": provider.verification_status,
            "badges": provider.badges or [],
            "rating": provider.rating,
            "review_count": provider.review_count,
            "jobs_completed": provider.jobs_completed,
            "city": provider.city,
            "specialties": provider.specialties or [],
        }
    return d


# ============ Dashboard & stats ============

@router.get("/stats")
def admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    def count(q):
        return db.query(sa_func.count()).select_from(q).scalar() or 0

    mechanics = (
        db.query(User)
        .join(ProviderProfile, ProviderProfile.user_id == User.id)
        .filter(User.role == UserRole.MECHANIC)
        .count()
    )
    verified_mechanics = (
        db.query(User)
        .join(ProviderProfile, ProviderProfile.user_id == User.id)
        .filter(User.role == UserRole.MECHANIC, ProviderProfile.verified == True)  # noqa: E712
        .count()
    )
    pending_verifications = (
        db.query(ProviderProfile)
        .filter(ProviderProfile.verification_status.in_(["pending", "under_review"]))
        .count()
    )
    open_requests = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.status.in_(["open", "offers_received"]))
        .count()
    )
    active_jobs = (
        db.query(Job)
        .filter(Job.status.notin_([JobStatus.COMPLETED, JobStatus.CANCELLED, JobStatus.AUTO_CLOSED]))
        .count()
    )
    completed_jobs = db.query(Job).filter(Job.status.in_([JobStatus.COMPLETED, JobStatus.AUTO_CLOSED])).count()
    disputes = db.query(Job).filter(Job.dispute_open == True).count()  # noqa: E712
    revenue_cents = (
        db.query(sa_func.coalesce(sa_func.sum(Job.agreed_price), 0))
        .filter(Job.status.in_([JobStatus.COMPLETED, JobStatus.AUTO_CLOSED]))
        .scalar()
    )

    return {
        "users": {
            "total": count(User),
            "customers": db.query(User).filter(User.role == UserRole.CUSTOMER).count(),
            "mechanics": mechanics,
            "tuners": db.query(User).filter(User.role == UserRole.TUNER).count(),
            "sellers": db.query(User).filter(User.role == UserRole.SELLER).count(),
            "admins": db.query(User).filter(User.role == UserRole.ADMIN).count(),
            "suspended": db.query(User).filter(User.status != "active").count(),
        },
        "providers": {
            "total": count(ProviderProfile),
            "verified_mechanics": verified_mechanics,
            "pending_verifications": pending_verifications,
        },
        "marketplace": {
            "open_requests": open_requests,
            "total_requests": count(ServiceRequest),
            "active_jobs": active_jobs,
            "completed_jobs": completed_jobs,
            "offers_total": count(Offer),
        },
        "quality": {
            "open_disputes": disputes,
            "reviews_total": count(Review),
            "avg_rating": db.query(sa_func.avg(Review.rating)).scalar() or 0.0,
        },
        "revenue": {"completed_volume_cents": int(revenue_cents)},
    }


# ============ Gestion des utilisateurs (clients + providers) ============

@router.get("/users")
def list_users(
    role: Optional[str] = None,
    status_filter: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    query = db.query(User)
    if role:
        try:
            query = query.filter(User.role == UserRole(role))
        except ValueError:
            raise HTTPException(400, f"Rôle inconnu: {role}")
    if status_filter:
        query = query.filter(User.status == status_filter)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(User.full_name.ilike(like), User.phone.like(f"%{q}%"), User.email.ilike(like)))

    total = query.count()
    page = max(1, page)
    page_size = min(max(1, page_size), 200)
    users = (
        query.order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    # Joindre les profils providers en une requête
    ids = [u.id for u in users]
    providers = (
        db.query(ProviderProfile).filter(ProviderProfile.user_id.in_(ids)).all() if ids else []
    )
    by_user = {p.user_id: p for p in providers}
    items = [_user_dict(u, by_user.get(u.id)) for u in users]
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.get("/users/{user_id}")
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Utilisateur non trouvé")
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == user_id).first()

    job_filters = [Job.customer_id == user_id]
    if provider:
        job_filters.append(Job.provider_id == provider.id)
    jobs = (
        db.query(Job)
        .filter(or_(*job_filters))
        .order_by(Job.created_at.desc())
        .limit(20)
        .all()
    )
    requests = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.customer_id == user_id)
        .order_by(ServiceRequest.created_at.desc())
        .limit(20)
        .all()
    )
    detail = _user_dict(user, provider)
    detail["jobs"] = [
        {
            "id": j.id,
            "status": j.status.value if hasattr(j.status, "value") else j.status,
            "agreed_price": j.agreed_price,
            "dispute_open": bool(j.dispute_open),
            "created_at": j.created_at.isoformat() if j.created_at else None,
        }
        for j in jobs
    ]
    detail["requests"] = [
        {
            "id": r.id,
            "scenario": r.scenario,
            "status": r.status,
            "proposed_price": r.proposed_price,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in requests
    ]
    if provider:
        detail["offers_count"] = db.query(Offer).filter(Offer.provider_id == provider.id).count()
    return detail


@router.post("/users")
def create_user(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    phone = (payload.get("phone") or "").strip()
    full_name = (payload.get("full_name") or "").strip()
    role = payload.get("role", "customer")
    password = payload.get("password") or "changeme123"
    if not phone or not full_name:
        raise HTTPException(400, "phone et full_name sont requis")
    try:
        ur = UserRole(role)
    except ValueError:
        raise HTTPException(400, f"Rôle inconnu: {role}")
    if db.query(User).filter(User.phone == phone).first():
        raise HTTPException(409, "Un compte existe déjà avec ce téléphone")

    user = User(
        phone=phone,
        email=payload.get("email"),
        full_name=full_name,
        role=ur,
        status=payload.get("status", "active"),
        language=payload.get("language", "fr"),
        password_hash=get_password_hash(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_dict(user)


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Utilisateur non trouvé")
    for field in ("full_name", "email", "language"):
        if field in payload:
            setattr(user, field, payload[field])
    if "role" in payload:
        try:
            new_role = UserRole(payload["role"])
        except ValueError:
            raise HTTPException(400, f"Rôle inconnu: {payload['role']}")
        if _uid(current_user) == user.id and new_role != UserRole.ADMIN:
            raise HTTPException(400, "Impossible de retirer votre propre rôle admin")
        user.role = new_role
    db.commit()
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    return _user_dict(user, provider)


@router.put("/users/{user_id}/status")
def set_user_status(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Activer / suspendre / bannir un compte (bloqué si dernier admin actif)."""
    new_status = payload.get("status")
    if new_status not in ("active", "suspended", "banned"):
        raise HTTPException(400, "status doit être active | suspended | banned")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Utilisateur non trouvé")

    if new_status != "active":
        role_val = user.role.value if hasattr(user.role, "value") else user.role
        if role_val == UserRole.ADMIN.value and _uid(current_user) == user.id:
            raise HTTPException(400, "Impossible de désactiver votre propre compte")
        admins_active = (
            db.query(User)
            .filter(User.role == UserRole.ADMIN, User.status == "active", User.id != user.id)
            .count()
        )
        if role_val == UserRole.ADMIN.value and admins_active == 0:
            raise HTTPException(400, "Refusé : ce compte est le dernier admin actif")

    user.status = new_status
    db.commit()
    return _user_dict(user)


@router.put("/users/{user_id}/reset-password")
def reset_password(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    new_password = payload.get("password")
    if not new_password or len(str(new_password)) < 6:
        raise HTTPException(400, "password requis (min 6 caractères)")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Utilisateur non trouvé")
    user.password_hash = get_password_hash(str(new_password))
    db.commit()
    return {"ok": True, "user_id": user_id}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "Utilisateur non trouvé")
    if _uid(current_user) == user.id:
        raise HTTPException(400, "Impossible de supprimer votre propre compte")
    role_val = user.role.value if hasattr(user.role, "value") else user.role
    if role_val == UserRole.ADMIN.value:
        other_admins = (
            db.query(User).filter(User.role == UserRole.ADMIN, User.id != user.id).count()
        )
        if other_admins == 0:
            raise HTTPException(400, "Refusé : ce compte est le seul admin")
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    if provider:
        db.delete(provider)
    db.delete(user)
    db.commit()
    return {"ok": True, "deleted_user_id": user_id}


# ============ Vérification des providers (mécaniciens / tuners / vendeurs) ============

@router.get("/verifications")
def verification_queue(
    type_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    query = db.query(ProviderProfile, User).join(User, User.id == ProviderProfile.user_id)
    if type_filter:
        query = query.filter(ProviderProfile.type == type_filter)
    rows = (
        query.filter(ProviderProfile.verification_status.in_(["pending", "under_review"]))
        .order_by(ProviderProfile.created_at.asc())
        .all()
    )
    return {
        "items": [
            {
                "provider_id": p.id,
                "user_id": u.id,
                "name": p.name,
                "type": p.type.value if hasattr(p.type, "value") else p.type,
                "phone": u.phone,
                "city": p.city,
                "specialties": p.specialties or [],
                "verification_status": p.verification_status,
                "verification_data": p.verification_data or {},
                "rating": p.rating,
                "jobs_completed": p.jobs_completed,
            }
            for p, u in rows
        ],
        "total": len(rows),
    }


@router.put("/providers/{provider_id}/verify")
def verify_provider(
    provider_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    action = payload.get("action")
    if action not in ("approve", "reject", "flag", "unset"):
        raise HTTPException(400, "action doit être approve | reject | flag | unset")
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()
    if not provider:
        raise HTTPException(404, "Provider non trouvé")

    if action == "approve":
        provider.verified = True
        provider.verification_status = "verified"
        badges = list(provider.badges or [])
        if "verified" not in badges:
            badges.append("verified")
        provider.badges = badges
    elif action == "reject":
        provider.verified = False
        provider.verification_status = "rejected"
        provider.badges = [b for b in (provider.badges or []) if b != "verified"]
    elif action == "flag":
        provider.verified = False
        provider.verification_status = "flagged"
        provider.badges = [b for b in (provider.badges or []) if b != "verified"]
    else:  # unset -> renvoie en file d'attente
        provider.verified = False
        provider.verification_status = "pending"
        provider.badges = [b for b in (provider.badges or []) if b != "verified"]

    reason = payload.get("reason")
    if reason:
        data = dict(provider.verification_data or {})
        data["last_admin_note"] = reason
        data["note_at"] = datetime.utcnow().isoformat()
        provider.verification_data = data

    db.commit()
    return {
        "provider_id": provider.id,
        "verified": bool(provider.verified),
        "verification_status": provider.verification_status,
        "badges": provider.badges or [],
    }


@router.put("/providers/{provider_id}")
def update_provider(
    provider_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Édition admin complète d'un profil provider."""
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()
    if not provider:
        raise HTTPException(404, "Provider non trouvé")
    editable = ("name", "bio", "city", "specialties", "hourly_rate_min", "service_radius_km", "badges")
    for k in editable:
        if k in payload:
            setattr(provider, k, payload[k])
    db.commit()
    return {
        "provider_id": provider.id,
        "name": provider.name,
        "city": provider.city,
        "specialties": provider.specialties or [],
        "badges": provider.badges or [],
    }


# ============ Demandes, jobs & litiges ============

@router.get("/requests")
def list_requests(
    status_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    query = db.query(ServiceRequest, User).join(User, User.id == ServiceRequest.customer_id)
    if status_filter:
        query = query.filter(ServiceRequest.status == status_filter)
    total = query.count()
    rows = (
        query.order_by(ServiceRequest.created_at.desc())
        .offset((max(1, page) - 1) * min(max(1, page_size), 200))
        .limit(min(max(1, page_size), 200))
        .all()
    )
    return {
        "items": [
            {
                "id": r.id,
                "customer_id": u.id,
                "customer_name": u.full_name,
                "scenario": r.scenario,
                "vehicle_type": r.vehicle_type,
                "description": r.description,
                "proposed_price": r.proposed_price,
                "status": r.status,
                "urgency": r.urgency,
                "source": r.source,
                "offers_count": db.query(Offer).filter(Offer.request_id == r.id).count(),
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r, u in rows
        ],
        "total": total,
        "page": page,
    }


@router.get("/jobs")
def list_jobs(
    status_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    query = db.query(Job, User, ProviderProfile).outerjoin(
        User, User.id == Job.customer_id
    ).outerjoin(ProviderProfile, ProviderProfile.id == Job.provider_id)
    if status_filter:
        query = query.filter(Job.status == status_filter)
    total = query.count()
    rows = (
        query.order_by(Job.created_at.desc())
        .offset((max(1, page) - 1) * min(max(1, page_size), 200))
        .limit(min(max(1, page_size), 200))
        .all()
    )
    return {
        "items": [
            {
                "id": j.id,
                "request_id": j.request_id,
                "customer_id": c.id if c else None,
                "customer_name": c.full_name if c else None,
                "provider_id": j.provider_id,
                "provider_name": p.name if p else None,
                "status": j.status.value if hasattr(j.status, "value") else j.status,
                "agreed_price": j.agreed_price,
                "dispute_open": bool(j.dispute_open),
                "created_at": j.created_at.isoformat() if j.created_at else None,
            }
            for j, c, p in rows
        ],
        "total": total,
        "page": page,
    }


@router.get("/disputes")
def list_disputes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    jobs = db.query(Job).filter(Job.dispute_open == True).order_by(Job.updated_at.desc()).all()  # noqa: E712
    out = []
    for j in jobs:
        cust = db.query(User).filter(User.id == j.customer_id).first()
        prov = db.query(ProviderProfile).filter(ProviderProfile.id == j.provider_id).first()
        out.append({
            "job_id": j.id,
            "status": j.status.value if hasattr(j.status, "value") else j.status,
            "customer": cust.full_name if cust else None,
            "provider": prov.name if prov else None,
            "reason": j.dispute_reason,
            "agreed_price": j.agreed_price,
            "updated_at": j.updated_at.isoformat() if j.updated_at else None,
        })
    return {"items": out, "total": len(out)}


@router.post("/jobs/{job_id}/resolve-dispute")
def resolve_dispute(
    job_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    outcome = payload.get("outcome")
    if outcome not in ("resolved", "cancelled", "upheld_customer", "upheld_provider"):
        raise HTTPException(400, "outcome invalide")
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(404, "Job non trouvé")
    if not job.dispute_open:
        raise HTTPException(409, "Aucun litige ouvert sur ce job")
    job.dispute_open = False
    note = payload.get("note")
    if note:
        job.dispute_reason = f"{job.dispute_reason or ''}\n[admin:{_uid(current_user)}] {note}".strip()
    if outcome == "cancelled":
        job.status = JobStatus.CANCELLED
    db.commit()
    return {"job_id": job.id, "outcome": outcome, "status": job.status.value if hasattr(job.status, "value") else job.status}


@router.post("/requests/{request_id}/close")
def force_close_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(404, "Demande non trouvée")
    if req.status in ("accepted", "cancelled", "expired"):
        raise HTTPException(409, f"Transition invalide depuis '{req.status}'")
    req.status = "cancelled"
    db.commit()
    return {"request_id": req.id, "status": req.status}


# ============ Audit trail ============

@router.get("/audit")
def audit_trail(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Journal consolidé des actions récentes sur la plateforme."""
    events = []
    for u in db.query(User).order_by(User.created_at.desc()).limit(limit).all():
        events.append({"type": "user_created", "id": u.id, "detail": f"{u.full_name} ({u.role})", "at": u.created_at.isoformat() if u.created_at else None})
    for r in db.query(ServiceRequest).order_by(ServiceRequest.created_at.desc()).limit(limit).all():
        events.append({"type": "request", "id": r.id, "detail": f"{r.scenario} — statut {r.status}", "at": r.created_at.isoformat() if r.created_at else None})
    for j in db.query(Job).order_by(Job.created_at.desc()).limit(limit).all():
        events.append({"type": "job", "id": j.id, "detail": f"statut {j.status.value if hasattr(j.status,'value') else j.status}", "at": j.created_at.isoformat() if j.created_at else None})
    events.sort(key=lambda e: e["at"] or "", reverse=True)
    return {"items": events[:limit], "total": len(events)}
