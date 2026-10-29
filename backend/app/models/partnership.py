"""Invitations de partenariat entre professionnels (seller/mechanic/tuner)."""
import enum

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, UniqueConstraint, JSON
from sqlalchemy.sql import func

from app.database import Base


class PartnershipStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"


class PartnershipInvitation(Base):
    __tablename__ = "partnership_invitations"
    __table_args__ = (
        # Un seul actif (pending/accepted) par paire ordonnée ; la contrainte
        # est complétée côté applicatif (SQLite ne supporte pas les index partiels existants).
        UniqueConstraint("inviter_provider_id", "invitee_provider_id", name="uq_partnership_pair"),
    )

    id = Column(Integer, primary_key=True, index=True)
    inviter_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    invitee_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    inviter_provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    invitee_provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)

    status = Column(String(20), default=PartnershipStatus.PENDING.value, index=True)
    message = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    responded_at = Column(DateTime(timezone=True), nullable=True)
    extra = Column(JSON, default={})
