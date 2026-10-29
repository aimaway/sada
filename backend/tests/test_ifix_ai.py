"""Tests IFIX AI : droit d'usage (3 sessions gratuites), messages, consentement, sécurité."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models import User, UserRole, ProviderType, ProviderProfile
from app.api.ifix_ai import (AiSession, AiMessage, ConsentAudit,
                             ensure_ifix_tables, FREE_SESSION_ALLOWANCE)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_ifix.db"
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
    ensure_ifix_tables(db)
    db.close()
    yield
    from sqlalchemy import inspect as sa_inspect, text
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


def mk_user(db, phone, role=UserRole.CUSTOMER):
    u = User(phone=phone, password_hash="x", full_name="T", role=role, status="active")
    db.add(u); db.commit(); db.refresh(u)
    return u


def auth(tok):
    return {"Authorization": f"Bearer {tok}"}


# ---------- Sessions 1-3 autorisées, 4e bloquée ----------

def test_three_free_sessions_then_gated(db_session, token_for):
    cust = mk_user(db_session, "+212620000001")
    tok = auth(token_for(cust))
    for i in range(FREE_SESSION_ALLOWANCE):
        r = client.post("/api/v1/ifix/sessions", headers=tok,
                        json={"first_message": "La voiture ne demarre pas, un clic sec",
                              "vehicle_summary": "Renault Clio 2015"})
        assert r.status_code == 201, r.text
        assert r.json()["remaining_free"] == FREE_SESSION_ALLOWANCE - i - 1
    fourth = client.post("/api/v1/ifix/sessions", headers=tok,
                         json={"first_message": "Toujours des difficultes de demarrage"})
    assert fourth.status_code == 402
    err = fourth.json()["detail"]
    assert err["error"] == "allowance_exhausted"
    # historique preserve apres epuisement
    hist = client.get("/api/v1/ifix/sessions", headers=tok)
    assert hist.status_code == 200 and len(hist.json()["sessions"]) == FREE_SESSION_ALLOWANCE


def test_messages_do_not_consume_allowance(db_session, token_for):
    cust = mk_user(db_session, "+212620000010")
    tok = auth(token_for(cust))
    s = client.post("/api/v1/ifix/sessions", headers=tok,
                    json={"first_message": "Ca klaxonne quand je freine"}).json()
    before = client.get("/api/v1/ifix/entitlement", headers=tok).json()["used"]
    for _ in range(5):
        m = client.post(f"/api/v1/ifix/sessions/{s['session_id']}/messages", headers=tok,
                        json={"content": "Plutot le matin a froid"})
        assert m.status_code == 200
    after = client.get("/api/v1/ifix/entitlement", headers=tok).json()["used"]
    assert before == after == 1


def test_failed_creation_does_not_consume_allowance(db_session, token_for):
    cust = mk_user(db_session, "+212620000011")
    tok = auth(token_for(cust))
    bad = client.post("/api/v1/ifix/sessions", headers=tok, json={"first_message": "ab"})  # <3 chars -> 422
    assert bad.status_code == 422
    ent = client.get("/api/v1/ifix/entitlement", headers=tok).json()
    assert ent["used"] == 0 and ent["remaining"] == FREE_SESSION_ALLOWANCE
    ok = client.post("/api/v1/ifix/sessions", headers=tok,
                     json={"first_message": "Le moteur surchauffe en ville"})
    assert ok.status_code == 201


def test_concurrent_new_sessions_cannot_exceed_allowance(db_session, token_for):
    """5 tentatives sequentielles simulant la concurrence : exactement 3 creees."""
    cust = mk_user(db_session, "+212620000012")
    tok = auth(token_for(cust))
    results = [client.post("/api/v1/ifix/sessions", headers=tok,
                           json={"first_message": "Demarrage impossible ce matin"})
               for _ in range(FREE_SESSION_ALLOWANCE + 2)]
    created = sum(1 for r in results if r.status_code == 201)
    gated = sum(1 for r in results if r.status_code == 402)
    assert created == FREE_SESSION_ALLOWANCE and gated == 2
    db = TestingSessionLocal()
    assert db.query(AiSession).filter(AiSession.customer_id == cust.id).count() == 3
    db.close()


# ---------- Sécurité non bloquee par le quota ----------

def test_safety_advice_available_when_exhausted(db_session, token_for):
    cust = mk_user(db_session, "+212620000020")
    tok = auth(token_for(cust))
    for i in range(FREE_SESSION_ALLOWANCE):
        client.post("/api/v1/ifix/sessions", headers=tok,
                    json={"first_message": f"Question generale {i+1} sur ma voiture"})
    # session epuisee...
    blocked = client.post("/api/v1/ifix/sessions", headers=tok,
                          json={"first_message": "Panne quelconque supplementaire"})
    assert blocked.status_code == 402
    # ... mais les conseils de securite restent accessibles via un endpoint
    # de guidance publique (sans consommation de session)
    safe = client.get("/api/v1/ifix/safety-guidance?q=fumee sous le capot", headers=tok)
    assert safe.status_code == 200
    assert "arretez" in safe.json()["advice"].lower() or "stop" in safe.json()["advice"].lower()
    ent = client.get("/api/v1/ifix/entitlement", headers=tok).json()
    assert ent["used"] == FREE_SESSION_ALLOWANCE  # appel securite ne consomme rien


# ---------- Consentement ----------

def test_consent_grant_records_audit(db_session, token_for):
    prov_u = mk_user(db_session, "+212620000030", UserRole.MECHANIC)
    p = ProviderProfile(user_id=prov_u.id, type=ProviderType.MECHANIC, slug="g-ifix",
                        name="Garage IFIX", city="Casablanca",
                        verification_status="approved", specialties=["1"], services=["1"])
    db_session.add(p); db_session.commit(); db_session.refresh(p)
    cust = mk_user(db_session, "+212620000031")
    tok = auth(token_for(cust))
    s = client.post("/api/v1/ifix/sessions", headers=tok,
                    json={"first_message": "Voiture ne demarre pas, clic",
                          "vehicle_summary": "Dacia Logan 2018"}).json()
    # avant consentement : statut pending
    sess = db_session.get(AiSession, s["session_id"])
    assert sess.consent_status == "pending"
    share = client.post(f"/api/v1/ifix/sessions/{s['session_id']}/share", headers=tok,
                        json={"provider_id": p.id, "include_photos": False})
    assert share.status_code == 200
    summary = share.json()["shared_summary"]
    assert "NON CONFIRME" in summary["disclaimer"]
    assert summary["photos_included"] is False
    db_session.expire_all()
    sess = db_session.get(AiSession, s["session_id"])
    assert sess.consent_status == "granted"
    audit = db_session.query(ConsentAudit).filter_by(session_id=s["session_id"]).all()
    assert any(a.decision == "granted" for a in audit)


def test_consent_decline_keeps_private(db_session, token_for):
    cust = mk_user(db_session, "+212620000040")
    tok = auth(token_for(cust))
    s = client.post("/api/v1/ifix/sessions", headers=tok,
                    json={"first_message": "Vibration dans les freins"}).json()
    d = client.post(f"/api/v1/ifix/sessions/{s['session_id']}/decline-share", headers=tok)
    assert d.status_code == 200
    db_session.expire_all()
    sess = db_session.get(AiSession, s["session_id"])
    assert sess.consent_status == "declined"
    assert sess.shared_summary_json is None
    audit = db_session.query(ConsentAudit).filter_by(session_id=s["session_id"]).all()
    assert audit and audit[0].decision == "declined"


# ---------- Isolation des donnees ----------

def test_sessions_isolated_between_customers(db_session, token_for):
    c1 = mk_user(db_session, "+212620000050")
    c2 = mk_user(db_session, "+212620000051")
    s1 = client.post("/api/v1/ifix/sessions", headers=auth(token_for(c1)),
                     json={"first_message": "Probleme de batterie chez Alice"}).json()
    h2 = client.get("/api/v1/ifix/sessions", headers=auth(token_for(c2)))
    assert all(x["id"] != s1["session_id"] for x in h2.json()["sessions"])
    msg = client.post(f"/api/v1/ifix/sessions/{s1['session_id']}/messages",
                      headers=auth(token_for(c2)), json={"content": "intrus"})
    assert msg.status_code == 404  # pas de fuite / pas d'ecriture cross-client


def test_recommendations_only_real_approved_providers(db_session, token_for):
    cust = mk_user(db_session, "+212620000060")
    tok = auth(token_for(cust))
    empty = client.get("/api/v1/ifix/recommend-providers?category_id=1", headers=tok).json()
    assert empty["providers"] == []  # rien d'invente
    pu = mk_user(db_session, "+212620000061", UserRole.MECHANIC)
    good = ProviderProfile(user_id=pu.id, type=ProviderType.MECHANIC, slug="rec-1",
                           name="Bon Garage", city="Casa", verification_status="approved",
                           rating=4.8, review_count=200, jobs_completed=90,
                           specialties=["1"], services=["1"])
    bad = ProviderProfile(user_id=mk_user(db_session, "+212620000062", UserRole.MECHANIC).id,
                          type=ProviderType.MECHANIC, slug="rec-2", name="En attente",
                          city="Casa", verification_status="pending",
                          specialties=["1"], services=["1"])
    db_session.add_all([good, bad]); db_session.commit()
    rec = client.get("/api/v1/ifix/recommend-providers?category_id=1", headers=tok).json()
    ids = [x["id"] for x in rec["providers"]]
    assert good.id in ids and bad.id not in ids
    assert rec["providers"][0]["reason"]  # motif ancre dans les donnees reels
