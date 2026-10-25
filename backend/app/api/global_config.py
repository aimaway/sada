"""
API endpoints for global configuration - Phase 1
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.global_config import Country, City, VehicleType, UserSegment, FeatureFlag
from app.schemas.global_config import (
    CountryCreate, CountryUpdate, CountryResponse,
    CityCreate, CityUpdate, CityResponse,
    VehicleTypeCreate, VehicleTypeUpdate, VehicleTypeResponse,
    UserSegmentCreate, UserSegmentUpdate, UserSegmentResponse,
    FeatureFlagCreate, FeatureFlagUpdate, FeatureFlagResponse,
    AppConfigResponse,
)

router = APIRouter()


# ============ Country Endpoints ============

@router.get("/countries", response_model=List[CountryResponse])
def list_countries(db: Session = Depends(get_db)):
    """List all countries"""
    return db.query(Country).filter(Country.is_active == True).all()


@router.get("/countries/{country_id}", response_model=CountryResponse)
def get_country(country_id: int, db: Session = Depends(get_db)):
    """Get country by ID"""
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


@router.get("/countries/code/{code}", response_model=CountryResponse)
def get_country_by_code(code: str, db: Session = Depends(get_db)):
    """Get country by ISO code"""
    country = db.query(Country).filter(Country.code == code.upper()).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


@router.post("/countries", response_model=CountryResponse, status_code=status.HTTP_201_CREATED)
def create_country(country: CountryCreate, db: Session = Depends(get_db)):
    """Create a new country (admin only)"""
    # Check if country code already exists
    existing = db.query(Country).filter(Country.code == country.code.upper()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Country code already exists")
    
    db_country = Country(**country.dict())
    db.add(db_country)
    db.commit()
    db.refresh(db_country)
    return db_country


@router.put("/countries/{country_id}", response_model=CountryResponse)
def update_country(country_id: int, country: CountryUpdate, db: Session = Depends(get_db)):
    """Update country (admin only)"""
    db_country = db.query(Country).filter(Country.id == country_id).first()
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    for key, value in country.dict(exclude_unset=True).items():
        setattr(db_country, key, value)
    
    db.commit()
    db.refresh(db_country)
    return db_country


# ============ City Endpoints ============

@router.get("/cities", response_model=List[CityResponse])
def list_cities(country_id: int = None, db: Session = Depends(get_db)):
    """List all cities, optionally filtered by country"""
    query = db.query(City)
    if country_id:
        query = query.filter(City.country_id == country_id)
    return query.all()


@router.get("/cities/{city_id}", response_model=CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    """Get city by ID"""
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city


@router.post("/cities", response_model=CityResponse, status_code=status.HTTP_201_CREATED)
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    """Create a new city (admin only)"""
    # Verify country exists
    country = db.query(Country).filter(Country.id == city.country_id).first()
    if not country:
        raise HTTPException(status_code=400, detail="Country not found")
    
    db_city = City(**city.dict())
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city


@router.put("/cities/{city_id}", response_model=CityResponse)
def update_city(city_id: int, city: CityUpdate, db: Session = Depends(get_db)):
    """Update city (admin only)"""
    db_city = db.query(City).filter(City.id == city_id).first()
    if not db_city:
        raise HTTPException(status_code=404, detail="City not found")
    
    for key, value in city.dict(exclude_unset=True).items():
        setattr(db_city, key, value)
    
    db.commit()
    db.refresh(db_city)
    return db_city


# ============ Vehicle Type Endpoints ============

@router.get("/vehicle-types", response_model=List[VehicleTypeResponse])
def list_vehicle_types(db: Session = Depends(get_db)):
    """List all vehicle types"""
    return db.query(VehicleType).filter(VehicleType.is_active == True).order_by(VehicleType.display_order).all()


@router.get("/vehicle-types/{vehicle_type_id}", response_model=VehicleTypeResponse)
def get_vehicle_type(vehicle_type_id: int, db: Session = Depends(get_db)):
    """Get vehicle type by ID"""
    vehicle_type = db.query(VehicleType).filter(VehicleType.id == vehicle_type_id).first()
    if not vehicle_type:
        raise HTTPException(status_code=404, detail="Vehicle type not found")
    return vehicle_type


@router.post("/vehicle-types", response_model=VehicleTypeResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle_type(vehicle_type: VehicleTypeCreate, db: Session = Depends(get_db)):
    """Create a new vehicle type (admin only)"""
    # Check if name already exists
    existing = db.query(VehicleType).filter(VehicleType.name == vehicle_type.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle type name already exists")
    
    db_vehicle_type = VehicleType(**vehicle_type.dict())
    db.add(db_vehicle_type)
    db.commit()
    db.refresh(db_vehicle_type)
    return db_vehicle_type


@router.put("/vehicle-types/{vehicle_type_id}", response_model=VehicleTypeResponse)
def update_vehicle_type(vehicle_type_id: int, vehicle_type: VehicleTypeUpdate, db: Session = Depends(get_db)):
    """Update vehicle type (admin only)"""
    db_vehicle_type = db.query(VehicleType).filter(VehicleType.id == vehicle_type_id).first()
    if not db_vehicle_type:
        raise HTTPException(status_code=404, detail="Vehicle type not found")
    
    for key, value in vehicle_type.dict(exclude_unset=True).items():
        setattr(db_vehicle_type, key, value)
    
    db.commit()
    db.refresh(db_vehicle_type)
    return db_vehicle_type


# ============ User Segment Endpoints ============

@router.get("/user-segments", response_model=List[UserSegmentResponse])
def list_user_segments(db: Session = Depends(get_db)):
    """List all user segments"""
    return db.query(UserSegment).filter(UserSegment.is_active == True).order_by(UserSegment.display_order).all()


@router.get("/user-segments/{segment_id}", response_model=UserSegmentResponse)
def get_user_segment(segment_id: int, db: Session = Depends(get_db)):
    """Get user segment by ID"""
    segment = db.query(UserSegment).filter(UserSegment.id == segment_id).first()
    if not segment:
        raise HTTPException(status_code=404, detail="User segment not found")
    return segment


@router.post("/user-segments", response_model=UserSegmentResponse, status_code=status.HTTP_201_CREATED)
def create_user_segment(segment: UserSegmentCreate, db: Session = Depends(get_db)):
    """Create a new user segment (admin only)"""
    # Check if name already exists
    existing = db.query(UserSegment).filter(UserSegment.name == segment.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="User segment name already exists")
    
    db_segment = UserSegment(**segment.dict())
    db.add(db_segment)
    db.commit()
    db.refresh(db_segment)
    return db_segment


@router.put("/user-segments/{segment_id}", response_model=UserSegmentResponse)
def update_user_segment(segment_id: int, segment: UserSegmentUpdate, db: Session = Depends(get_db)):
    """Update user segment (admin only)"""
    db_segment = db.query(UserSegment).filter(UserSegment.id == segment_id).first()
    if not db_segment:
        raise HTTPException(status_code=404, detail="User segment not found")
    
    for key, value in segment.dict(exclude_unset=True).items():
        setattr(db_segment, key, value)
    
    db.commit()
    db.refresh(db_segment)
    return db_segment


# ============ Feature Flag Endpoints ============

@router.get("/feature-flags", response_model=List[FeatureFlagResponse])
def list_feature_flags(db: Session = Depends(get_db)):
    """List all feature flags"""
    return db.query(FeatureFlag).all()


@router.get("/feature-flags/{flag_key}", response_model=FeatureFlagResponse)
def get_feature_flag(flag_key: str, db: Session = Depends(get_db)):
    """Get feature flag by key"""
    flag = db.query(FeatureFlag).filter(FeatureFlag.key == flag_key).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    return flag


@router.post("/feature-flags", response_model=FeatureFlagResponse, status_code=status.HTTP_201_CREATED)
def create_feature_flag(flag: FeatureFlagCreate, db: Session = Depends(get_db)):
    """Create a new feature flag (admin only)"""
    # Check if key already exists
    existing = db.query(FeatureFlag).filter(FeatureFlag.key == flag.key).first()
    if existing:
        raise HTTPException(status_code=400, detail="Feature flag key already exists")
    
    db_flag = FeatureFlag(**flag.dict())
    db.add(db_flag)
    db.commit()
    db.refresh(db_flag)
    return db_flag


@router.put("/feature-flags/{flag_key}", response_model=FeatureFlagResponse)
def update_feature_flag(flag_key: str, flag: FeatureFlagUpdate, db: Session = Depends(get_db)):
    """Update feature flag (admin only)"""
    db_flag = db.query(FeatureFlag).filter(FeatureFlag.key == flag_key).first()
    if not db_flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    
    for key, value in flag.dict(exclude_unset=True).items():
        setattr(db_flag, key, value)
    
    db.commit()
    db.refresh(db_flag)
    return db_flag


# ============ App Config Endpoint ============

@router.get("/config", response_model=AppConfigResponse)
def get_app_config(db: Session = Depends(get_db)):
    """Get complete app configuration for frontend initialization"""
    countries = db.query(Country).filter(Country.is_active == True).all()
    vehicle_types = db.query(VehicleType).filter(VehicleType.is_active == True).order_by(VehicleType.display_order).all()
    user_segments = db.query(UserSegment).filter(UserSegment.is_active == True).order_by(UserSegment.display_order).all()
    
    # Get feature flags as dict
    flags = db.query(FeatureFlag).all()
    feature_flags_dict = {flag.key: flag.enabled for flag in flags}
    
    return AppConfigResponse(
        countries=countries,
        vehicle_types=vehicle_types,
        user_segments=user_segments,
        feature_flags=feature_flags_dict,
    )
