"""Dashboard client TomoBily — statistiques RÉELLES agrégées côté serveur.

Aucun chiffre inventé : chaque métrique provient de la base (requests, offres,
jobs, commandes, profil client). Le frontend affiche des états vides quand les
données n'existent pas.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.rbac import get_current_user
from app.models import User, CustomerProfile, ServiceRequest, Job, Offer
from app.models.seller import Order, OrderStatus

router = APIRouter(prefix="/api/v1/customer", tags=["customer-dashboard"])


@router.get("/dashboard")
def customer_dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    reqs = db.query(ServiceRequest).filter(
        ServiceRequest.customer_id == user.id).order_by(
        ServiceRequest.created_at.desc()).all()

    active_reqs = [r for r in reqs if r.status in ("open", "offers_received")]
    offers_received = sum(
        len([o for o in r.offers if o.status == "pending"]) for r in reqs)

    jobs = db.query(Job).filter(Job.customer_id == user.id).all()
    upcoming_bookings = [j for j in jobs if str(
        getattr(j.status, "value", j.status)) in ("pending", "accepted", "on_the_way")]

    orders = db.query(Order).filter(Order.customer_id == user.id).all()
    total_spent = sum(o.total or 0 for o in orders
                      if str(getattr(o.payment_status, "value", o.payment_status)) == "completed")
    # Les jobs complétés font aussi partie de la dépense réelle du client.
    total_spent += sum((j.final_amount or j.agreed_price or 0) for j in jobs
                       if str(getattr(j.status, "value", j.status)) in ("completed", "auto_closed"))

    cp = db.query(CustomerProfile).filter(CustomerProfile.user_id == user.id).first()

    recent_requests = [{
        "id": r.id, "status": r.status, "description": r.description,
        "vehicle_summary": getattr(r, "vehicle_summary", None),
        "offer_count": len([o for o in r.offers if o.status == "pending"]),
        "created_at": r.created_at.isoformat() if r.created_at else None,
    } for r in reqs[:5]]

    recent_orders = [{
        "id": o.id, "order_number": o.order_number,
        "status": str(getattr(o.status, "value", o.status)),
        "payment_status": str(getattr(o.payment_status, "value", o.payment_status)),
        "total": o.total,
        "created_at": o.created_at.isoformat() if o.created_at else None,
    } for o in sorted(orders, key=lambda x: x.created_at, reverse=True)[:5]]

    recent_jobs = [{
        "id": j.id, "status": str(getattr(j.status, "value", j.status)),
        "agreed_price": j.agreed_price,
        "created_at": j.created_at.isoformat() if j.created_at else None,
    } for j in sorted(jobs, key=lambda x: x.created_at, reverse=True)[:5]]

    return {
        "ok": True,
        "stats": {
            "active_requests": len(active_reqs),
            "offers_received": offers_received,
            "upcoming_bookings": len(upcoming_bookings),
            "total_spent_centimes": total_spent,
        },
        "profile": {
            "display_name": user.display_name or user.full_name,
            "city": user.city,
            "vehicles": (cp.vehicles if cp else []) or [],
            "loyalty_points": (cp.loyalty_points if cp else 0) or 0,
        },
        "recent_requests": recent_requests,
        "recent_orders": recent_orders,
        "recent_jobs": recent_jobs,
    }
