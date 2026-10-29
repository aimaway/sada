"""Tests d'integration des fonctionnalites livrees : 2FA, partenariats, boutique mecanicien.

Pattern identique a test_marketplace.py : dependency_overrides[get_db] + tokens
mintes via create_access_token (sub=str(user.id)). Les codes SMS/TOTP sont obtenus
via l'adaptateur DEMO etiquete (dev_code / totp.now()) — aucun SMS reel envoye.
"""
from datetime import datetime, timedelta

import pytest
import pyotp
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect as sa_inspect, text
from sqlalchemy.orm import sessionmaker

from app.main import app, create_access_token, get_password_hash
from app.database import Base, get_db
from app.models import (User, UserRole, ProviderType, ProviderProfile, ProductCategory,
                        Product, Notification)
from app.models.seller import ProductStatus
from app.api.marketplace import ensure_marketplace_columns
from app.api.mechstore import ensure_store_columns
from app.config import settings

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_platform.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    ensure_marketplace_columns(db)
    ensure_store_columns(db)
    db.close()
    yield
    with engine.begin() as conn:
        conn.execute(text("PRAGMA foreign_keys=OFF"))
        for t in reversed(sa_inspect(engine).get_table_names()):
            conn.execute(text(f'DELETE FROM "{t}"'))
        conn.execute(text("PRAGMA foreign_keys=ON"))
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    yield db
    db.close()


# ---------------- helpers ----------------

def mk_user(db, phone, role=UserRole.CUSTOMER, pw="secret123", **kw):
    u = User(phone=phone, email=f"{phone}@test.local", password_hash=get_password_hash(pw),
             full_name=kw.pop("name", f"User {phone}"), role=role, status="active", **kw)
    db.add(u); db.commit(); db.refresh(u)
    return u


def auth(tok):
    return {"Authorization": f"Bearer {tok}"}


def tok_for(user, stage=None):
    data = {"sub": str(user.id)}
    if stage:
        data["stage"] = stage
    return create_access_token(data=data)


def mk_provider(db, user, ptype, city="Casablanca", lat=None, lng=None, name=None, address=None):
    p = ProviderProfile(user_id=user.id, type=ptype, slug=f"prov-{user.id}",
                        name=name or f"Pro {user.id}", city=city,
                        verification_status="approved",
                        specialties=["freins"], services=["vidange"])
    if address:
        p.address = address
    if lat is not None:
        p.lat, p.lng = lat, lng
    db.add(p); db.commit(); db.refresh(p)
    return p


# =====================================================================
# A. PROFIL & E-MAIL SUPPORT
# =====================================================================

def test_profile_patch_persists_and_protects_fields(db_session):
    u = mk_user(db_session, "0600000001")
    r = client.patch("/api/v1/users/me", headers=auth(tok_for(u)),
                     json={"first_name": "Ali", "last_name": "Bennani", "city": "Rabat",
                           "country": "Maroc", "support_contact_email": "ali.support@x.ma",
                           "notification_prefs": {"email": True, "sms": False}})
    assert r.status_code == 200, r.text
    body = r.json()["user"]
    assert body["first_name"] == "Ali" and body["city"] == "Rabat"
    # changer le contact support reinitialise la verification
    assert body["support_contact_email"] == "ali.support@x.ma"
    assert body["support_email_verified"] is False
    # champs privilegies ignores par construction du schema (pas d'effet)
    r2 = client.patch("/api/v1/users/me", headers=auth(tok_for(u)),
                      json={"role": "admin", "status": "disabled", "password_hash": "hack"})
    assert r2.status_code == 200
    fresh = db_session.query(User).filter(User.id == u.id).first()
    assert fresh.role == UserRole.CUSTOMER and fresh.status == "active"
    assert fresh.password_hash != "hack"
    # persistant apres re-lecture
    g = client.get("/api/v1/users/me", headers=auth(tok_for(u)))
    assert g.json()["display_name"]


