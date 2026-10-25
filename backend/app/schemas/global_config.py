"""
Pydantic schemas for API validation - Phase 1: Global Foundation
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============ Country Schemas ============

class CountryBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=2, description="ISO 3166-1 alpha-2 code")
    name: str = Field(..., min_length=1, max_length=100)
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    currency: str = Field(..., min_length=3, max_length=3, description="ISO 4217 currency code")
    currency_symbol: str = Field(..., max_length=10)
    phone_format: str
    plate_format: Optional[str] = None
    locales: List[str] = Field(..., min_length=1)
    default_locale: str = Field(..., min_length=2, max_length=2)
    legal_texts: Optional[dict] = None
    is_active: bool = True
    launch_status: str = Field(default="coming_soon", pattern="^(live|coming_soon|planned)$")


class CountryCreate(CountryBase):
    pass


class CountryUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    currency: Optional[str] = None
    currency_symbol: Optional[str] = None
    phone_format: Optional[str] = None
    plate_format: Optional[str] = None
    locales: Optional[List[str]] = None
    default_locale: Optional[str] = None
    legal_texts: Optional[dict] = None
    is_active: Optional[bool] = None
    launch_status: Optional[str] = None


class CountryResponse(CountryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============ City Schemas ============

class CityBase(BaseModel):
    country_id: int
    name: str = Field(..., min_length=1, max_length=100)
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    launch_status: str = Field(default="coming_soon", pattern="^(live|coming_soon|planned)$")
    launch_date: Optional[datetime] = None


class CityCreate(CityBase):
    pass


class CityUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    launch_status: Optional[str] = None
    launch_date: Optional[datetime] = None


class CityResponse(CityBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    country: Optional[CountryResponse] = None
    
    class Config:
        from_attributes = True


# ============ Vehicle Type Schemas ============

class VehicleTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    icon: str = Field(..., max_length=10)
    description: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class VehicleTypeCreate(VehicleTypeBase):
    pass


class VehicleTypeUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class VehicleTypeResponse(VehicleTypeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============ User Segment Schemas ============

class UserSegmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    onboarding_copy_key: Optional[str] = None
    default_services: Optional[List[int]] = None
    is_active: bool = True
    display_order: int = 0


class UserSegmentCreate(UserSegmentBase):
    pass


class UserSegmentUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    onboarding_copy_key: Optional[str] = None
    default_services: Optional[List[int]] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class UserSegmentResponse(UserSegmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============ Feature Flag Schemas ============

class FeatureFlagBase(BaseModel):
    key: str = Field(..., min_length=1, max_length=100)
    enabled: bool = False
    rollout_percentage: int = Field(default=100, ge=0, le=100)
    description: Optional[str] = None


class FeatureFlagCreate(FeatureFlagBase):
    pass


class FeatureFlagUpdate(BaseModel):
    enabled: Optional[bool] = None
    rollout_percentage: Optional[int] = None
    description: Optional[str] = None


class FeatureFlagResponse(FeatureFlagBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============ Config Response Schemas ============

class AppConfigResponse(BaseModel):
    """Complete app configuration for frontend"""
    countries: List[CountryResponse]
    vehicle_types: List[VehicleTypeResponse]
    user_segments: List[UserSegmentResponse]
    feature_flags: dict
    
    class Config:
        from_attributes = True
