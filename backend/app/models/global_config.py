"""
Database models - Phase 1: Global Foundation
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Country(Base):
    """Country configuration"""
    __tablename__ = "countries"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(2), unique=True, index=True, nullable=False)  # ISO 3166-1 alpha-2
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100))  # Arabic name
    name_en = Column(String(100))  # English name
    
    # Configuration
    currency = Column(String(3), nullable=False)  # ISO 4217 (MAD, EUR, USD)
    currency_symbol = Column(String(10), nullable=False)  # MAD, €, $
    phone_format = Column(String(50), nullable=False)  # Regex pattern
    plate_format = Column(String(100))  # Regex pattern for license plates
    
    # Locales supported
    locales = Column(JSON, nullable=False)  # ["fr", "ar", "en"]
    default_locale = Column(String(2), nullable=False)  # "fr"
    
    # Legal
    legal_texts = Column(JSON)  # URLs to terms, privacy, etc.
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    launch_status = Column(String(20), default="coming_soon")  # live, coming_soon, planned
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    cities = relationship("City", back_populates="country")


class City(Base):
    """City configuration within a country"""
    __tablename__ = "cities"
    
    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)
    
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100))
    name_en = Column(String(100))
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Status
    launch_status = Column(String(20), default="coming_soon")  # live, coming_soon, planned
    launch_date = Column(DateTime(timezone=True))
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    country = relationship("Country", back_populates="cities")


class VehicleType(Base):
    """Vehicle types supported by the platform"""
    __tablename__ = "vehicle_types"
    
    id = Column(Integer, primary_key=True, index=True)
    
    name = Column(String(50), unique=True, nullable=False)  # car, motorcycle, scooter, etc.
    name_ar = Column(String(50))
    name_en = Column(String(50))
    
    icon = Column(String(10), nullable=False)  # Emoji or icon code
    description = Column(Text)
    
    # Configuration
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class UserSegment(Base):
    """User segments for targeted features and onboarding"""
    __tablename__ = "user_segments"
    
    id = Column(Integer, primary_key=True, index=True)
    
    name = Column(String(50), unique=True, nullable=False)  # individual, pro_driver, fleet, etc.
    name_ar = Column(String(50))
    name_en = Column(String(50))
    
    description = Column(Text)
    
    # Onboarding
    onboarding_copy_key = Column(String(100))  # i18n key for onboarding text
    default_services = Column(JSON)  # List of service IDs to highlight
    
    # Configuration
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class FeatureFlag(Base):
    """Database-stored feature flags for dynamic control"""
    __tablename__ = "feature_flags"
    
    id = Column(Integer, primary_key=True, index=True)
    
    key = Column(String(100), unique=True, index=True, nullable=False)
    enabled = Column(Boolean, default=False, nullable=False)
    rollout_percentage = Column(Integer, default=100)  # 0-100 for gradual rollout
    
    description = Column(Text)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    updated_by = Column(String(100))  # Admin user who last modified
