"""
Modèles SQLAlchemy pour l'application mecaGO
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


# Enums
class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    MECHANIC = "mechanic"
    TUNER = "tuner"
    SELLER = "seller"
    ADMIN = "admin"


class ProviderType(str, enum.Enum):
    MECHANIC = "mechanic"
    TUNER = "tuner"
    SELLER = "seller"


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    ON_THE_WAY = "on_the_way"
    ARRIVED = "arrived"
    DIAGNOSING = "diagnosing"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    AUTO_CLOSED = "auto_closed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class PlanAudience(str, enum.Enum):
    CLIENT = "client"
    MECHANIC = "mechanic"
    SELLER = "seller"


# Models
class User(Base):
    """Table des utilisateurs"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    status = Column(String(50), default="active")
    language = Column(String(10), default="fr")
    is_demo = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    provider_profile = relationship("ProviderProfile", back_populates="user", uselist=False)
    customer_profile = relationship("CustomerProfile", back_populates="user", uselist=False)
    jobs = relationship("Job", back_populates="customer")
    requests = relationship("ServiceRequest", back_populates="customer")
    subscriptions = relationship("Subscription", back_populates="user")


class CustomerProfile(Base):
    """Profil client étendu"""
    __tablename__ = "customer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    loyalty_points = Column(Integer, default=0)
    total_jobs = Column(Integer, default=0)
    total_spent = Column(Integer, default=0)  # en centimes
    favorite_providers = Column(JSON, default=[])
    saved_addresses = Column(JSON, default=[])
    vehicles = Column(JSON, default=[])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="customer_profile")


class ProviderProfile(Base):
    """Profil provider (mécanicien, tuner, vendeur)"""
    __tablename__ = "provider_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Basic info
    type = Column(SQLEnum(ProviderType), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    avatar = Column(String(500), nullable=True)
    cover = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Verification
    verified = Column(Boolean, default=False)
    badges = Column(JSON, default=[])  # ["verified", "top_rated", etc.]
    verification_status = Column(String(50), default="pending")
    verification_data = Column(JSON, default={})
    
    # Stats
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    jobs_completed = Column(Integer, default=0)
    response_time = Column(Integer, default=0)  # en minutes
    completion_rate = Column(Float, default=0.0)
    
    # Location
    city = Column(String(100), nullable=False)
    address = Column(String(500), nullable=True)
    service_zone = Column(String(255), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    is_online = Column(Boolean, default=False)
    
    # Details
    languages = Column(JSON, default=[])
    specialties = Column(JSON, default=[])
    brands = Column(JSON, default=[])
    vehicle_types = Column(JSON, default=[])
    services = Column(JSON, default=[])
    certificates = Column(JSON, default=[])
    equipment = Column(JSON, default=[])
    gallery = Column(JSON, default=[])
    videos = Column(JSON, default=[])
    
    # Wallet
    wallet_balance = Column(Integer, default=0)  # en centimes
    min_wallet_balance = Column(Integer, default=5000)  # 50 MAD
    
    # Timestamps
    member_since = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="provider_profile")
    jobs = relationship("Job", back_populates="provider")
    reviews = relationship("Review", back_populates="provider")


class ServiceRequest(Base):
    """Demande de service client"""
    __tablename__ = "service_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Request details
    scenario = Column(String(100), nullable=False)
    family = Column(String(100), nullable=True)
    vehicle_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    photos = Column(JSON, default=[])
    
    # Location
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(500), nullable=True)
    
    # Pricing
    proposed_price = Column(Integer, nullable=False)  # en centimes
    
    # Status
    status = Column(String(50), default="open")
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", back_populates="requests")
    offers = relationship("Offer", back_populates="request")
    job = relationship("Job", back_populates="request", uselist=False)


class Offer(Base):
    """Offre d'un provider pour une demande"""
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Offer details
    price = Column(Integer, nullable=False)  # en centimes
    estimated_arrival = Column(Integer, nullable=True)  # en minutes
    message = Column(Text, nullable=True)
    includes_parts = Column(Boolean, default=False)
    
    # Status
    status = Column(String(50), default="pending")  # pending, accepted, rejected
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    request = relationship("ServiceRequest", back_populates="offers")
    provider = relationship("ProviderProfile")


class Job(Base):
    """Job/Intervention"""
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Job details
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING)
    agreed_price = Column(Integer, nullable=False)  # en centimes
    
    # Diagnosis
    diagnosis = Column(JSON, nullable=True)
    quote_update = Column(JSON, nullable=True)
    quote_update_approved = Column(Boolean, nullable=True)
    
    # Timeline
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    auto_close_deadline = Column(DateTime(timezone=True), nullable=True)
    auto_closed = Column(Boolean, default=False)
    
    # Completion
    before_photos = Column(JSON, default=[])
    after_photos = Column(JSON, default=[])
    final_amount = Column(Integer, nullable=True)
    
    # Dispute
    dispute_open = Column(Boolean, default=False)
    dispute_reason = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", back_populates="jobs")
    provider = relationship("ProviderProfile", back_populates="jobs")
    request = relationship("ServiceRequest", back_populates="job")
    reviews = relationship("Review", back_populates="job")


class Review(Base):
    """Avis client sur un job"""
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Review details
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    photos = Column(JSON, default=[])
    
    # Provider reply
    provider_reply = Column(Text, nullable=True)
    replied_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="reviews")
    provider = relationship("ProviderProfile", back_populates="reviews")


class Plan(Base):
    """Plan d'abonnement"""
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    
    # Plan details
    audience = Column(SQLEnum(PlanAudience), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)  # en centimes par mois
    features = Column(JSON, default=[])
    
    # Status
    status = Column(String(50), default="active")  # active, inactive
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    """Abonnement utilisateur à un plan"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    
    # Subscription details
    status = Column(String(50), default="active")  # active, cancelled, expired
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Payment
    payment_method = Column(String(50), nullable=True)
    last_payment_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")


class AuditLog(Base):
    """Journal d'audit pour traçabilité"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Action details
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(Integer, nullable=True)
    
    # Details
    details = Column(JSON, default={})
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