def test_profile_patch_validation_errors(db_session):
    u = mk_user(db_session, "0600000002")
    r = client.patch("/api/v1/users/me", headers=auth(tok_for(u)),
                     json={"notification_prefs": {"email": "yes"}})
    assert r.status_code == 422
    r = client.patch("/api/v1/users/me", headers=auth(tok_for(u)),
                     json={"notification_prefs": {"unknown_key": True}})
    assert r.status_code == 422
    r = client.patch("/api/v1/users/me", headers=auth(tok_for(u)), json={"email": "not-an-email"})
    assert r.status_code == 422


def test_support_email_verification_flow_demo(db_session):
    u = mk_user(db_session, "0600000003")
    r = client.post("/api/v1/auth/2fa/support-email/send-code",
                    headers=auth(tok_for(u)), json={"email": "contact@myshop.ma"})
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["simulated"] is True and d["adapter"] == "console_test"
    code = d["dev_code"]
    r = client.post("/api/v1/auth/2fa/support-email/verify",
                    headers=auth(tok_for(u)), json={"email": "contact@myshop.ma", "code": "000000"})
    assert r.status_code == 400  # code invalide refuse
    r = client.post("/api/v1/auth/2fa/support-email/verify",
                    headers=auth(tok_for(u)), json={"email": "contact@myshop.ma", "code": code})
    assert r.status_code == 200
    fresh = db_session.query(User).filter(User.id == u.id).first()
    assert fresh.support_contact_email == "contact@myshop.ma"
    assert fresh.support_email_verified is True
    # le code consomme ne peut pas etre rejoue
    r = client.post("/api/v1/auth/2fa/support-email/verify",
                    headers=auth(tok_for(u)), json={"email": "contact@myshop.ma", "code": code})
    assert r.status_code == 400


# =====================================================================
# B. 2FA — SMS
# =====================================================================

def test_sms_2fa_enroll_verify_enforce_disable(db_session):
    u = mk_user(db_session, "0600000010")
    r = client.post("/api/v1/auth/2fa/sms/enroll", headers=auth(tok_for(u)))
    assert r.status_code == 200 and r.json()["simulated"] is True
    code = r.json()["dev_code"]
    # mauvais code -> refuse
    r = client.post("/api/v1/auth/2fa/sms/verify", headers=auth(tok_for(u)), json={"code": "999999"})
    assert r.status_code == 400
    # bon code -> actif
    r = client.post("/api/v1/auth/2fa/sms/verify", headers=auth(tok_for(u)), json={"code": code})
    assert r.status_code == 200
    fresh = db_session.query(User).filter(User.id == u.id).first()
    assert fresh.twofa_method == "sms" and fresh.phone_verified is True

    # LOGIN applique le second facteur : jeton partiel inutilisable
    r = client.post("/api/v1/auth/login", params={"phone": "0600000010", "password": "secret123"})
    assert r.status_code == 200
    d = r.json()
    assert d["requires_2fa"] is True and d["method"] == "sms"
    partial = d["access_token"]
    g = client.get("/api/v1/users/me", headers=auth(partial))
    assert g.status_code == 403  # stage=2fa refuse sur les routes protegees

    # challenge : emission du code de connexion puis verification
    r = client.post("/api/v1/auth/2fa/sms/send-login", headers=auth(partial), json={})
    assert r.status_code == 200, r.text
    login_code = r.json()["dev_code"]
    r = client.post("/api/v1/auth/2fa/challenge", headers=auth(partial), json={"code": login_code})
    assert r.status_code == 200, r.text
    full = r.json()["access_token"]
    g = client.get("/api/v1/users/me", headers=auth(full))
    assert g.status_code == 200

    # le code consomme ne peut pas etre rejoue
    r = client.post("/api/v1/auth/2fa/challenge", headers=auth(partial), json={"code": login_code})
    assert r.status_code == 400

    # desactivation exige le mot de passe
    r = client.post("/api/v1/auth/2fa/disable", headers=auth(full),
                    json={"method": "sms", "password": "wrong"})
    assert r.status_code == 400
    r = client.post("/api/v1/auth/2fa/disable", headers=auth(full),
                    json={"method": "sms", "password": "secret123"})
    assert r.status_code == 200
    fresh = db_session.query(User).filter(User.id == u.id).first()
    assert fresh.twofa_method is None
    # login normal sans 2FA desormais
    r = client.post("/api/v1/auth/login", params={"phone": "0600000010", "password": "secret123"})
    assert r.json()["requires_2fa"] is False


