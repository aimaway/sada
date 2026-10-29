"""
Modèles Tuner Portal - Projects, Estimates, Appointments
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


# Enums
class ProjectStatus(str, enum.Enum):
    REQUEST_RECEIVED = "request_received"
    INITIAL_REVIEW = "initial_review"
    APPOINTMENT_SCHEDULED = "appointment_scheduled"
    VEHICLE_INSPECTED = "vehicle_inspected"
    DIAGNOSIS_COMPLETED = "diagnosis_completed"
    ESTIMATE_PREPARED = "estimate_prepared"
    AWAITING_APPROVAL = "awaiting_approval"
    PARTS_ORDERED = "parts_ordered"
    PARTS_RECEIVED = "parts_received"
    WORK_IN_PROGRESS = "work_in_progress"
    QUALITY_CHECKS = "quality_checks"
    CUSTOMER_HANDOVER = "customer_handover"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EstimateStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVISION_REQUESTED = "revision_requested"
    CANCELLED = "cancelled"


class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class TuningCategory(str, enum.Enum):
    ECU_TUNING = "ecu_tuning"
    PERFORMANCE = "performance"
    SUSPENSION = "suspension"
    EXHAUST = "exhaust"
    BRAKES = "brakes"
    WHEELS_TIRES = "wheels_tires"
    STYLING = "styling"
    LIGHTING = "lighting"
    ELECTRONICS = "electronics"
    DIAGNOSTICS = "diagnostics"
    DYNO = "dyno"
    OTHER = "other"


# Models
class TuningService(Base):
    """Services de tuning proposés par le tuner"""
    __tablename__ = "tuning_services"
    
    id = Column(Integer, primary_key=True, index=True)
    tuner_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Service details
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(SQLEnum(TuningCategory), nullable=False)
    
    # Pricing
    indicative_price = Column(Integer, nullable=True)  # en centimes
    price_range_min = Column(Integer, nullable=True)
    price_range_max = Column(Integer, nullable=True)
    currency = Column(String(3), default="MAD")
    
    # Duration
    estimated_duration = Column(Integer, nullable=True)  # en minutes
    requires_appointment = Column(Boolean, default=True)
    
    # Compatibility
    supported_vehicles = Column(JSON, default=[])  # ["car", "motorcycle", etc.]
    supported_makes = Column(JSON, default=[])  # ["Toyota", "BMW", etc.]
    
    # Availability
    is_available = Column(Boolean, default=True)
    availability_schedule = Column(JSON, default={})  # jours/heures
    
    # Conditions
    service_conditions = Column(Text, nullable=True)
    
    # Stats
    times_booked = Column(Integer, default=0)
    rating_avg = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tuner = relationship("ProviderProfile")
    requests = relationship("TuningRequest")
    # Dev-phase fix: no direct FK between tuning_services and tuning_projects;
    # they link through TuningRequest.service_id (secondary join, viewonly).
    projects = relationship(
        "TuningProject",
        secondary="tuning_requests",
        primaryjoin="TuningService.id == foreign(TuningRequest.service_id)",
        secondaryjoin="TuningRequest.id == foreign(TuningProject.request_id)",
        viewonly=True,
    )


class TuningRequest(Base):
    """Demandes de tuning des clients"""
    __tablename__ = "tuning_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Parties
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tuner_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("tuning_services.id"), nullable=True)
    
    # Vehicle info
    vehicle_make = Column(String(100), nullable=False)
    vehicle_model = Column(String(100), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    vehicle_engine = Column(String(100), nullable=True)
    vehicle_mileage = Column(Integer, nullable=True)
    vehicle_vin = Column(String(17), nullable=True)
    
    # Request details
    requested_modifications = Column(Text, nullable=False)
    desired_outcomes = Column(Text, nullable=True)
    customer_notes = Column(Text, nullable=True)
    reference_photos = Column(JSON, default=[])
    
    # Budget & timing
    budget_min = Column(Integer, nullable=True)  # en centimes
    budget_max = Column(Integer, nullable=True)
    preferred_appointment = Column(DateTime(timezone=True), nullable=True)
    urgency_level = Column(String(50), default="normal")  # low, normal, high, urgent
    
    # Status
    status = Column(String(50), default="available")  # available, accepted, in_progress, completed, cancelled
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    
    # Required parts
    required_parts = Column(JSON, default=[])
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User")
    tuner = relationship("ProviderProfile")
    service = relationship("TuningService", viewonly=True)
    project = relationship("TuningProject", back_populates="request", uselist=False)
    appointments = relationship("Appointment", back_populates="request")


class TuningProject(Base):
    """Projets de tuning"""
    __tablename__ = "tuning_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_number = Column(String(50), unique=True, index=True, nullable=False)
    request_id = Column(Integer, ForeignKey("tuning_requests.id"), nullable=False)
    
    # Vehicle
    vehicle_make = Column(String(100), nullable=False)
    vehicle_model = Column(String(100), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    vehicle_engine = Column(String(100), nullable=True)
    vehicle_mileage = Column(Integer, nullable=True)
    vehicle_specs = Column(JSON, default={})
    
    # Project details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(SQLEnum(TuningCategory), nullable=False)
    
    # Status workflow
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.REQUEST_RECEIVED)
    status_history = Column(JSON, default=[])  # [{status, timestamp, notes}]
    
    # Financial
    estimated_budget = Column(Integer, nullable=True)
    final_budget = Column(Integer, nullable=True)
    approved_amount = Column(Integer, nullable=True)
    
    # Timeline
    start_date = Column(DateTime(timezone=True), nullable=True)
    expected_completion = Column(DateTime(timezone=True), nullable=True)
    actual_completion = Column(DateTime(timezone=True), nullable=True)
    
    # Work performed
    work_description = Column(Text, nullable=True)
    parts_used = Column(JSON, default=[])
    labor_hours = Column(Float, nullable=True)
    
    # Media
    before_photos = Column(JSON, default=[])
    after_photos = Column(JSON, default=[])
    videos = Column(JSON, default=[])
    
    # Quality
    quality_check_passed = Column(Boolean, default=False)
    quality_check_notes = Column(Text, nullable=True)
    
    # Customer handover
    handover_date = Column(DateTime(timezone=True), nullable=True)
    handover_notes = Column(Text, nullable=True)
    customer_satisfaction = Column(Integer, nullable=True)  # 1-5
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    request = relationship("TuningRequest", back_populates="project")
    estimates = relationship("ProjectEstimate", back_populates="project", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="project")
    work_logs = relationship("WorkLog", back_populates="project", cascade="all, delete-orphan")
    portfolio_entry = relationship("PortfolioEntry", back_populates="project", uselist=False)


class ProjectEstimate(Base):
    """Devis pour projets de tuning"""
    __tablename__ = "project_estimates"
    
    id = Column(Integer, primary_key=True, index=True)
    estimate_number = Column(String(50), unique=True, index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("tuning_projects.id"), nullable=False)
    
    # Status
    status = Column(SQLEnum(EstimateStatus), default=EstimateStatus.DRAFT)
    version = Column(Integer, default=1)
    
    # Line items
    line_items = Column(JSON, nullable=False)  # [{category, description, labor_hours, labor_rate, parts, total}]
    
    # Financial
    parts_subtotal = Column(Integer, nullable=False)  # en centimes
    labor_subtotal = Column(Integer, nullable=False)
    other_fees = Column(Integer, default=0)
    tax_amount = Column(Integer, default=0)
    total_estimate = Column(Integer, nullable=False)
    
    # Duration
    estimated_duration = Column(Integer, nullable=True)  # en heures
    
    # Notes
    notes = Column(Text, nullable=True)
    terms_conditions = Column(Text, nullable=True)
    
    # Approval
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    revision_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    project = relationship("TuningProject", back_populates="estimates")
    approver = relationship("User")


class Appointment(Base):
    """Rendez-vous tuning"""
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    appointment_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Parties
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tuner_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("tuning_requests.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("tuning_projects.id"), nullable=True)
    
    # Details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    service_type = Column(String(100), nullable=True)
    
    # Schedule
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    duration = Column(Integer, nullable=False)  # en minutes
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    # Location
    location_type = Column(String(50), default="workshop")  # workshop, customer_location, mobile
    location_address = Column(Text, nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    
    # Status
    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    confirmation_code = Column(String(10), nullable=True)
    
    # Notes
    customer_notes = Column(Text, nullable=True)
    tuner_notes = Column(Text, nullable=True)
    
    # Rescheduling
    rescheduled_from = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    reschedule_reason = Column(Text, nullable=True)
    rescheduled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    customer = relationship("User")
    tuner = relationship("ProviderProfile")
    request = relationship("TuningRequest", back_populates="appointments")
    project = relationship("TuningProject", back_populates="appointments")


class WorkLog(Base):
    """Journal de travail pour projets"""
    __tablename__ = "work_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("tuning_projects.id"), nullable=False)
    logged_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Work details
    work_date = Column(DateTime(timezone=True), nullable=False)
    hours_worked = Column(Float, nullable=False)
    work_description = Column(Text, nullable=False)
    
    # Parts used
    parts_used = Column(JSON, default=[])  # [{part_name, quantity, cost}]
    
    # Progress
    progress_percent = Column(Integer, nullable=True)  # 0-100
    next_steps = Column(Text, nullable=True)
    
    # Media
    photos = Column(JSON, default=[])
    notes = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("TuningProject", back_populates="work_logs")
    user = relationship("User")


class PortfolioEntry(Base):
    """Entrées portfolio pour projets complétés"""
    __tablename__ = "portfolio_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("tuning_projects.id"), nullable=False)
    tuner_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    
    # Portfolio details
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Vehicle
    vehicle_make = Column(String(100), nullable=False)
    vehicle_model = Column(String(100), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    
    # Modifications
    modification_categories = Column(JSON, default=[])  # ["ecu_tuning", "exhaust", etc.]
    modifications_description = Column(Text, nullable=True)
    
    # Performance
    performance_gains = Column(JSON, default={})  # {horsepower: "+50", torque: "+80Nm", etc.}
    dyno_results = Column(JSON, default={})
    
    # Media
    before_photos = Column(JSON, default=[])
    after_photos = Column(JSON, default=[])
    videos = Column(JSON, default=[])
    
    # Parts used
    parts_used = Column(JSON, default=[])  # [{name, brand, price}]
    
    # Work performed
    work_description = Column(Text, nullable=True)
    labor_hours = Column(Float, nullable=True)
    
    # Publication
    publication_status = Column(String(50), default="draft")  # draft, published, archived
    published_at = Column(DateTime(timezone=True), nullable=True)
    featured = Column(Boolean, default=False)
    
    # Customer consent
    customer_consent = Column(Boolean, default=False)
    consent_date = Column(DateTime(timezone=True), nullable=True)
    
    # Stats
    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("TuningProject", back_populates="portfolio_entry")
    tuner = relationship("ProviderProfile")


class Invoice(Base):
    """Factures pour projets tuning"""
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Parties
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tuner_id = Column(Integer, ForeignKey("provider_profiles.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("tuning_projects.id"), nullable=True)
    
    # Invoice details
    issue_date = Column(DateTime(timezone=True), nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    # Line items
    line_items = Column(JSON, nullable=False)  # [{description, quantity, unit_price, total}]
    
    # Financial
    subtotal = Column(Integer, nullable=False)  # en centimes
    tax_rate = Column(Float, default=20.0)  # pourcentage
    tax_amount = Column(Integer, default=0)
    discount_amount = Column(Integer, default=0)
    total = Column(Integer, nullable=False)
    
    # Status
    status = Column(String(50), default="draft")  # draft, sent, paid, overdue, cancelled
    
    # Payment
    payment_method = Column(String(50), nullable=True)
    payment_reference = Column(String(100), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    terms = Column(Text, nullable=True)
    
    # Document
    pdf_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    sent_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    customer = relationship("User")
    tuner = relationship("ProviderProfile")
    project = relationship("TuningProject")
