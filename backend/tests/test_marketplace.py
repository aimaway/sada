"""Tests du marketplace TomoBily (demandes, éligibilité, offres, acceptation atomique).

Pattern : dependency_overrides[get_db] + tokens mintés via create_access_token.
NB: rbac compare payload["sub"] à User.id — coercion str->int ajoutée dans
app/core/rbac.py et app/main.py ; les tests mintent sub=str(user.id).
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models import (User, UserRole, ProviderType, ProviderProfile,
                        ServiceRequest, Offer, Job)
from app.api.marketplace import ensure_marketplace_columns

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_marketplace.db"
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
def setup_db(token_for):
    Base.metadata.create_all(bind=engine)
    # Tables marketplace étendues (colonnes ajoutées idempotemment)
    db = TestingSessionLocal()
    ensure_marketplace_columns(db)
    db.close()
    yield
    from sqlalchemy import inspect as sa_inspect, text
    with engine.begin() as conn:
        conn.execute(text("PRAGMA foreign_keys=OFF"))
        insp = sa_inspect(engine)
        for t in reversed(insp.get_table_names()):
            conn.execute(text(f'DELETE FROM "{t}"'))
        conn.execute(text("PRAGMA foreign_keys=ON"))
    Base.metadata.drop_all(bind=engine)


# ---------- helpers de seed direct en base (rapide, sans endpoints auth) ----------

def mk_user(db, phone, role=UserRole.CUSTOMER, name="Test"):
    u = User(phone=phone, password_hash="x", full_name=name, role=role, status="active")
    db.add(u); db.commit(); db.refresh(u)
    return u


def mk_provider(db, user, slug, category_ids=("3",), rating=4.7, review_count=120,
                jobs_completed=80, is_online=True):
    p = ProviderProfile(user_id=user.id, type=ProviderType.MECHANIC, slug=slug,
                        name=f"Garage {slug}", city="Casablanca",
                        verification_status="approved", rating=rating,
                        review_count=review_count, jobs_completed=jobs_completed,
                        is_online=is_online, specialties=list(category_ids),
                        services=list(category_ids))
    db.add(p); db.commit(); db.refresh(p)
    return p


def auth(tok):
    return {"Authorization": f"Bearer {tok}"}


def ptok(db, token_for, pp):
    """Headers auth pour l'utilisateur proprietaire d'un profil provider."""
    u = db.query(User).filter(User.id == pp.user_id).first()
    return auth(token_for(u))


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    yield db
    db.close()


CAT = "freins"  # catégorie testée (tag des providers seeds)


# ---------- A. Éligibilité / distribution ----------

def test_only_eligible_providers_receive_request(db_session, token_for):
    cust = mk_user(db_session, "+212610000001")
    prov_yes = mk_provider(db_session, mk_user(db_session, "+212610000002", UserRole.MECHANIC),
                           "garage-a", category_ids=(CAT,))
    prov_no = mk_provider(db_session, mk_user(db_session, "+212610000003", UserRole.MECHANIC),
                          "garage-b", category_ids=("pneus",))
    tok_c = auth(token_for(cust))
    r = client.post("/api/v1/marketplace/requests", headers=tok_c, json={
        "category_id": CAT, "description": "Ma voiture vibre quand je freine fortement",
        "vehicle_type": "car"})
    assert r.status_code == 201
    body = r.json()
    assert prov_yes.id in body["eligible_provider_ids"]
    assert prov_no.id not in body["eligible_provider_ids"]
    req_id = body["request"]["id"]

    # provider éligible voit la demande ; non éligible : liste vide
    inbox_yes = client.get("/api/v1/marketplace/providers/inbox",
                           headers=ptok(db_session, token_for, prov_yes)).json()
    assert any(x["id"] == req_id for x in inbox_yes["requests"])
    inbox_no = client.get("/api/v1/marketplace/providers/inbox",
                          headers=ptok(db_session, token_for, prov_no)).json()
    assert all(x["id"] != req_id for x in inbox_no["requests"])


def test_inbox_masks_customer_identity(db_session, token_for):
    cust = mk_user(db_session, "+212610000010")
    prov = mk_provider(db_session, mk_user(db_session, "+212610000011", UserRole.MECHANIC),
                       "garage-mask", category_ids=(CAT,))
    client.post("/api/v1/marketplace/requests", headers=auth(token_for(cust)), json={
        "category_id": CAT, "description": "Vibration dans les freins avant gauche",
        "vehicle_type": "car", "location": "12 Rue Très Privée, Casa-PORT"})
    inbox = client.get("/api/v1/marketplace/providers/inbox",
                       headers=ptok(db_session, token_for, prov)).json()
    item = inbox["requests"][0]
    assert "customer_id" not in item
    assert "Très Privée" not in str(item)  # adresse exacte masquée


# ---------- B. Validation des offres ----------

def _open_request(db_session, token_for):
    cust = mk_user(db_session, "+212610000020")
    prov = mk_provider(db_session, mk_user(db_session, "+212610000021", UserRole.MECHANIC),
                       "garage-c", category_ids=(CAT,))
    outsider = mk_provider(db_session, mk_user(db_session, "+212610000022", UserRole.MECHANIC),
                           "garage-d", category_ids=("pneus",))
    r = client.post("/api/v1/marketplace/requests", headers=auth(token_for(cust)), json={
        "category_id": CAT, "description": "Freins qui grincent au démarrage",
        "vehicle_type": "car"})
    return cust, prov, outsider, r.json()["request"]["id"]


def test_offer_price_bounds_rejected(db_session, token_for):
    _, prov, _, req_id = _open_request(db_session, token_for)
    tok = ptok(db_session, token_for, prov)
    low = client.post("/api/v1/marketplace/offers", headers=tok,
                      json={"request_id": req_id, "price": 1000})  # 10 MAD < 50 MAD
    high = client.post("/api/v1/marketplace/offers", headers=tok,
                       json={"request_id": req_id, "price": 5_000_000})
    assert low.status_code == 422 and high.status_code == 422


def test_duplicate_offer_rejected_then_withdraw_ok(db_session, token_for):
    _, prov, _, req_id = _open_request(db_session, token_for)
    tok = ptok(db_session, token_for, prov)
    o1 = client.post("/api/v1/marketplace/offers", headers=tok,
                     json={"request_id": req_id, "price": 80000})
    assert o1.status_code == 201
    o2 = client.post("/api/v1/marketplace/offers", headers=tok,
                     json={"request_id": req_id, "price": 90000})
    assert o2.status_code == 409  # offre active déjà existante
    w = client.post(f"/api/v1/marketplace/offers/{o1.json()['offer_id']}/withdraw", headers=tok)
    assert w.status_code == 200
    o3 = client.post("/api/v1/marketplace/offers", headers=tok,
                     json={"request_id": req_id, "price": 90000})
    assert o3.status_code == 201  # retrait autorisé -> nouvelle offre


def test_ineligible_provider_offer_forbidden(db_session, token_for):
    _, _, outsider, req_id = _open_request(db_session, token_for)
    r = client.post("/api/v1/marketplace/offers",
                    headers=ptok(db_session, token_for, outsider),
                    json={"request_id": req_id, "price": 80000})
    assert r.status_code == 403


def test_offer_on_closed_request_rejected(db_session, token_for):
    cust, prov, _, req_id = _open_request(db_session, token_for)
    client.post("/api/v1/marketplace/requests/cancel", headers=auth(token_for(cust)),
                json={"request_id": req_id})
    r = client.post("/api/v1/marketplace/offers",
                    headers=ptok(db_session, token_for, prov),
                    json={"request_id": req_id, "price": 80000})
    assert r.status_code == 409


def test_offer_idempotent_replay(db_session, token_for):
    _, prov, _, req_id = _open_request(db_session, token_for)
    tok = ptok(db_session, token_for, prov)
    body = {"request_id": req_id, "price": 80000, "client_request_id": "abc-123"}
    a = client.post("/api/v1/marketplace/offers", headers=tok, json=body)
    b = client.post("/api/v1/marketplace/offers", headers=tok, json=body)
    assert a.status_code == 201
    assert b.status_code == 200 and b.json().get("replayed") is True
    assert a.json()["offer_id"] == b.json()["offer_id"]


# ---------- C. Acceptation atomique ----------

def test_accept_creates_job_and_rejects_competing_offers(db_session, token_for):
    cust, prov, _, req_id = _open_request(db_session, token_for)
    tok_p = ptok(db_session, token_for, prov)
    offer = client.post("/api/v1/marketplace/offers", headers=tok_p,
                        json={"request_id": req_id, "price": 80000}).json()["offer_id"]
    acc = client.post("/api/v1/marketplace/offers/accept", headers=auth(token_for(cust)),
                      json={"offer_id": offer})
    assert acc.status_code == 200
    job_id = acc.json()["job_id"]
    db = TestingSessionLocal()
    job = db.get(Job, job_id)
    assert job.agreed_price == 80000 and job.request_id == req_id
    req = db.get(ServiceRequest, req_id)
    assert req.status == "accepted"
    # rejeu idempotent -> même job
    acc2 = client.post("/api/v1/marketplace/offers/accept", headers=auth(token_for(cust)),
                       json={"offer_id": offer})
    assert acc2.status_code == 200 and acc2.json()["job_id"] == job_id
    # une seule acceptation possible : un second fournisseur n'a pas accès
    other = mk_provider(db, mk_user(db, "+212610000030", UserRole.MECHANIC), "garage-e", (CAT,))
    o2 = client.post("/api/v1/marketplace/offers", headers=ptok(db, token_for, other),
                     json={"request_id": req_id, "price": 70000})
    assert o2.status_code == 409  # demande fermée aux offres


def test_concurrent_accepts_exactly_one_job(db_session, token_for):
    """Deux offres concurrentes, deux tentatives d'acceptation : 1 seul Job."""
    cust, prov, _, req_id = _open_request(db_session, token_for)
    tok_p = ptok(db_session, token_for, prov)
    off1 = client.post("/api/v1/marketplace/offers", headers=tok_p,
                       json={"request_id": req_id, "price": 80000}).json()["offer_id"]
    # deuxième provider éligible sur la même catégorie
    prov2 = mk_provider(db_session, mk_user(db_session, "+212610000040", UserRole.MECHANIC),
                        "garage-f", category_ids=(CAT,))
    tok_p2 = ptok(db_session, token_for, prov2)
    off2 = client.post("/api/v1/marketplace/offers", headers=tok_p2,
                       json={"request_id": req_id, "price": 75000}).json()["offer_id"]
    tok_c = auth(token_for(cust))
    r1 = client.post("/api/v1/marketplace/offers/accept", headers=tok_c, json={"offer_id": off1})
    r2 = client.post("/api/v1/marketplace/offers/accept", headers=tok_c, json={"offer_id": off2})
    codes = sorted([r1.status_code, r2.status_code])
    assert codes == [200, 409]  # une acceptation passe, l'autre est refusée
    db = TestingSessionLocal()
    jobs = db.query(Job).filter(Job.request_id == req_id).all()
    assert len(jobs) == 1
    # l'offre perditrice est passée rejected
    losing = off1 if r1.status_code == 409 else off2
    assert db.get(Offer, losing).status == "rejected"


def test_accept_requires_ownership(db_session, token_for):
    cust, prov, _, req_id = _open_request(db_session, token_for)
    tok_p = ptok(db_session, token_for, prov)
    offer = client.post("/api/v1/marketplace/offers", headers=tok_p,
                        json={"request_id": req_id, "price": 80000}).json()["offer_id"]
    attacker = mk_user(db_session, "+212610000050")
    r = client.post("/api/v1/marketplace/offers/accept", headers=auth(token_for(attacker)),
                    json={"offer_id": offer})
    assert r.status_code == 403


def test_offers_list_private_to_owner(db_session, token_for):
    cust, prov, _, req_id = _open_request(db_session, token_for)
    client.post("/api/v1/marketplace/offers", headers=ptok(db_session, token_for, prov),
                json={"request_id": req_id, "price": 80000})
    ok = client.get(f"/api/v1/marketplace/requests/{req_id}/offers", headers=auth(token_for(cust)))
    assert ok.status_code == 200 and len(ok.json()["offers"]) == 1
    attacker = mk_user(db_session, "+212610000060")
    denied = client.get(f"/api/v1/marketplace/requests/{req_id}/offers", headers=auth(token_for(attacker)))
    assert denied.status_code == 403