def test_sms_expired_code_rejected(db_session):
    u = mk_user(db_session, "0600000011")
    r = client.post("/api/v1/auth/2fa/sms/enroll", headers=auth(tok_for(u)))
    code = r.json()["dev_code"]
    from app.models import SmsVerificationCode
    db = TestingSessionLocal()
    rec = (db.query(SmsVerificationCode)
           .filter(SmsVerificationCode.user_id == u.id,
                   SmsVerificationCode.purpose == "2fa_phone_verify")
           .order_by(SmsVerificationCode.id.desc()).first())
    rec.expires_at = datetime.utcnow() - timedelta(minutes=1)
    db.commit(); db.close()
    r = client.post("/api/v1/auth/2fa/sms/verify", headers=auth(tok_for(u)), json={"code": code})
    assert r.status_code == 400
    assert "expir" in r.json()["detail"].lower()


def test_sms_attempt_limit_and_cooldown(db_session):
    u = mk_user(db_session, "0600000012")
    r = client.post("/api/v1/auth/2fa/sms/enroll", headers=auth(tok_for(u)))
    assert r.status_code == 200
    # cooldown de renvoi immediat -> 429
    r = client.post("/api/v1/auth/2fa/sms/resend", headers=auth(tok_for(u)))
    assert r.status_code == 429
    # tentatives repetees au-dela de max_attempts -> 429
    rr = None
    for _ in range(settings.SMS_MAX_ATTEMPTS + 1):
        rr = client.post("/api/v1/auth/2fa/sms/verify", headers=auth(tok_for(u)), json={"code": "123456"})
    assert rr is not None and rr.status_code == 429


def test_partial_token_cannot_enroll_totp(db_session):
    u = mk_user(db_session, "0600000013")
    partial = tok_for(u, stage="2fa")
    r = client.post("/api/v1/auth/2fa/totp/enroll", headers=auth(partial))
    assert r.status_code == 403


# =====================================================================
# C. 2FA — TOTP (compatible Google Authenticator)
# =====================================================================

def test_totp_full_lifecycle(db_session):
    u = mk_user(db_session, "0600000020")
    r = client.post("/api/v1/auth/2fa/totp/enroll", headers=auth(tok_for(u)))
    assert r.status_code == 200
    d = r.json()
    assert d["status"] == "pending" and d["provisioning_uri"].startswith("otpauth://totp/")
    secret = d["secret"]
    st = client.get("/api/v1/auth/2fa/status", headers=auth(tok_for(u))).json()
    assert st["totp"]["pending"] is True and st["totp"]["enrolled"] is False
    # le secret n'est JAMAIS expose par le profil
    prof = client.get("/api/v1/users/me", headers=auth(tok_for(u))).json()
    assert secret not in str(prof)

    # enrollment non confirme : le login ne doit PAS encore exiger le TOTP
    r = client.post("/api/v1/auth/login", params={"phone": "0600000020", "password": "secret123"})
    assert r.json()["requires_2fa"] is False

    # mauvais code -> refuse, reste pending
    r = client.post("/api/v1/auth/2fa/totp/verify", headers=auth(tok_for(u)), json={"code": "000000"})
    assert r.status_code == 400

    totp = pyotp.TOTP(secret)
    r = client.post("/api/v1/auth/2fa/totp/verify", headers=auth(tok_for(u)), json={"code": totp.now()})
    assert r.status_code == 200
    st = client.get("/api/v1/auth/2fa/status", headers=auth(tok_for(u))).json()
    assert st["totp"]["enrolled"] is True and st["enabled_method"] == "totp"

    # plus de pending -> verify refuse
    r = client.post("/api/v1/auth/2fa/totp/verify", headers=auth(tok_for(u)), json={"code": totp.now()})
    assert r.status_code == 400

    # login => second facteur TOTP exige
    r = client.post("/api/v1/auth/login", params={"phone": "0600000020", "password": "secret123"})
    d = r.json()
    assert d["requires_2fa"] is True and d["method"] == "totp"
    partial = d["access_token"]
    assert client.get("/api/v1/users/me", headers=auth(partial)).status_code == 403
    r = client.post("/api/v1/auth/2fa/challenge", headers=auth(partial), json={"code": totp.now()})
    assert r.status_code == 200, r.text
    full = r.json()["access_token"]
    assert client.get("/api/v1/users/me", headers=auth(full)).status_code == 200

    # desactivation exige un code TOTP valide (re-auth)
    r = client.post("/api/v1/auth/2fa/disable", headers=auth(full), json={"method": "totp", "code": "111111"})
    assert r.status_code == 400
    r = client.post("/api/v1/auth/2fa/disable", headers=auth(full), json={"method": "totp", "code": totp.now()})
    assert r.status_code == 200
    fresh = db_session.query(User).filter(User.id == u.id).first()
    assert fresh.twofa_method is None


