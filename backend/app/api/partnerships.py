"""API Partenariats entre professionnels (seller / mechanic / tuner).

Regles metier :
- Matrice de roles autorises (validee COTE BACKEND sur chaque requete) :
    seller   -> mechanic, tuner
    mechanic -> tuner, seller
    tuner    -> mechanic, seller
- Decouverte "a proximite" : ville du profil provider (fallback zone de service),
  distance haversine uniquement si coordonnees disponibles pour les deux parties ;
  sinon indication claire "zone de service" — jamais de distance inventee.
- Confidentialite : seules les informations PUBLIQUES de decouverte professionnelle
  sont renvoyees (nom pro, categorie, bio, specialites, zone publique, note).
  JAMAIS l'e-mail de connexion, telephone prive, adresse privee ou champs comptes.
- Entitlement premium : le backend est autoritaire. En production, un abonnement
  actif requis ; en mode demo (settings.DEMO_MODE et non-production), override
  serveur explicitement identifie (jamais activable depuis le client).
"""
import math
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config import settings
from app.core.rbac import get_current_user
from app.database import get_db
from app.models import (
    User, ProviderProfile, PartnershipInvitation, PartnershipStatus,
    Notification, Subscription,
)

router = APIRouter(prefix="/partnerships", tags=["Partnerships"])

# Matrice : role initiateur -> roles cibles autorises
ALLOWED_TARGETS = {
    "seller": {"mechanic", "tuner"},
    "mechanic": {"tuner", "seller"},
    "tuner": {"mechanic", "seller"},
}


def partnership_entitlement(user: User, db: Session) -> dict:
    """Le backend decide si la fonctionnalite premium est disponible.

    - Demo/dev (DEMO_MODE=True et ENVIRONMENT != production) : override serveur
      ETIQUETE demo_premium (le frontend ne peut pas l'activer lui-meme).
    - Production : abonnement actif exige pour le role.
    """
    if settings.DEMO_MODE and settings.ENVIRONMENT != "production":
        return {"allowed": True, "source": "demo_premium",
                "note": "Accès premium accordé par l'override DÉMO du serveur (non facturé, non production)."}
    active = (db.query(Subscription)
              .filter(Subscription.user_id == user.id,
                      Subscription.status == "active")
              .first())
    if active is None:
        return {"allowed": False, "source": "subscription_required"}
    expires = getattr(active, "expires_at", None)
    if expires is not None and expires.replace(tzinfo=None) < datetime.utcnow():
        return {"allowed": False, "source": "subscription_expired"}
    return {"allowed": True, "source": "subscription"}


def _public_provider_payload(p: ProviderProfile, viewer: User, dist_km=None) -> dict:
    """Champs strictement publics de decouverte professionnelle (filtrage reponse backend)."""
    return {
        "provider_id": p.id,
        "business_name": p.name,
        "category": p.type.value if hasattr(p.type, "value") else str(p.type),
        "bio": p.bio,
        "specializations": p.specialties or [],
        "services": (p.services or [])[:8],
        "public_service_area": p.city or p.service_zone,
        "verified": bool(p.verified),
        "rating": round(float(p.rating or 0), 2),
        "review_count": int(p.review_count or 0),
        # AUCUN champ prive : pas d'email, pas de telephone, pas d'adresse detaillee,
        # pas de wallet, pas d'identifiants de compte.
        "_distance_km": round(dist_km, 1) if dist_km is not None else None,
        "_proximity_basis": "coordinates" if dist_km is not None else "city_fallback",
    }


def _haversine_km(lat1, lng1, lat2, lng2):
    try:
        R = 6371.0
        la1, lo1, la2, lo2 = map(math.radians, [float(lat1), float(lng1), float(lat2), float(lng2)])
        h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
        return 2 * R * math.asin(math.sqrt(h))
    except (TypeError, ValueError):
        return None


def _my_provider(db: Session, user: User) -> ProviderProfile:
    p = db.query(ProviderProfile).filter(ProviderProfile.user_id == user.id).first()
    if not p:
        raise HTTPException(status_code=400, detail="Profil professionnel requis pour utiliser les partenariats.")
    return p


class InviteBody(BaseModel):
    target_provider_id: int
    message: Optional[str] = Field(default=None, max_length=1000)


