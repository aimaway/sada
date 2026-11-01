"""
Wallet Gate API — "Budget Acceptance" pour les pros (mécanicien / tuner / vendeur).

Règles métier :
  - Un pro ne peut accepter une mission / projet / commande que si son wallet
    (ProviderProfile.wallet_balance, en centimes) couvre la commission due à la
    plateforme pour cette opération.
  - Taux par rôle (alignés avec src/shared/budgetGate.ts côté frontend) :
      mécanicien 10%, tuner 7%, vendeur 5%.
    Si settings.COMMISSION_RATE_PERCENT est défini (env), il sert de fallback
    global ; sinon on garde les taux par rôle (aucun taux inventé ailleurs).
  - rechargement du wallet via POST /wallet/top-up : incrémente wallet_balance,
    écrit une Transaction (type=ADJUSTMENT, status=COMPLETED) + un AuditLog.

Source de vérité : la base (ProviderProfile). Le frontend synchronise son
solde local affiché à partir de la réponse.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.core.rbac import get_current_user
from app.models import User, ProviderProfile, AuditLog
from app.models.financial import (
    Transaction, TransactionType, TransactionStatus, PaymentMethod,
)

router = APIRouter(prefix="/wallet", tags=["Wallet"])

# Taux de commission par rôle (fraction, pas pourcentage) — miroir exact de
# COMMISSION_RATES dans src/shared/budgetGate.ts.
COMMISSION_RATES = {
    "mechanic": 0.10,
    "tuner": 0.07,
    "seller": 0.05,
}


def _rate_for(provider_type: str) -> float:
    """Taux applicable : settings.COMMISSION_RATE_PERCENT si défini, sinon taux par rôle."""
    if settings.COMMISSION_RATE_PERCENT is not None:
        return float(settings.COMMISSION_RATE_PERCENT) / 100.0
    return COMMISSION_RATES.get(provider_type, 0.10)


def _get_provider(db: Session, user: User) -> ProviderProfile:
    profile = (
        db.query(ProviderProfile)
        .filter(ProviderProfile.user_id == user.id)
        .first()
    )
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil provider introuvable pour ce compte. "
                   "Terminez l'inscription pro avant d'utiliser le wallet.",
        )
    return profile


class CheckAcceptanceRequest(BaseModel):
    provider_type: str = Field(..., description="mechanic | tuner | seller")
    amount: int = Field(..., ge=0, description="Montant de la mission/commande en centimes")
    commission_rate: float | None = Field(
        default=None,
        description="Taux envoyé par le client (informatif). La valeur serveur fait foi.",
    )


class TopUpRequest(BaseModel):
    amount: int = Field(..., gt=0, description="Montant à créditer en centimes")
    method: str | None = Field(default="wallet", description="Moyen de paiement déclaré")


@router.post("/check-acceptance")
def check_acceptance(
    payload: CheckAcceptanceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Vérifie si le wallet du pro couvre la commission requise pour accepter."""
    ptype = (payload.provider_type or "").lower()
    if ptype not in COMMISSION_RATES:
        raise HTTPException(status_code=422, detail="provider_type invalide (mechanic|tuner|seller)")

    profile = _get_provider(db, current_user)

    # Cohérence profil/type (le type réel du profil fait foi s'il diverge).
    try:
        real_type = profile.type.value if hasattr(profile.type, "value") else str(profile.type)
        if real_type in COMMISSION_RATES and real_type != ptype:
            ptype = real_type
    except Exception:
        pass

    rate = _rate_for(ptype)
    commission_required = round(payload.amount * rate)
    balance = int(profile.wallet_balance or 0)
    allowed = balance >= commission_required

    return {
        "allowed": allowed,
        "balance": balance,
        "commission_required": commission_required,
        "commission_rate": rate,
        "amount": payload.amount,
        "provider_type": ptype,
        "min_wallet_balance": int(profile.min_wallet_balance or 0),
    }


@router.post("/top-up")
def top_up(
    payload: TopUpRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crédite le wallet du pro (démo/ajustement admin), journalise Transaction + AuditLog."""
    profile = _get_provider(db, current_user)

    before = int(profile.wallet_balance or 0)
    profile.wallet_balance = before + payload.amount

    tx = Transaction(
        transaction_id=f"TX-W-{uuid.uuid4().hex[:12].upper()}",
        type=TransactionType.ADJUSTMENT,
        to_user_id=current_user.id,
        amount=payload.amount,
        currency="MAD",
        net_amount=payload.amount,
        status=TransactionStatus.COMPLETED,
        reference_type="wallet_top_up",
        reference_id=profile.id,
        payment_method=(
            PaymentMethod(payload.method)
            if payload.method in PaymentMethod.__members__.values()
            else PaymentMethod.WALLET
        ),
        description=f"Rechargement wallet {getattr(profile.type, 'value', profile.type)} (démo)",
    )
    db.add(tx)

    db.add(AuditLog(
        user_id=current_user.id,
        action="wallet_top_up",
        resource_type="provider_profile",
        resource_id=profile.id,
        details={
            "amount": payload.amount,
            "balance_before": before,
            "balance_after": profile.wallet_balance,
            "transaction_id": tx.transaction_id,
        },
    ))
    db.commit()
    db.refresh(tx)

    return {
        "ok": True,
        "balance": int(profile.wallet_balance),
        "added": payload.amount,
        "transaction_id": tx.transaction_id,
    }