def test_password_change_real(db_session):
    u = mk_user(db_session, "0600000030", pw="oldpass123")
    r = client.post("/api/v1/auth/2fa/password", headers=auth(tok_for(u)),
                    json={"current_password": "wrongone", "new_password": "newpass456"})
    assert r.status_code == 400
    r = client.post("/api/v1/auth/2fa/password", headers=auth(tok_for(u)),
                    json={"current_password": "oldpass123", "new_password": "newpass456"})
    assert r.status_code == 200
    ok = client.post("/api/v1/auth/login", params={"phone": "0600000030", "password": "newpass456"})
    assert ok.status_code == 200
    bad = client.post("/api/v1/auth/login", params={"phone": "0600000030", "password": "oldpass123"})
    assert bad.status_code == 401


# =====================================================================
# D. PARTENARIATS
# =====================================================================

def test_partnership_matrix_allowed_and_denied(db_session):
    seller_u = mk_user(db_session, "0610000001", role=UserRole.SELLER)
    mech_u = mk_user(db_session, "0610000002", role=UserRole.MECHANIC)
    tuner_u = mk_user(db_session, "0610000003", role=UserRole.TUNER)
    cust_u = mk_user(db_session, "0610000004", role=UserRole.CUSTOMER)
    sp = mk_provider(db_session, seller_u, ProviderType.SELLER, name="Pieces Pro")
    mp = mk_provider(db_session, mech_u, ProviderType.MECHANIC, name="Garage Mech")
    tp = mk_provider(db_session, tuner_u, ProviderType.TUNER, name="Tuning Lab")

    # seller -> mechanic : autorise
    r = client.post("/api/v1/partnerships/invite", headers=auth(tok_for(seller_u)),
                    json={"target_provider_id": mp.id, "message": "Travaillons ensemble"})
    assert r.status_code == 200, r.text
    inv_id = r.json()["invitation_id"]

    # notification recue par le destinataire (persistee en base)
    n = db_session.query(Notification).filter(Notification.user_id == mech_u.id,
                                              Notification.type == "partnership_invite").first()
    assert n is not None

    # doublon actif refuse
    r = client.post("/api/v1/partnerships/invite", headers=auth(tok_for(seller_u)),
                    json={"target_provider_id": mp.id})
    assert r.status_code == 409

    # auto-invitation refusee
    r = client.post("/api/v1/partnerships/invite", headers=auth(tok_for(seller_u)),
                    json={"target_provider_id": sp.id})
    assert r.status_code == 400

    # un tiers ne peut pas repondre a une invitation qui ne lui est pas adressee
    r = client.post(f"/api/v1/partnerships/invitations/{inv_id}/respond", headers=auth(tok_for(tuner_u)),
                    json={"action": "accept"})
    assert r.status_code == 403

    # acceptation par le vrai destinataire
    r = client.post(f"/api/v1/partnerships/invitations/{inv_id}/respond", headers=auth(tok_for(mech_u)),
                    json={"action": "accept"})
    assert r.status_code == 200 and r.json()["status"] == "accepted"
    # double traitement refuse
    r = client.post(f"/api/v1/partnerships/invitations/{inv_id}/respond", headers=auth(tok_for(mech_u)),
                    json={"action": "decline"})
    assert r.status_code == 409

    # les deux parties voient le partenariat
    ps = client.get("/api/v1/partnerships/partners", headers=auth(tok_for(seller_u))).json()["items"]
    pm = client.get("/api/v1/partnerships/partners", headers=auth(tok_for(mech_u))).json()["items"]
    assert len(ps) == 1 and len(pm) == 1

    # mechanic -> tuner autorise ; mechanic -> mechanic refuse ; customer refuse
    r = client.post("/api/v1/partnerships/invite", headers=auth(tok_for(mech_u)),
                    json={"target_provider_id": tp.id})
    assert r.status_code == 200
    mech2 = mk_user(db_session, "0610000005", role=UserRole.MECHANIC)
    m2p = mk_provider(db_session, mech2, ProviderType.MECHANIC, name="Autre Garage")
    r = client.post("/api/v1/partnerships/invite", headers=auth(tok_for(mech_u)),
                    json={"target_provider_id": m2p.id})
    assert r.status_code == 403
    r = client.post("/api/v1/partnerships/invite", headers=auth(tok_for(cust_u)),
                    json={"target_provider_id": mp.id})
    assert r.status_code == 403

    # retrait : seul l'emetteur, seulement si pending
    pend = [i for i in client.get("/api/v1/partnerships/invitations",
                                  headers=auth(tok_for(mech_u))).json()["outgoing"]
            if i["status"] == "pending"]
    inv2 = pend[0]["id"]
    r = client.post(f"/api/v1/partnerships/invitations/{inv2}/withdraw", headers=auth(tok_for(tuner_u)))
    assert r.status_code == 403
    r = client.post(f"/api/v1/partnerships/invitations/{inv2}/withdraw", headers=auth(tok_for(mech_u)))
    assert r.status_code == 200 and r.json()["status"] == "withdrawn"