@router.get("/entitlement")
def entitlement(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ent = partnership_entitlement(user, db)
    return {**ent, "role": user.role}


@router.get("/discover")
def discover(
    category: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 20,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Professionnels eligibles a proximite (ville/zone de service), champs publics uniquement."""
    ent = partnership_entitlement(user, db)
    if not ent["allowed"]:
        raise HTTPException(status_code=403, detail="Service premium : abonnement requis.")
    if user.role not in ALLOWED_TARGETS:
        raise HTTPException(status_code=403, detail="Votre rôle n'est pas éligible aux partenariats.")
    me = _my_provider(db, user)
    allowed_roles = ALLOWED_TARGETS[user.role]
    if category and category not in allowed_roles:
        raise HTTPException(status_code=403, detail=f"Cible '{category}' non autorisée pour le rôle '{user.role}'.")
    wanted = [category] if category else sorted(allowed_roles)

    rows = (db.query(ProviderProfile)
            .join(User, User.id == ProviderProfile.user_id)
            .filter(ProviderProfile.user_id != user.id,
                    User.status == "active")
            .all())
    results = []
    for p in rows:
        ptype = p.type.value if hasattr(p.type, "value") else str(p.type)
        if ptype not in wanted:
            continue
        # Proximite : coordonnees si disponibles des deux cotes, sinon ville en fallback explicite.
        dist = None
        city_match = False
        if me.lat and me.lng and p.lat and p.lng:
            dist = _haversine_km(me.lat, me.lng, p.lat, p.lng)
        elif me.city and p.city and me.city.strip().lower() == p.city.strip().lower():
            city_match = True
        else:
            # sans coordonnees ni ville commune -> exclure de "a proximite"
            continue
        if q:
            hay = " ".join([p.name or "", p.bio or "", " ".join(p.specialties or [])]).lower()
            if q.lower() not in hay:
                continue
        results.append((p, dist, city_match))

    results.sort(key=lambda t: (t[1] is None, t[1] if t[1] is not None else 0))
    items = [_public_provider_payload(p, user, d) for (p, d, cm) in results[:max(1, min(limit, 50))]]
    return {
        "items": items,
        "basis": {"your_city": me.city, "mode": "coordinates+city_fallback"},
        "entitlement_source": ent["source"],
        "total": len(results),
    }


@router.get("/providers/{provider_id}")
def provider_public_summary(provider_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Resume public d'un professionnel (sans donner acces a son compte prive)."""
    ent = partnership_entitlement(user, db)
    if not ent["allowed"]:
        raise HTTPException(status_code=403, detail="Service premium : abonnement requis.")
    if user.role not in ALLOWED_TARGETS:
        raise HTTPException(status_code=403, detail="Rôle non éligible.")
    p = db.query(ProviderProfile).filter(ProviderProfile.id == provider_id).first()
    if not p or p.user_id == user.id:
        raise HTTPException(status_code=404, detail="Professionnel introuvable.")
    ptype = p.type.value if hasattr(p.type, "value") else str(p.type)
    if ptype not in ALLOWED_TARGETS[user.role]:
        raise HTTPException(status_code=403, detail=f"Cible '{ptype}' non autorisée pour le rôle '{user.role}'.")
    return _public_provider_payload(p, user)


@router.post("/invite")
def invite(body: InviteBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ent = partnership_entitlement(user, db)
    if not ent["allowed"]:
        raise HTTPException(status_code=403, detail="Service premium : abonnement requis.")
    if user.role not in ALLOWED_TARGETS:
        raise HTTPException(status_code=403, detail="Rôle non éligible aux partenariats.")
    me = _my_provider(db, user)
    target = db.query(ProviderProfile).filter(ProviderProfile.id == body.target_provider_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Professionnel introuvable.")
    if target.user_id == user.id:
        raise HTTPException(status_code=400, detail="Impossible de s'inviter soi-même.")
    tuser = db.query(User).filter(User.id == target.user_id).first()
    if not tuser or (tuser.status or "active") != "active":
        raise HTTPException(status_code=404, detail="Professionnel introuvable.")
    ttype = target.type.value if hasattr(target.type, "value") else str(target.type)
    if ttype not in ALLOWED_TARGETS[user.role]:
        raise HTTPException(status_code=403, detail=f"Partenariat {user.role} → {ttype} non autorisé.")

    # Anti-doublon : une invitation pending OU acceptee existe deja dans un sens ?
    existing = (db.query(PartnershipInvitation)
                .filter(((PartnershipInvitation.inviter_provider_id == me.id) & (PartnershipInvitation.invitee_provider_id == target.id)) |
                        ((PartnershipInvitation.inviter_provider_id == target.id) & (PartnershipInvitation.invitee_provider_id == me.id)))
                .filter(PartnershipInvitation.status.in_([PartnershipStatus.PENDING.value, PartnershipStatus.ACCEPTED.value]))
                .first())
    if existing:
        raise HTTPException(status_code=409, detail="Une invitation active ou un partenariat existe déjà avec ce professionnel.")

    inv = PartnershipInvitation(
        inviter_user_id=user.id, invitee_user_id=target.user_id,
        inviter_provider_id=me.id, invitee_provider_id=target.id,
        status=PartnershipStatus.PENDING.value, message=body.message,
    )
    db.add(inv)
    db.flush()
    db.add(Notification(
        user_id=target.user_id, type="partnership_invite",
        title="Invitation de partenariat",
        body=f"{me.name} souhaite devenir votre partenaire." + (f" Message : {body.message}" if body.message else ""),
        link="/partnerships/incoming", data={"invitation_id": inv.id},
    ))
    db.commit()
    return {"ok": True, "invitation_id": inv.id, "status": "pending"}


def _serialize(inv: PartnershipInvitation, db: Session, as_inviter: bool) -> dict:
    me_p = db.query(ProviderProfile).filter(ProviderProfile.id == (inv.inviter_provider_id if as_inviter else inv.invitee_provider_id)).first()
    other_p = db.query(ProviderProfile).filter(ProviderProfile.id == (inv.invitee_provider_id if as_inviter else inv.inviter_provider_id)).first()
    return {
        "id": inv.id,
        "status": inv.status,
        "direction": "outgoing" if as_inviter else "incoming",
        "message": inv.message,
        "created_at": inv.created_at.isoformat() if inv.created_at else None,
        "responded_at": inv.responded_at.isoformat() if inv.responded_at else None,
        "counterpart": _public_provider_payload(other_p, None) if other_p else None,
    }


@router.get("/invitations")
def list_invitations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    incoming = (db.query(PartnershipInvitation)
                .filter(PartnershipInvitation.invitee_user_id == user.id)
                .order_by(PartnershipInvitation.created_at.desc()).all())
    outgoing = (db.query(PartnershipInvitation)
                .filter(PartnershipInvitation.inviter_user_id == user.id)
                .order_by(PartnershipInvitation.created_at.desc()).all())
    return {
        "incoming": [_serialize(i, db, as_inviter=False) for i in incoming],
        "outgoing": [_serialize(i, db, as_inviter=True) for i in outgoing],
    }


@router.get("/partners")
def list_partners(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    acc = (db.query(PartnershipInvitation)
           .filter(PartnershipInvitation.status == PartnershipStatus.ACCEPTED.value)
           .filter((PartnershipInvitation.inviter_user_id == user.id) | (PartnershipInvitation.invitee_user_id == user.id))
           .all())
    out = []
    for i in acc:
        as_inviter = i.inviter_user_id == user.id
        out.append(_serialize(i, db, as_inviter))
    return {"items": out}


class RespondBody(BaseModel):
    action: str  # accept | decline


@router.post("/invitations/{invitation_id}/respond")
def respond(invitation_id: int, body: RespondBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    inv = db.query(PartnershipInvitation).filter(PartnershipInvitation.id == invitation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation introuvable.")
    if inv.invitee_user_id != user.id:
        # seul le destinataire peut repondre (anti-acces objet via manipulation d'id)
        raise HTTPException(status_code=403, detail="Non autorisé.")
    if inv.status != PartnershipStatus.PENDING.value:
        raise HTTPException(status_code=409, detail="Cette invitation a déjà été traitée.")
    if body.action not in ("accept", "decline"):
        raise HTTPException(status_code=400, detail="Action invalide.")
    inv.status = PartnershipStatus.ACCEPTED.value if body.action == "accept" else PartnershipStatus.DECLINED.value
    inv.responded_at = datetime.utcnow()
    inviter = db.query(ProviderProfile).filter(ProviderProfile.id == inv.inviter_provider_id).first()
    invitee = db.query(ProviderProfile).filter(ProviderProfile.id == inv.invitee_provider_id).first()
    db.add(Notification(
        user_id=inv.inviter_user_id,
        type="partnership_response",
        title=("Partenariat accepté" if body.action == "accept" else "Invitation déclinée"),
        body=f"{invitee.name if invitee else 'Le professionnel'} a {('accepté' if body.action=='accept' else 'décliné')} votre invitation.",
        link="/partnerships", data={"invitation_id": inv.id},
    ))
    db.add(Notification(
        user_id=inv.invitee_user_id, type="partnership_response",
        title=("Partenariat actif" if body.action == "accept" else "Invitation déclinée"),
        body="Vous êtes maintenant partenaires." if body.action == "accept" else "Votre réponse a été enregistrée.",
        link="/partnerships", data={"invitation_id": inv.id},
    ))
    db.commit()
    return {"ok": True, "status": inv.status}


@router.post("/invitations/{invitation_id}/withdraw")
def withdraw(invitation_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    inv = db.query(PartnershipInvitation).filter(PartnershipInvitation.id == invitation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation introuvable.")
    if inv.inviter_user_id != user.id:
        raise HTTPException(status_code=403, detail="Seul l'émetteur peut retirer son invitation.")
    if inv.status != PartnershipStatus.PENDING.value:
        raise HTTPException(status_code=409, detail="Seules les invitations en attente peuvent être retirées.")
    inv.status = PartnershipStatus.WITHDRAWN.value
    inv.responded_at = datetime.utcnow()
    db.add(Notification(user_id=inv.invitee_user_id, type="partnership_response",
                        title="Invitation retirée",
                        body=f"{inv and (db.query(ProviderProfile).filter(ProviderProfile.id==inv.inviter_provider_id).first().name)} a retiré son invitation.",
                        link="/partnerships/incoming", data={"invitation_id": inv.id}))
    db.commit()
    return {"ok": True, "status": inv.status}
