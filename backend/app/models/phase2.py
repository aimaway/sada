"""
Database models - Phase 2: New Customer Segments
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey, Text, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


# ============ Enums ============

class InspectionVerdict(str, enum.Enum):
    BUY = "buy"
    NEGOTIATE = "negotiate"
    AVOID = "avoid"


class OnBehalfStatus(str, enum.Enum):
    PENDING = "pending"
    LOCATION_SHARED = "location_shared"
    QUOTE_APPROVED = "quote_approved"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RecurringPlanFrequency(str, enum.Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


# ============ Two-Wheelers & Pros Models ============

class UrgentRequest(Base):
    """Urgent requests for two-wheelers and pros (back on the road fast)"""
    __tablename__ = "urgent_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    
    # Urgent issue type
    issue_type = Column(String(50), nullable=False)  # puncture, chain, brakes, battery
    description = Column(Text, nullable=False)
    photos = Column(JSON)  # List of photo URLs
    
    # Location
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(Text)
    
    # Pricing
    customer_price = Column(Integer, nullable=False)  # in centimes
    agreed_price = Column(Integer)
    
    # Status
    status = Column(String(20), default="open")  # open, accepted, in_progress, completed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    
    # For pros: downtime cost hint
    downtime_cost_per_hour = Column(Integer)  # in centimes
    estimated_downtime_hours = Column(Float)
    
    # Assignment
    assigned_mechanic_id = Column(Integer, ForeignKey("users.id"))
    completed_at = Column(DateTime(timezone=True))
    
    # Metadata
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class RecurringPlan(Base):
    """Recurring maintenance plans for fleets and pros"""
    __tablename__ = "recurring_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    
    # Plan details
    name = Column(String(100), nullable=False)
    service_type = Column(String(50), nullable=False)  # oil_change, brake_check, etc.
    frequency = Column(String(20), nullable=False)  # weekly, monthly, etc.
    
    # Schedule
    next_service_date = Column(DateTime(timezone=True), nullable=False)
    next_service_mileage = Column(Integer)
    
    # Pricing
    price_per_service = Column(Integer)  # in centimes
    discount_percent = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    last_service_date = Column(DateTime(timezone=True))
    last_service_mileage = Column(Integer)
    
    # Metadata
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", foreign_keys=[customer_id])
    vehicle = relationship("Vehicle", foreign_keys=[vehicle_id])


# ============ Pre-purchase Inspection Models ============

class InspectionRequest(Base):
    """Pre-purchase inspection requests"""
    __tablename__ = "inspection_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Vehicle info (not owned by buyer yet)
    vehicle_make = Column(String(50), nullable=False)
    vehicle_model = Column(String(50), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    vehicle_vin = Column(String(17))  # Optional VIN
    vehicle_mileage = Column(Integer)
    vehicle_location = Column(Text)  # Where the car is located
    
    # Inspection details
    inspection_date = Column(DateTime(timezone=True), nullable=False)
    inspection_address = Column(Text, nullable=False)
    
    # Checklist (structured)
    checklist_data = Column(JSON)  # {engine: {status, notes, photos[]}, gearbox: {...}, ...}
    
    # Results
    repair_cost_estimate = Column(Integer)  # in centimes
    negotiation_price_range_min = Column(Integer)
    negotiation_price_range_max = Column(Integer)
    verdict = Column(String(20))  # buy, negotiate, avoid
    verdict_explanation = Column(Text)
    
    # Photos & Documents
    photos = Column(JSON)  # List of photo URLs
    obd_scan_data = Column(JSON)  # OBD diagnostic data
    
    # Report
    report_url = Column(String(500))  # Public shareable URL
    report_pdf_url = Column(String(500))  # PDF download URL
    public_slug = Column(String(100), unique=True)
    
    # Status
    status = Column(String(20), default="pending")  # pending, scheduled, in_progress, completed
    assigned_inspector_id = Column(Integer, ForeignKey("users.id"))
    
    # Pricing
    inspection_fee = Column(Integer)  # in centimes
    
    # Metadata
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    buyer = relationship("User", foreign_keys=[buyer_id])
    inspector = relationship("User", foreign_keys=[assigned_inspector_id])


# ============ On-behalf Request Models ============

class OnBehalfRequest(Base):
    """Requests made on behalf of someone else"""
    __tablename__ = "on_behalf_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    payer_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Who pays
    
    # Beneficiary info
    beneficiary_name = Column(String(100), nullable=False)
    beneficiary_phone = Column(String(20), nullable=False)
    beneficiary_email = Column(String(100))
    
    # Vehicle info
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))  # Optional if beneficiary has account
    vehicle_make = Column(String(50))
    vehicle_model = Column(String(50))
    vehicle_year = Column(Integer)
    vehicle_plate = Column(String(20))
    
    # Request details
    service_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    photos = Column(JSON)
    
    # Location
    lat = Column(Float)
    lng = Column(Float)
    address = Column(Text)
    
    # Beneficiary actions
    beneficiary_location_shared = Column(Boolean, default=False)
    beneficiary_location_lat = Column(Float)
    beneficiary_location_lng = Column(Float)
    beneficiary_quote_approved = Column(Boolean, default=False)
    approved_price = Column(Integer)  # in centimes
    
    # Sharing
    share_token = Column(String(100), unique=True)  # For WhatsApp/SMS link
    share_url = Column(String(500))
    
    # Status
    status = Column(String(20), default="pending")  # pending, location_shared, quote_approved, in_progress, completed, cancelled
    
    # Assignment
    assigned_mechanic_id = Column(Integer, ForeignKey("users.id"))
    agreed_price = Column(Integer)
    
    # Metadata
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    payer = relationship("User", foreign_keys=[payer_id])
    mechanic = relationship("User", foreign_keys=[assigned_mechanic_id])


# ============ Mechanic/Seller Enhanced Models ============

class MechanicPublicProfile(Base):
    """Enhanced public profile for mechanics (creator pages)"""
    __tablename__ = "mechanic_public_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    mechanic_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Public info
    slug = Column(String(100), unique=True, nullable=False)  # /m/{slug}
    bio = Column(Text)
    specialties = Column(JSON)  # List of specialties
    
    # Media
    gallery_photos = Column(JSON)  # Before/after photos
    video_urls = Column(JSON)  # YouTube, etc.
    
    # Stats
    total_views = Column(Integer, default=0)
    total_bookings = Column(Integer, default=0)
    
    # Referral
    referral_code = Column(String(50), unique=True)
    referral_count = Column(Integer, default=0)
    
    # Visibility
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Metadata
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    mechanic = relationship("User", foreign_keys=[mechanic_id])


class MechanicVisibilityStats(Base):
    """Track mechanic visibility and performance"""
    __tablename__ = "mechanic_visibility_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    mechanic_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    
    # Metrics
    profile_views = Column(Integer, default=0)
    request_views = Column(Integer, default=0)
    offers_sent = Column(Integer, default=0)
    offers_accepted = Column(Integer, default=0)
    jobs_completed = Column(Integer, default=0)
    
    # Earnings
    total_earned = Column(Integer, default=0)  # in centimes
    commission_paid = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    mechanic = relationship("User", foreign_keys=[mechanic_id])


class Invoice(Base):
    """Invoices for fleets and pros"""
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Invoice details
    invoice_number = Column(String(50), unique=True, nullable=False)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Items
    items = Column(JSON)  # List of {description, quantity, unit_price, total}
    
    # Totals
    subtotal = Column(Integer, nullable=False)  # in centimes
    tax_amount = Column(Integer, default=0)
    total = Column(Integer, nullable=False)
    
    # Status
    status = Column(String(20), default="draft")  # draft, sent, paid, overdue
    due_date = Column(DateTime(timezone=True))
    paid_at = Column(DateTime(timezone=True))
    
    # Files
    pdf_url = Column(String(500))
    csv_url = Column(String(500))
    
    # Metadata
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", foreign_keys=[customer_id])