def test_discover_nearby_privacy_and_city_fallback(db_session):
    seller_u = mk_user(db_session, "0610000101", role=UserRole.SELLER)
    mk_provider(db_session, seller_u, ProviderType.SELLER, city="Casablanca", name="Vendeur Casa")
    near_mech = mk_user(db_session, "0610000102", role=UserRole.MECHANIC)
    mk_provider(db_session, near_mech, ProviderType.MECHANIC, city="Casablanca", name="Garage Casa")
    far_mech = mk_user(db_session, "0610000103", role=UserRole.MECHANIC)
    mk_provider(db_session, far_mech, ProviderType.MECHANIC, city="Marrakech", name="Garage Marrakech")
    other_seller = mk_user(db_session, "0610000104", role=UserRole.SELLER)
    mk_provider(db_session, other_seller, ProviderType.SELLER, city="Casablanca", name="Concurrence Vendeur")

    r = client.get("/api/v1/partnerships/discover", headers=auth(tok_for(seller_u)))
    assert r.status_code == 200
    d = r.json()
    names = [i["business_name"] for i in d["items"]]
    assert "Garage Casa" in names              # ville commune -> fallback ville
    assert "Garage Marrakech" not in names     # hors zone sans coordonnees -> exclu
    assert "Concurrence Vendeur" not in names  # role cible non autorise pour un seller
    assert d["entitlement_source"] == "demo_premium"  # override serveur etiquete
    # confidentialite : aucun champ prive dans le payload public
    blob = str(d).lower()
    for forbidden in ["0610000102", "@test.local", "password", "secret", "wallet"]:
        assert forbidden not in blob
    item = d["items"][0]
    assert set(item.keys()) <= {"provider_id", "business_name", "category", "bio", "specializations",
                                "services", "public_service_area", "verified", "rating",
                                "review_count", "_distance_km", "_proximity_basis"}
    assert item["_proximity_basis"] == "city_fallback"

    # resume public via GET providers/{id} — pas d'acces au compte prive
    pid = next(i["provider_id"] for i in d["items"] if i["business_name"] == "Garage Casa")
    s = client.get(f"/api/v1/partnerships/providers/{pid}", headers=auth(tok_for(seller_u)))
    assert s.status_code == 200 and "email" not in s.json()


def test_partnership_production_entitlement_requires_subscription(monkeypatch):
    monkeypatch.setattr(settings, "DEMO_MODE", False)
    from app.api.partnerships import partnership_entitlement
    db = TestingSessionLocal()
    u = mk_user(db, "0610000200", role=UserRole.SELLER)
    ent = partnership_entitlement(u, db)
    assert ent["allowed"] is False and ent["source"] == "subscription_required"
    db.close()


