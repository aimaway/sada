"""
Tests for global configuration endpoints - Phase 1
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.global_config import Country, City, VehicleType, UserSegment, FeatureFlag

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
    """Create tables before each test and drop after"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ============ Country Tests ============

def test_create_country():
    """Test creating a new country"""
    country_data = {
        "code": "MA",
        "name": "Maroc",
        "name_ar": "المغرب",
        "name_en": "Morocco",
        "currency": "MAD",
        "currency_symbol": "MAD",
        "phone_format": r"^\+212[5-7]\d{8}$",
        "plate_format": r"^\d{1,5}-[أ-يA-Z]-\d{1,2}$",
        "locales": ["fr", "ar", "en"],
        "default_locale": "fr",
    }
    
    response = client.post("/api/v1/countries", json=country_data)
    assert response.status_code == 201
    data = response.json()
    assert data["code"] == "MA"
    assert data["name"] == "Maroc"
    assert data["currency"] == "MAD"


def test_list_countries():
    """Test listing countries"""
    # Create a country first
    country_data = {
        "code": "MA",
        "name": "Maroc",
        "currency": "MAD",
        "currency_symbol": "MAD",
        "phone_format": r"^\+212[5-7]\d{8}$",
        "locales": ["fr", "ar", "en"],
        "default_locale": "fr",
    }
    client.post("/api/v1/countries", json=country_data)
    
    response = client.get("/api/v1/countries")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["code"] == "MA"


def test_get_country_by_code():
    """Test getting country by ISO code"""
    # Create a country first
    country_data = {
        "code": "MA",
        "name": "Maroc",
        "currency": "MAD",
        "currency_symbol": "MAD",
        "phone_format": r"^\+212[5-7]\d{8}$",
        "locales": ["fr", "ar", "en"],
        "default_locale": "fr",
    }
    client.post("/api/v1/countries", json=country_data)
    
    response = client.get("/api/v1/countries/code/MA")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == "MA"


def test_get_country_not_found():
    """Test getting non-existent country"""
    response = client.get("/api/v1/countries/code/XX")
    assert response.status_code == 404


# ============ Vehicle Type Tests ============

def test_create_vehicle_type():
    """Test creating a new vehicle type"""
    vt_data = {
        "name": "car",
        "name_ar": "سيارة",
        "name_en": "Car",
        "icon": "🚗",
        "description": "Voiture particulière",
    }
    
    response = client.post("/api/v1/vehicle-types", json=vt_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "car"
    assert data["icon"] == "🚗"


def test_list_vehicle_types():
    """Test listing vehicle types"""
    # Create a vehicle type first
    vt_data = {
        "name": "car",
        "icon": "🚗",
    }
    client.post("/api/v1/vehicle-types", json=vt_data)
    
    response = client.get("/api/v1/vehicle-types")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


# ============ User Segment Tests ============

def test_create_user_segment():
    """Test creating a new user segment"""
    seg_data = {
        "name": "individual",
        "name_ar": "فرد",
        "name_en": "Individual",
        "description": "Particulier standard",
        "onboarding_copy_key": "onboarding.individual",
    }
    
    response = client.post("/api/v1/user-segments", json=seg_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "individual"


def test_list_user_segments():
    """Test listing user segments"""
    # Create a segment first
    seg_data = {
        "name": "individual",
        "description": "Particulier standard",
    }
    client.post("/api/v1/user-segments", json=seg_data)
    
    response = client.get("/api/v1/user-segments")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


# ============ Feature Flag Tests ============

def test_create_feature_flag():
    """Test creating a new feature flag"""
    flag_data = {
        "key": "ENABLE_TEST_FEATURE",
        "enabled": True,
        "rollout_percentage": 100,
        "description": "Test feature",
    }
    
    response = client.post("/api/v1/feature-flags", json=flag_data)
    assert response.status_code == 201
    data = response.json()
    assert data["key"] == "ENABLE_TEST_FEATURE"
    assert data["enabled"] is True


def test_update_feature_flag():
    """Test updating a feature flag"""
    # Create a flag first
    flag_data = {
        "key": "ENABLE_TEST_FEATURE",
        "enabled": False,
        "rollout_percentage": 0,
    }
    client.post("/api/v1/feature-flags", json=flag_data)
    
    # Update it
    update_data = {
        "enabled": True,
        "rollout_percentage": 50,
    }
    response = client.put("/api/v1/feature-flags/ENABLE_TEST_FEATURE", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is True
    assert data["rollout_percentage"] == 50


# ============ App Config Tests ============

def test_get_app_config():
    """Test getting complete app configuration"""
    # Create some data first
    country_data = {
        "code": "MA",
        "name": "Maroc",
        "currency": "MAD",
        "currency_symbol": "MAD",
        "phone_format": r"^\+212[5-7]\d{8}$",
        "locales": ["fr", "ar", "en"],
        "default_locale": "fr",
    }
    client.post("/api/v1/countries", json=country_data)
    
    vt_data = {
        "name": "car",
        "icon": "🚗",
    }
    client.post("/api/v1/vehicle-types", json=vt_data)
    
    seg_data = {
        "name": "individual",
        "description": "Particulier",
    }
    client.post("/api/v1/user-segments", json=seg_data)
    
    response = client.get("/api/v1/config")
    assert response.status_code == 200
    data = response.json()
    assert "countries" in data
    assert "vehicle_types" in data
    assert "user_segments" in data
    assert "feature_flags" in data
    assert len(data["countries"]) >= 1
    assert len(data["vehicle_types"]) >= 1
    assert len(data["user_segments"]) >= 1


# ============ Health Check Tests ============

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
