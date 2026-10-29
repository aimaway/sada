"""Tests de l'API Admin — contrôle des comptes, vérifications, litiges, RBAC."""
import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app, create_access_token, get_password_hash
from app.models import User, UserRole, ProviderProfile, ServiceRequest, Job, JobStatus

TEST_DB = "sqlite:///test_admin.db"
engine = create_engine(TEST_DB, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def _setup(request):
    request.node.module.override_get_db = override_get_db
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    return TestClient(app)


@pytest.fixture
def db():
    d = TestingSession()
    try:
        yield d
    finally:
        d.close()


def _fresh(d, model, pk):
    """Relire une ligne depuis SQLite après un commit applicatif."""
    d.rollback()  # abandonne l'objet potentiellement périmé en cache d'identité
    return d.query(model).filter(model.id == pk).first()


@pytest.fixture
def seeded(db):
    admin = User(phone="+212600000001", full_name="Super Admin", role=UserRole.ADMIN,
                 status="active", password_hash=get_password_hash("admin123"))
    customer = User(phone="+212600000002", full_name="Client Un", role=UserRole.CUSTOMER,
                    status="active", password_hash=get_password_hash("pass1234"))
    mech_user = User(phone="+212600000003", full_name="Méca Deux", role=UserRole.MECHANIC,
                     status="active", password_hash=get_password_hash("pass1234"))
    tuner_user = User(phone="+212600000004", full_name="Tuner Trois", role=UserRole.TUNER,
                      status="active", password_hash=get_password_hash("pass1234"))
    db.add_all([admin, customer, mech_user, tuner_user])
    db.commit()

    mech = ProviderProfile(user_id=mech_user.id, type="mechanic", slug="meca-deux",
                           name="Meca Deux", city="Casablanca", verification_status="pending")
    tuner = ProviderProfile(user_id=tuner_user.id, type="tuner", slug="tuner-trois",
                            name="Tuner Trois", city="Rabat", verification_status="verified", verified=True)
    db.add_all([mech, tuner])
    db.commit()

    req = ServiceRequest(customer_id=customer.id, scenario="panne", vehicle_type="car",
                         description="Voiture ne démarre pas", lat=33.5, lng=-7.6,
                         proposed_price=50000, status="open")
    db.add(req)
    db.commit()

    job = Job(request_id=req.id, customer_id=customer.id, provider_id=mech.id,
              status=JobStatus.DISPUTED, agreed_price=45000, dispute_open=True,
              dispute_reason="Travail incomplet")
    db.add(job)
    db.commit()
    return {"admin": admin, "customer": customer, "mech_user": mech_user,
            "mech": mech, "tuner": tuner, "request": req, "job": job}


def _tok(u):
    return {"Authorization": f"Bearer {create_access_token(data={'sub': str(u.id)})}"}


class TestAdminRBAC:
    def test_endpoints_require_auth(self, client):
        assert client.get("/api/v1/admin/stats").status_code in (401, 403)
        assert client.get("/api/v1/admin/users").status_code in (401, 403)

    def test_customer_blocked(self, client, seeded):
        h = _tok(seeded["customer"])
        assert client.get("/api/v1/admin/stats", headers=h).status_code == 403
        assert client.get("/api/v1/admin/users", headers=h).status_code == 403

    def test_mechanic_blocked(self, client, seeded):
        h = _tok(seeded["mech_user"])
        assert client.get("/api/v1/admin/users", headers=h).status_code == 403

    def test_admin_allowed(self, client, seeded):
        r = client.get("/api/v1/admin/stats", headers=_tok(seeded["admin"]))
        assert r.status_code == 200


class TestAdminStats:
    def test_stats_shape(self, client, seeded):
        s = client.get("/api/v1/admin/stats", headers=_tok(seeded["admin"])).json()
        assert s["users"]["total"] == 4
        assert s["users"]["customers"] == 1
        assert s["users"]["mechanics"] == 1
        assert s["users"]["tuners"] == 1
        assert s["providers"]["pending_verifications"] == 1
        assert s["marketplace"]["open_requests"] == 1
        assert s["quality"]["open_disputes"] == 1


class TestAdminUsersCRUD:
    def test_list_and_filter(self, client, seeded):
        h = _tok(seeded["admin"])
        r = client.get("/api/v1/admin/users", headers=h).json()
        assert r["total"] == 4
        r2 = client.get("/api/v1/admin/users?role=mechanic", headers=h).json()
        assert r2["total"] == 1
        assert r2["items"][0]["provider"]["verification_status"] == "pending"
        rq = client.get("/api/v1/admin/users?q=Client", headers=h).json()
        assert rq["total"] == 1

    def test_create_user(self, client, seeded, db):
        h = _tok(seeded["admin"])
        r = client.post("/api/v1/admin/users", headers=h, json={
            "phone": "+212699999999", "full_name": "Nouveau Client", "role": "customer",
            "password": "secret123"})
        assert r.status_code == 200, r.text
        uid = r.json()["id"]
        # Persisté en base avec hash bcrypt
        u = db.query(User).filter(User.id == uid).first()
        assert u is not None and u.password_hash.startswith("$2")
        # Doublon refusé
        r2 = client.post("/api/v1/admin/users", headers=h, json={
            "phone": "+212699999999", "full_name": "X", "role": "customer"})
        assert r2.status_code == 409

    def test_update_user_fields_and_role(self, client, seeded, db):
        h = _tok(seeded["admin"])
        cid = seeded["customer"].id
        r = client.put(f"/api/v1/admin/users/{cid}", headers=h,
                       json={"full_name": "Client Renommé", "role": "mechanic"})
        assert r.status_code == 200 and r.json()["role"] == "mechanic"
        assert _fresh(db, User, cid).full_name == "Client Renommé"

    def test_suspend_reactivates_login(self, client, seeded):
        h = _tok(seeded["admin"])
        cid = seeded["customer"].id
        r = client.put(f"/api/v1/admin/users/{cid}/status", headers=h, json={"status": "suspended"})
        assert r.json()["status"] == "suspended"
        # Le compte suspendu ne peut plus appeler /users/me
        token = create_access_token(data={"sub": str(cid)})
        assert client.get("/api/v1/users/me",
                          headers={"Authorization": f"Bearer {token}"}).status_code == 403
        client.put(f"/api/v1/admin/users/{cid}/status", headers=h, json={"status": "active"})
        assert client.get("/api/v1/users/me",
                          headers={"Authorization": f"Bearer {token}"}).status_code == 200

    def test_cannot_lock_out_last_admin(self, client, seeded, db):
        h = _tok(seeded["admin"])
        aid = seeded["admin"].id
        # Se désactiver soi-même -> refusé
        assert client.put(f"/api/v1/admin/users/{aid}/status", headers=h,
                          json={"status": "suspended"}).status_code == 400
        # Créer un 2e admin, le suspendre OK ; ensuite tenter de suspendre le seul restant
        r = client.post("/api/v1/admin/users", headers=h, json={
            "phone": "+212600000010", "full_name": "Admin Deux", "role": "admin",
            "password": "admin123"})
        a2 = r.json()["id"]
        assert client.put(f"/api/v1/admin/users/{a2}/status", headers=h,
                          json={"status": "banned"}).status_code == 200
        assert client.delete(f"/api/v1/admin/users/{aid}", headers=_tok(
            User.__new__(User) if False else seeded["admin"])).status_code == 400  # self-delete refusé

    def test_reset_password(self, client, seeded, db):
        h = _tok(seeded["admin"])
        cid = seeded["customer"].id
        r = client.put(f"/api/v1/admin/users/{cid}/reset-password", headers=h,
                       json={"password": "nouveauPass1"})
        assert r.status_code == 200
        login = client.post("/api/v1/auth/login", params={"phone": "+212600000002", "password": "nouveauPass1"})
        assert login.status_code == 200

    def test_delete_removes_provider_profile(self, client, seeded, db):
        h = _tok(seeded["admin"])
        tid = seeded["tuner"].user_id
        r = client.delete(f"/api/v1/admin/users/{tid}", headers=h)
        assert r.status_code == 200
        assert db.query(User).filter(User.id == tid).first() is None
        assert db.query(ProviderProfile).filter(ProviderProfile.user_id == tid).first() is None


class TestAdminVerification:
    def test_queue_lists_pending(self, client, seeded):
        items = client.get("/api/v1/admin/verifications", headers=_tok(seeded["admin"])).json()["items"]
        assert len(items) == 1 and items[0]["type"] == "mechanic"

    def test_approve_sets_verified_and_badge(self, client, seeded, db):
        pid = seeded["mech"].id
        r = client.put(f"/api/v1/admin/providers/{pid}/verify", headers=_tok(seeded["admin"]),
                       json={"action": "approve", "reason": "RC vérifié"})
        assert r.json()["verified"] is True and "verified" in r.json()["badges"]
        p = _fresh(db, ProviderProfile, pid)
        assert p.verification_status == "verified"
        assert p.verification_data["last_admin_note"] == "RC vérifié"

    def test_reject_and_flag_and_unset(self, client, seeded, db):
        pid = seeded["mech"].id
        h = _tok(seeded["admin"])
        client.put(f"/api/v1/admin/providers/{pid}/verify", headers=h, json={"action": "reject"})
        assert _fresh(db, ProviderProfile, pid).verification_status == "rejected"
        client.put(f"/api/v1/admin/providers/{pid}/verify", headers=h, json={"action": "flag"})
        assert _fresh(db, ProviderProfile, pid).verification_status == "flagged"
        client.put(f"/api/v1/admin/providers/{pid}/verify", headers=h, json={"action": "unset"})
        assert _fresh(db, ProviderProfile, pid).verification_status == "pending"

    def test_invalid_action_400(self, client, seeded):
        r = client.put(f"/api/v1/admin/providers/{seeded['mech'].id}/verify",
                       headers=_tok(seeded["admin"]), json={"action": "nope"})
        assert r.status_code == 400

    def test_edit_provider_profile(self, client, seeded, db):
        r = client.put(f"/api/v1/admin/providers/{seeded['mech'].id}", headers=_tok(seeded["admin"]),
                       json={"name": "Garage Central", "city": "Marrakech"})
        assert r.status_code == 200
        p = _fresh(db, ProviderProfile, seeded["mech"].id)
        assert p.name == "Garage Central" and p.city == "Marrakech"


class TestAdminMarketplaceAndDisputes:
    def test_list_requests_jobs(self, client, seeded):
        h = _tok(seeded["admin"])
        reqs = client.get("/api/v1/admin/requests", headers=h).json()
        assert reqs["total"] == 1 and reqs["items"][0]["customer_name"] == "Client Un"
        jobs = client.get("/api/v1/admin/jobs", headers=h).json()
        assert jobs["total"] == 1 and jobs["items"][0]["dispute_open"] is True

    def test_disputes_list_and_resolve(self, client, seeded, db):
        h = _tok(seeded["admin"])
        d = client.get("/api/v1/admin/disputes", headers=h).json()
        assert d["total"] == 1 and d["items"][0]["reason"] == "Travail incomplet"
        jid = seeded["job"].id
        r = client.post(f"/api/v1/admin/jobs/{jid}/resolve-dispute", headers=h,
                        json={"outcome": "cancelled", "note": "remboursement"})
        assert r.status_code == 200
        j = _fresh(db, Job, jid)
        assert j.dispute_open is False and j.status == JobStatus.CANCELLED
        # Double résolution -> 409
        assert client.post(f"/api/v1/admin/jobs/{jid}/resolve-dispute", headers=h,
                           json={"outcome": "resolved"}).status_code == 409

    def test_force_close_request_transitions(self, client, seeded, db):
        h = _tok(seeded["admin"])
        rid = seeded["request"].id
        assert client.post(f"/api/v1/admin/requests/{rid}/close", headers=h).status_code == 200
        assert _fresh(db, ServiceRequest, rid).status == "cancelled"
        # Transition invalide depuis cancelled -> 409
        assert client.post(f"/api/v1/admin/requests/{rid}/close", headers=h).status_code == 409

    def test_audit_trail(self, client, seeded):
        a = client.get("/api/v1/admin/audit", headers=_tok(seeded["admin"])).json()
        types = {e["type"] for e in a["items"]}
        assert {"user_created", "request", "job"} <= types