# =====================================================================
# E. BOUTIQUE MECANICIEN (catalogue, stock, prix serveur, commission)
# =====================================================================

def _seed_catalog(db):
    cat = ProductCategory(name="Freinage", slug="freinage")
    db.add(cat); db.commit(); db.refresh(cat)
    seller_u = mk_user(db, "0620000001", role=UserRole.SELLER)
    sp = mk_provider(db, seller_u, ProviderType.SELLER, name="Pieces Express")
    p = Product(seller_id=sp.id, category_id=cat.id, name="Plaquettes avant", slug="plaq-1",
                sku="PLQ-1", price=25000, discount_percent=0, stock_quantity=5,
                status=ProductStatus.ACTIVE, currency="MAD")
    db.add(p); db.commit(); db.refresh(p)
    mech_u = mk_user(db, "0620000002", role=UserRole.MECHANIC)
    mk_provider(db, mech_u, ProviderType.MECHANIC, name="Mon Atelier",
                address="1 rue Test", city="Casa")
    return seller_u, sp, p, mech_u


def test_store_catalog_detail_and_stock_validation(db_session):
    _, _, p, mech = _seed_catalog(db_session)
    h = auth(tok_for(mech))
    r = client.get("/api/v1/store/products", headers=h)
    assert r.status_code == 200 and r.json()["total"] == 1
    item = r.json()["items"][0]
    assert item["price"] == 25000 and item["in_stock"] is True
    r = client.get(f"/api/v1/store/products/{p.id}", headers=h)
    assert r.status_code == 200 and r.json()["seller"]["business_name"] == "Pieces Express"

    # quantite > stock refusee (quote ET order)
    bad = {"items": [{"product_id": p.id, "quantity": 99}], "delivery_mode": "business_address"}
    assert client.post("/api/v1/store/orders/quote", headers=h, json=bad).status_code == 409
    assert client.post("/api/v1/store/orders", headers=h, json={**bad, "confirm": True}).status_code == 409

    # commande sans confirmation explicite refusee
    good = {"items": [{"product_id": p.id, "quantity": 2}], "delivery_mode": "business_address"}
    assert client.post("/api/v1/store/orders", headers=h, json=good).status_code == 400

    q = client.post("/api/v1/store/orders/quote", headers=h, json=good)
    assert q.status_code == 200
    qt = q.json()
    assert qt["subtotal"] == 50000 and qt["total"] == 50000
    assert "vendeur" in qt["note_commission"]  # transparence : commission pas ajoutee

    o = client.post("/api/v1/store/orders", headers=h, json={**good, "confirm": True,
                                                             "idempotency_key": "K1"})
    assert o.status_code == 201, o.text
    oid = o.json()["order_id"]
    assert o.json()["payment_status"] == "pending"  # pas payee tant que non finalisee

    # retry sur la meme cle d'idempotence -> meme commande, pas de doublon
    o2 = client.post("/api/v1/store/orders", headers=h, json={**good, "confirm": True,
                                                              "idempotency_key": "K1"})
    assert o2.status_code == 201 and o2.json().get("replayed") is True
    assert o2.json()["order_id"] == oid

    # stock decremente (5 -> 3)
    db_session.refresh(p)
    assert p.stock_quantity == 3

    # snapshot de prix sur OrderItem
    from app.models import OrderItem
    oi = db_session.query(OrderItem).filter(OrderItem.order_id == oid).first()
    assert oi.unit_price == 25000 and oi.product_name == "Plaquettes avant"

    # la commande apparait cote vendeur (api/seller.py)
    seller_u = db_session.query(User).filter(User.phone == "0620000001").first()
    so = client.get("/api/v1/seller/orders", headers=auth(tok_for(seller_u)))
    assert so.status_code == 200, so.text
    payload = so.json()
    rows = payload.get("items") if isinstance(payload, dict) else payload
    nums = [x.get("order_number") for x in (rows or [])]
    assert o.json()["order_number"] in nums


