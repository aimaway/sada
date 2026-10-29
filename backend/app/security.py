"""Sécurité applicative : TOTP (Google Authenticator), codes SMS hachés, chiffrement au repos.

- pyotp pour un TOTP standard RFC 6238 (compatible Google Authenticator).
- Les codes SMS sont stockés HACHÉS (sha256) avec expiration + compteur de tentatives.
- Le secret TOTP est chiffré au repos (Fernet dérivé de SECRET_KEY) et n'est JAMAIS
  exposé par les API de profil ; il n'est visible qu'une seule fois pendant l'enrôlement.
"""
import base64
import hashlib
import secrets

import pyotp
from cryptography.fernet import Fernet

from app.config import settings


def _fernet() -> Fernet:
    key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode()).digest())
    return Fernet(key)


def encrypt_secret(plaintext: str) -> str:
    return _fernet().encrypt(plaintext.encode()).decode()


def decrypt_secret(token: str) -> str:
    return _fernet().decrypt(token.encode()).decode()


def generate_totp_secret() -> str:
    return pyotp.random_base32()


def totp_provisioning_uri(secret: str, account_label: str) -> str:
    """URI otpauth:// standard (à encoder en QR code côté client)."""
    return pyotp.TOTP(secret).provisioning_uri(name=account_label, issuer_name="TomoBily")


def verify_totp(secret: str, code: str, last_counter: int | None = None):
    """Vérifie un code TOTP avec fenêtre de tolérance + anti-rejeu.

    Retourne (ok, new_counter). Un code déjà consommé (counter <= last_counter)
    est rejeté même s'il est encore dans la fenêtre de validité.
    """
    totp = pyotp.TOTP(secret)
    # valid_window=1 => ±30s, tolérance horloge raisonnable
    if not totp.verify(str(code).strip(), valid_window=1):
        return False, last_counter
    counter = int(totp.now() // 30)
    if last_counter is not None and counter <= int(last_counter):
        return False, last_counter  # replay
    return True, counter


def hash_sms_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


def generate_sms_code() -> str:
    """Code numérique 6 chiffres cryptographiquement sûr (jamais hardcodé)."""
    return f"{secrets.randbelow(1_000_000):06d}"
