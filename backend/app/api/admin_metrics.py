"""
Console Admin — "Control Center" des métriques de démarrage.

Permet aux admins de piloter manuellement, pour chaque compte (client,
mécanicien, tuner, vendeur) :
  - les étoiles / note moyenne + nombre d'avis   (ProviderProfile.rating / review_count)
  - le nombre de jobs effectués                  (ProviderProfile.jobs_completed)
  - les données du profil client                 (CustomerProfile: loyalty_points,
    total_jobs, total_spent)
Ces compteurs sont normalement calculés par la plateforme ; ce module sert de
levier d'amorçage ("first start") pour les nouveaux pros et clients démo.

Toutes les actions sont journalisées dans `audit_logs`.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.core.rbac import require_role
from app.models import (
    User, UserRole, ProviderProfile, CustomerProfile, AuditLog, Review, Job, JobStatus,
    ServiceRequest,
)

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Metrics Control"])


def _log(db: Session, admin: User, action: str, resource_type: str,
         resource_id: Optional[int], details: dict):
    db.add(AuditLog(user_id=admin.id, action=action, resource_type=resource_type,
                    resource_id=resource_id, details=details or {}))


def _get_user(db: Session, user_id: int) -> User:
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(404, "Utilisateur non trouvé")
    return u


@router.get("/metrics/{user_id}")
def get_metrics(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Lit les compteurs contrôlables d'un compte (tous rôles)."""
    user = _get_user(db, user_id)
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == user_id).first()
    customer = db.query(CustomerProfile).filter(CustomerProfile.user_id == user_id).first()

    out = {
        "user_id": user.id,
        "full_name": user.full_name,
        "phone": user.phone,
        "role": user.role.value if hasattr(user.role, "value") else str(user.role),
        "provider": None,
        "customer": None,
    }
    if provider:
        reviews = (
            db.query(Review)
            .filter(Review.provider_id == provider.id)
            .order_by(Review.created_at.desc())
            .limit(50)
            .all()
        )
        out["provider"] = {
            "id": provider.id,
            "type": provider.type.value if hasattr(provider.type, "value") else str(provider.type),
            "name": provider.name,
            "rating": provider.rating or 0.0,
            "review_count": provider.review_count or 0,
            "jobs_completed": provider.jobs_completed or 0,
            "response_time": provider.response_time or 0,
            "completion_rate": provider.completion_rate or 0.0,
            "verified": bool(provider.verified),
            "verification_status": provider.verification_status,
            "reviews": [
                {"id": r.id, "rating": r.rating, "comment": r.comment,
                 "created_at": r.created_at.isoformat() if r.created_at else None}
                for r in reviews
            ],
        }
    if customer:
        out["customer"] = {
            "loyalty_points": customer.loyalty_points or 0,
            "total_jobs": customer.total_jobs or 0,
            "total_spent": customer.total_spent or 0,
        }
    return out