def test_store_simulated_payment_commission_and_cancel(db_session, monkeypatch):
    seller_u, sp, p, mech = _seed_catalog(db_session)
    h = auth(tok_for(mech))
    good = {"items": [{"product_id": p.id, "quantity": 1}], "delivery_mode": "pickup", "confirm": True}
    o = client.post("/api/v1/store/orders", headers=h, json=good)
    assert o.status_code == 201, o.text
    oid = o.json()["order_id"]

    # paiement simule refuse hors demo
    monkeypatch.setattr(settings, "DEMO_MODE", False)
    assert client.post(f"/api/v1/store/orders/{oid}/pay", headers=h,
                       json={"method": "simulated"}).status_code == 403
    monkeypatch.setattr(settings, "DEMO_MODE", True)

    # commission NON configuree -> aucune ecriture
    monkeypatch.setattr(settings, "COMMISSION_RATE_PERCENT", None)
    r = client.post(f"/api/v1/store/orders/{oid}/pay", headers=h, json={"method": "simulated"})
    assert r.status_code == 200, r.text
    assert r.json()["simulated"] is True and r.json()["commission"] is None
    assert r.json()["buyer_total"] == 25000  # total acheteur inchange par la commission

    # payer deux fois -> idempotent
    r2 = client.post(f"/api/v1/store/orders/{oid}/pay", headers=h, json={"method": "simulated"})
    assert r2.status_code == 200 and r2.json().get("already_paid") is True

    # nouvelle commande avec commission configuree -> ecriture exacte (centimes)
    monkeypatch.setattr(settings, "COMMISSION_RATE_PERCENT", 5.0)
    o3 = client.post("/api/v1/store/orders", headers=h,
                     json={"items": [{"product_id": p.id, "quantity": 2}], "delivery_mode": "pickup",
                           "confirm": True})
    oid3 = o3.json()["order_id"]
    r3 = client.post(f"/api/v1/store/orders/{oid3}/pay", headers=h, json={"method": "simulated"})
    c = r3.json()["commission"]
    assert c["gross_amount"] == 50000 and c["commission_amount"] == 2500 and c["seller_net"] == 47500
    assert r3.json()["buyer_total"] == 50000
    # retry de paiement ne duplique pas la commission
    client.post(f"/api/v1/store/orders/{oid3}/pay", headers=h, json={"method": "simulated"})
    from app.models import Commission
    assert db_session.query(Commission).filter(Commission.order_id == oid3).count() == 1

    # annulation restitue le stock (etat initial seulement)
    db_session.refresh(p)
    before = p.stock_quantity
    o4 = client.post("/api/v1/store/orders", headers=h,
                     json={"items": [{"product_id": p.id, "quantity": 1}], "delivery_mode": "pickup",
                           "confirm": True})
    oid4 = o4.json()["order_id"]
    db_session.refresh(p)
    assert p.stock_quantity == before - 1
    cr = client.post(f"/api/v1/store/orders/{oid4}/cancel", headers=h)
    assert cr.status_code == 200
    db_session.refresh(p)
    assert p.stock_quantity == before
    # annuler une commande payee -> 409
    assert client.post(f"/api/v1/store/orders/{oid3}/cancel", headers=h).status_code == 409


def test_store_auth_and_object_access(db_session):
    _, _, p, mech = _seed_catalog(db_session)
    h = auth(tok_for(mech))
    # pas d'auth -> 401
    assert client.get("/api/v1/store/products").status_code == 401
    # produits dupliqués dans une commande -> 400
    r = client.post("/api/v1/store/orders", headers=h,
                    json={"items": [{"product_id": p.id, "quantity": 1},
                                    {"product_id": p.id, "quantity": 1}],
                          "delivery_mode": "pickup", "confirm": True})
    assert r.status_code == 400
    # la commande d'un autre compte n'est pas accessible (anti-acces objet)
    other = mk_user(db_session, "0620000099", role=UserRole.MECHANIC)
    o = client.post("/api/v1/store/orders", headers=h,
                    json={"items": [{"product_id": p.id, "quantity": 1}],
                          "delivery_mode": "pickup", "confirm": True})
    oid = o.json()["order_id"]
    assert client.post(f"/api/v1/store/orders/{oid}/cancel",
                       headers=auth(tok_for(other))).status_code == 404
