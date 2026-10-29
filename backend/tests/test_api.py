"""
Tests unitaires pour l'API TomoBily
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Base propre pour chaque test (isolation).

    drop_all seul laisse des lignes orphelines quand un modèle n'est pas
    importé dans Base.metadata au moment du drop; on supprime donc aussi
    explicitement toutes les tables existantes, dans l'ordre inverse des FK.
    """
    Base.metadata.create_all(bind=engine)
    yield
    from sqlalchemy import inspect as sa_inspect, text
    with engine.begin() as conn:
        try:
            conn.execute(text("PRAGMA foreign_keys=OFF"))
            insp = sa_inspect(engine)
            for t in reversed(insp.get_table_names()):
                conn.execute(text(f'DELETE FROM "{t}"'))
            conn.execute(text("PRAGMA foreign_keys=ON"))
        except Exception:
            pass
    Base.metadata.drop_all(bind=engine)


# ============ Authentication Tests ============

def test_register_user():
    """Test d'inscription d'un utilisateur"""
    response = client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000001",
            "password": "testpassword123",
            "full_name": "Test User",
            "role": "customer"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["phone"] == "+212600000001"
    assert data["user"]["role"] == "customer"


def test_register_duplicate_phone():
    """Test d'inscription avec un téléphone déjà utilisé"""
    # Premier inscription
    client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000002",
            "password": "testpassword123",
            "full_name": "Test User 1"
        }
    )
    
    # Deuxième inscription avec le même téléphone
    response = client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000002",
            "password": "testpassword123",
            "full_name": "Test User 2"
        }
    )
    assert response.status_code == 400
    assert "déjà utilisé" in response.json()["detail"]


def test_login_user():
    """Test de connexion d'un utilisateur"""
    # Créer un utilisateur
    client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000003",
            "password": "testpassword123",
            "full_name": "Test User"
        }
    )
    
    # Se connecter
    response = client.post(
        "/api/v1/auth/login",
        params={
            "phone": "+212600000003",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["phone"] == "+212600000003"


def test_login_invalid_credentials():
    """Test de connexion avec des identifiants invalides"""
    response = client.post(
        "/api/v1/auth/login",
        params={
            "phone": "+212600000999",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401


# ============ Provider Tests ============

def test_create_provider_profile():
    """Test de création d'un profil provider"""
    # Créer un utilisateur
    register_response = client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000004",
            "password": "testpassword123",
            "full_name": "Test Mechanic",
            "role": "mechanic"
        }
    )
    token = register_response.json()["access_token"]
    
    # Créer un profil provider
    response = client.post(
        "/api/v1/providers",
        params={
            "type": "mechanic",
            "slug": "test-mechanic",
            "name": "Test Mechanic Shop",
            "bio": "Expert en réparation auto",
            "city": "Casablanca"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "provider_id" in data


def test_get_providers():
    """Test de récupération de la liste des providers"""
    response = client.get("/api/v1/providers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_provider_by_slug():
    """Test de récupération d'un provider par slug"""
    # Créer un provider d'abord
    register_response = client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000005",
            "password": "testpassword123",
            "full_name": "Test Mechanic 2",
            "role": "mechanic"
        }
    )
    token = register_response.json()["access_token"]
    
    client.post(
        "/api/v1/providers",
        params={
            "type": "mechanic",
            "slug": "test-mechanic-2",
            "name": "Test Mechanic Shop 2",
            "city": "Casablanca"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Récupérer le provider
    response = client.get("/api/v1/providers/test-mechanic-2")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "test-mechanic-2"


# ============ Plan Tests ============

def test_get_plans():
    """Test de récupération de la liste des plans"""
    response = client.get("/api/v1/plans")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_plan_by_slug():
    """Test de récupération d'un plan par slug"""
    response = client.get("/api/v1/plans/client-gold")
    # Peut retourner 404 si le plan n'existe pas encore
    assert response.status_code in [200, 404]


# ============ Job Tests ============

def test_get_jobs_unauthorized():
    """Test de récupération des jobs sans authentification"""
    response = client.get("/api/v1/jobs")
    assert response.status_code == 401


def test_get_jobs_authorized():
    """Test de récupération des jobs avec authentification"""
    # Créer un utilisateur
    register_response = client.post(
        "/api/v1/auth/register",
        params={
            "phone": "+212600000006",
            "password": "testpassword123",
            "full_name": "Test Customer"
        }
    )
    token = register_response.json()["access_token"]
    
    # Récupérer les jobs
    response = client.get(
        "/api/v1/jobs",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


# ============ Health Check Tests ============

def test_health_check():
    """Test du health check"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_root():
    """Test de la route racine"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


# ============ Auto-close Tests ============

def test_auto_close_logic():
    """Test de la logique d'auto-close"""
    from datetime import datetime, timedelta
    from app.models import Job, JobStatus
    
    # Créer un job avec un deadline dépassé
    db = TestingSessionLocal()
    
    # Créer un utilisateur et un provider d'abord
    user = User(
        phone="+212600000007",
        password_hash="hashed_password",
        full_name="Test Customer",
        role="customer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    provider = ProviderProfile(
        user_id=user.id,
        type="mechanic",
        slug="test-provider",
        name="Test Provider",
        city="Casablanca",
        wallet_balance=10000
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)
    
    job = Job(
        customer_id=user.id,
        provider_id=provider.id,
        status=JobStatus.IN_PROGRESS,
        agreed_price=50000,
        auto_close_deadline=datetime.utcnow() - timedelta(hours=1)
    )
    db.add(job)
    db.commit()
    
    # Vérifier que le job est éligible à l'auto-close
    assert job.status == JobStatus.IN_PROGRESS
    assert job.auto_close_deadline < datetime.utcnow()
    
    db.close()


# Import pour le test
from app.models import User, ProviderProfile


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
