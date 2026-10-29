"""Modèles 2FA : codes SMS hachés (expiration + tentatives) et secret TOTP chiffré (pending → active)."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from app.database import Base


class UserTotpSecret(Base):
    """Secret TOTP d'un utilisateur. Chiffré au repos ; jamais exposé hors enrollement."""
    __tablename__ = "user_totp_secrets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)

    secret_encrypted = Column(Text, nullable=False)     # Fernet(secret base32)
    status = Column(String(20), default="pending")      # pending -> active (après vérification)
    last_counter = Column(Integer, nullable=True)       # anti-rejeu
    activated_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SmsVerificationCode(Base):
    """Code de vérification SMS à usage unique, stocké HACHÉ."""
    __tablename__ = "sms_verification_codes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    code_hash = Column(String(64), nullable=False)      # sha256(code)
    purpose = Column(String(30), nullable=False, default="2fa_login")  # 2fa_login | phone_verify
    expires_at = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, default=0)
    max_attempts = Column(Integer, default=5)
    consumed_at = Column(DateTime(timezone=True), nullable=True)
    invalidated_at = Column(DateTime(timezone=True), nullable=True)    # invalidé par un renvoi

    created_at = Column(DateTime(timezone=True), server_default=func.now())