@router.put("/metrics/{user_id}/provider")
def update_provider_metrics(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """
    Ajuste manuellement les compteurs d'un pro (mécanicien / tuner / vendeur) :
      rating (0-5), review_count, jobs_completed, response_time, completion_rate.
    Options supplémentaires : verified (bool), verification_status (string).
    """
    user = _get_user(db, user_id)
    provider = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    if not provider:
        raise HTTPException(404, "Ce compte n'a pas de profil provider (pro uniquement)")

    def _num(key, lo, hi, cast):
        if key in payload and payload[key] is not None:
            try:
                v = cast(payload[key])
            except (TypeError, ValueError):
                raise HTTPException(400, f"Valeur invalide pour {key}")
            if v < lo or v > hi:
                raise HTTPException(400, f"{key} doit être entre {lo} et {hi}")
            return v
        return None

    changes = {}
    mapping = {
        "rating": _num("rating", 0, 5, float),
        "review_count": _num("review_count", 0, 1_000_000, int),
        "jobs_completed": _num("jobs_completed", 0, 1_000_000, int),
        "response_time": _num("response_time", 0, 10_000, int),
        "completion_rate": _num("completion_rate", 0, 100, float),
    }
    for field, val in mapping.items():
        if val is not None:
            old = getattr(provider, field)
            setattr(provider, field, val)
            changes[field] = {"from": old, "to": val}

    if "verified" in payload:
        provider.verified = bool(payload["verified"])
        changes["verified"] = payload["verified"]
    if "verification_status" in payload:
        st = str(payload["verification_status"])
        if st not in ("pending", "approved", "rejected", "flagged", "under_review", "verified"):
            raise HTTPException(400, "verification_status inconnu")
        provider.verification_status = st
        changes["verification_status"] = st

    if not changes:
        raise HTTPException(400, "Aucune valeur à mettre à jour")

    _log(db, current_user, "provider_metrics_update", "provider_profile",
         provider.id, {"user_id": user.id, "changes": {k: str(v) for k, v in changes.items()}})
    db.commit()
    db.refresh(provider)
    return {
        "ok": True,
        "provider": {
            "rating": provider.rating, "review_count": provider.review_count,
            "jobs_completed": provider.jobs_completed, "response_time": provider.response_time,
            "completion_rate": provider.completion_rate, "verified": bool(provider.verified),
            "verification_status": provider.verification_status,
        },
    }


@router.put("/metrics/{user_id}/customer")
def update_customer_metrics(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Ajuste les compteurs du profil client : loyalty_points, total_jobs, total_spent (centimes)."""
    user = _get_user(db, user_id)
    if user.role != UserRole.CUSTOMER:
        raise HTTPException(400, "Ce compte n'est pas un client")
    cp = db.query(CustomerProfile).filter(CustomerProfile.user_id == user.id).first()
    if not cp:
        cp = CustomerProfile(user_id=user.id)
        db.add(cp)
        db.flush()

    changes = {}
    for field, lo, hi in (("loyalty_points", 0, 10_000_000), ("total_jobs", 0, 1_000_000), ("total_spent", 0, 1_000_000_000)):
        if field in payload and payload[field] is not None:
            try:
                v = int(payload[field])
            except (TypeError, ValueError):
                raise HTTPException(400, f"Valeur invalide pour {field}")
            if v < lo or v > hi:
                raise HTTPException(400, f"{field} doit être entre {lo} et {hi}")
            changes[field] = {"from": getattr(cp, field), "to": v}
            setattr(cp, field, v)

    # miroir sur User.loyalty_points si la colonne existe
    if "loyalty_points" in changes and hasattr(user, "loyalty_points"):
        user.loyalty_points = cp.loyalty_points

    if not changes:
        raise HTTPException(400, "Aucune valeur à mettre à jour")

    _log(db, current_user, "customer_metrics_update", "customer_profile",
         cp.id, {"user_id": user.id, "changes": {k: str(v) for k, v in changes.items()}})
    db.commit()
    return {"ok": True, "customer": {"loyalty_points": cp.loyalty_points,
                                     "total_jobs": cp.total_jobs, "total_spent": cp.total_spent}}


@router.post("/providers/{provider_id}/seed-reviews")
def seed_reviews(
    provider_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """
    Amorce sociale : crée N avis répartis autour d'une note cible et recalcule
    rating / review_count du provider. Utile pour donner immédiatement de la
    crédibilité à un nouveau mécanicien / tuner / vendeur.
    Body: { count: int (1..200), avg_rating: float (0..5) }
    """
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()
    if not provider:
        raise HTTPException(404, "Provider introuvable")
    try:
        count = int(payload.get("count", 10))
        avg = float(payload.get("avg_rating", 4.8))
    except (TypeError, ValueError):
        raise HTTPException(400, "count / avg_rating invalides")
    if not (1 <= count <= 200):
        raise HTTPException(400, "count doit être entre 1 et 200")
    if not (0 <= avg <= 5):
        raise HTTPException(400, "avg_rating doit être entre 0 et 5")

    demo_customers = db.query(User).filter(User.role == UserRole.CUSTOMER).limit(count).all()
    if not demo_customers:
        raise HTTPException(400, "Aucun compte client disponible pour porter les avis")

    # job_id est NOT NULL : on s'appuie sur les jobs réels du provider, sinon
    # on crée un job de démonstration complété une seule fois.
    jobs = (
        db.query(Job)
        .filter(Job.provider_id == provider.id)
        .order_by(Job.created_at.desc())
        .limit(count)
        .all()
    )
    if not jobs:
        anchor_req = ServiceRequest(
            customer_id=demo_customers[0].id,
            scenario="demo_seed",
            vehicle_type="car",
            description="Demande de démonstration créée par la console admin (amorçage avis).",
            lat=33.5731, lng=-7.5898,
            proposed_price=0,
            status="completed",
        )
        db.add(anchor_req)
        db.flush()
        anchor_job = Job(
            request_id=anchor_req.id,
            customer_id=demo_customers[0].id,
            provider_id=provider.id,
            status=JobStatus.COMPLETED,
            agreed_price=0,
        )
        db.add(anchor_job)
        db.flush()
        jobs = [anchor_job]

    total = 0
    for i in range(count):
        # distribution simple autour de la moyenne (écart max ±1 étoile)
        base = max(1, min(5, round(avg)))
        spread = [base, base, min(5, base + 1), max(1, base - 1), base]
        rating = max(1, min(5, spread[i % len(spread)]))
        total += rating
        cust = demo_customers[i % len(demo_customers)]
        job = jobs[i % len(jobs)]
        db.add(Review(
            job_id=job.id,
            customer_id=cust.id,
            provider_id=provider.id,
            rating=rating,
            comment="Avis de démonstration ajouté depuis la console admin (amorçage).",
        ))

    existing = provider.review_count or 0
    new_count = existing + count
    current_sum = (provider.rating or 0.0) * existing
    provider.rating = round((current_sum + total) / new_count, 2)
    provider.review_count = new_count

    _log(db, current_user, "provider_seed_reviews", "provider_profile", provider.id,
         {"count": count, "target_avg": avg, "new_rating": provider.rating,
          "new_review_count": provider.review_count})
    db.commit()
    return {"ok": True, "rating": provider.rating, "review_count": provider.review_count}
