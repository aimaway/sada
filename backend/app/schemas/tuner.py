"""
Schémas Pydantic pour Tuner Portal
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class ProjectStatus(str, Enum):
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


class EstimateStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVISION_REQUESTED = "revision_requested"
    CANCELLED = "cancelled"


class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class TuningCategory(str, Enum):
    ECU_TUNING = "ecu_tuning"
    PERFORMANCE = "performance"
    SUSPENSION = " suspension"
    EXHAUST = "exhaust"
    BRAKES = "brakes"
    WHEELS_TIRES = "wheels_tires"
    STYLING = "styling"
    LIGHTING = "lighting"
    ELECTRONICS = "electronics"
    DIAGNOSTICS = "diagnostics"
    DYNO = "dyno"
    OTHER = "other"


# Tuning Service Schemas
class TuningServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: TuningCategory
    indicative_price: Optional[int] = Field(None, ge=0)
    price_range_min: Optional[int] = Field(None, ge=0)
    price_range_max: Optional[int] = Field(None, ge=0)
    estimated_duration: Optional[int] = Field(None, gt=0)  # en minutes
    requires_appointment: bool = True
    supported_vehicles: List[str] = []
    supported_makes: List[str] = []
    is_available: bool = True
    service_conditions: Optional[str] = None


class TuningServiceCreate(TuningServiceBase):
    pass


class TuningServiceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[TuningCategory] = None
    indicative_price: Optional[int] = Field(None, ge=0)
    price_range_min: Optional[int] = Field(None, ge=0)
    price_range_max: Optional[int] = Field(None, ge=0)
    estimated_duration: Optional[int] = Field(None, gt=0)
    requires_appointment: Optional[bool] = None
    supported_vehicles: Optional[List[str]] = None
    supported_makes: Optional[List[str]] = None
    is_available: Optional[bool] = None
    service_conditions: Optional[str] = None


class TuningServiceResponse(TuningServiceBase):
    id: int
    tuner_id: int
    times_booked: int
    rating_avg: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Tuning Request Schemas
class TuningRequestCreate(BaseModel):
    service_id: Optional[int] = None
    vehicle_make: str = Field(..., min_length=1, max_length=100)
    vehicle_model: str = Field(..., min_length=1, max_length=100)
    vehicle_year: int = Field(..., ge=1900, le=2030)
    vehicle_engine: Optional[str] = Field(None, max_length=100)
    vehicle_mileage: Optional[int] = Field(None, ge=0)
    vehicle_vin: Optional[str] = Field(None, min_length=17, max_length=17)
    requested_modifications: str = Field(..., min_length=10)
    desired_outcomes: Optional[str] = None
    customer_notes: Optional[str] = None
    reference_photos: List[str] = []
    budget_min: Optional[int] = Field(None, ge=0)
    budget_max: Optional[int] = Field(None, ge=0)
    preferred_appointment: Optional[datetime] = None
    urgency_level: str = Field(default="normal", pattern="^(low|normal|high|urgent)$")


class TuningRequestResponse(BaseModel):
    id: int
    request_number: str
    customer_id: int
    tuner_id: Optional[int] = None
    service_id: Optional[int] = None
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    vehicle_engine: Optional[str] = None
    vehicle_mileage: Optional[int] = None
    requested_modifications: str
    desired_outcomes: Optional[str] = None
    customer_notes: Optional[str] = None
    reference_photos: List[str] = []
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    preferred_appointment: Optional[datetime] = None
    urgency_level: str
    status: str
    assigned_at: Optional[datetime] = None
    required_parts: List[dict] = []
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TuningRequestListResponse(BaseModel):
    requests: List[TuningRequestResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Tuning Project Schemas
class ProjectEstimateLineItem(BaseModel):
    category: str
    description: str
    labor_hours: Optional[float] = Field(None, ge=0)
    labor_rate: Optional[int] = Field(None, ge=0)
    parts: List[dict] = []  # [{name, quantity, unit_price}]
    total: int = Field(..., ge=0)


class ProjectEstimateCreate(BaseModel):
    line_items: List[ProjectEstimateLineItem] = Field(..., min_length=1)
    estimated_duration: Optional[int] = Field(None, gt=0)  # en heures
    notes: Optional[str] = None
    terms_conditions: Optional[str] = None


class ProjectEstimateResponse(BaseModel):
    id: int
    estimate_number: str
    project_id: int
    status: EstimateStatus
    version: int
    line_items: List[ProjectEstimateLineItem]
    parts_subtotal: int
    labor_subtotal: int
    other_fees: int
    tax_amount: int
    total_estimate: int
    estimated_duration: Optional[int] = None
    notes: Optional[str] = None
    terms_conditions: Optional[str] = None
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    revision_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TuningProjectCreate(BaseModel):
    request_id: int
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: TuningCategory
    estimated_budget: Optional[int] = Field(None, ge=0)


class TuningProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    estimated_budget: Optional[int] = Field(None, ge=0)
    final_budget: Optional[int] = Field(None, ge=0)
    work_description: Optional[str] = None
    parts_used: Optional[List[dict]] = None
    labor_hours: Optional[float] = Field(None, ge=0)
    quality_check_passed: Optional[bool] = None
    quality_check_notes: Optional[str] = None
    handover_notes: Optional[str] = None


class TuningProjectResponse(BaseModel):
    id: int
    project_number: str
    request_id: int
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    vehicle_engine: Optional[str] = None
    vehicle_mileage: Optional[int] = None
    title: str
    description: Optional[str] = None
    category: TuningCategory
    status: ProjectStatus
    status_history: List[dict] = []
    estimated_budget: Optional[int] = None
    final_budget: Optional[int] = None
    approved_amount: Optional[int] = None
    start_date: Optional[datetime] = None
    expected_completion: Optional[datetime] = None
    actual_completion: Optional[datetime] = None
    work_description: Optional[str] = None
    parts_used: List[dict] = []
    labor_hours: Optional[float] = None
    before_photos: List[str] = []
    after_photos: List[str] = []
    videos: List[str] = []
    quality_check_passed: bool
    quality_check_notes: Optional[str] = None
    handover_date: Optional[datetime] = None
    handover_notes: Optional[str] = None
    customer_satisfaction: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TuningProjectListResponse(BaseModel):
    projects: List[TuningProjectResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Appointment Schemas
class AppointmentCreate(BaseModel):
    request_id: Optional[int] = None
    project_id: Optional[int] = None
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    service_type: Optional[str] = None
    scheduled_date: datetime
    scheduled_time: datetime
    duration: int = Field(..., gt=0)  # en minutes
    location_type: str = Field(default="workshop", pattern="^(workshop|customer_location|mobile)$")
    location_address: Optional[str] = None
    customer_notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    service_type: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    scheduled_time: Optional[datetime] = None
    duration: Optional[int] = Field(None, gt=0)
    location_type: Optional[str] = None
    location_address: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    customer_notes: Optional[str] = None
    tuner_notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    appointment_number: str
    customer_id: int
    tuner_id: int
    request_id: Optional[int] = None
    project_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    service_type: Optional[str] = None
    scheduled_date: datetime
    scheduled_time: datetime
    duration: int
    end_time: Optional[datetime] = None
    location_type: str
    location_address: Optional[str] = None
    status: AppointmentStatus
    confirmation_code: Optional[str] = None
    customer_notes: Optional[str] = None
    tuner_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class AppointmentListResponse(BaseModel):
    appointments: List[AppointmentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Work Log Schemas
class WorkLogCreate(BaseModel):
    project_id: int
    work_date: datetime
    hours_worked: float = Field(..., gt=0)
    work_description: str = Field(..., min_length=10)
    parts_used: List[dict] = []
    progress_percent: Optional[int] = Field(None, ge=0, le=100)
    next_steps: Optional[str] = None
    photos: List[str] = []
    notes: Optional[str] = None


class WorkLogResponse(BaseModel):
    id: int
    project_id: int
    logged_by: int
    work_date: datetime
    hours_worked: float
    work_description: str
    parts_used: List[dict] = []
    progress_percent: Optional[int] = None
    next_steps: Optional[str] = None
    photos: List[str] = []
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Portfolio Schemas
class PortfolioEntryCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    vehicle_make: str = Field(..., min_length=1, max_length=100)
    vehicle_model: str = Field(..., min_length=1, max_length=100)
    vehicle_year: int = Field(..., ge=1900, le=2030)
    modification_categories: List[str] = []
    modifications_description: Optional[str] = None
    performance_gains: Optional[dict] = None
    dyno_results: Optional[dict] = None
    before_photos: List[str] = []
    after_photos: List[str] = []
    videos: List[str] = []
    parts_used: List[dict] = []
    work_description: Optional[str] = None
    labor_hours: Optional[float] = Field(None, ge=0)
    publication_status: str = Field(default="draft", pattern="^(draft|published|archived)$")
    featured: bool = False
    customer_consent: bool = False


class PortfolioEntryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    modification_categories: Optional[List[str]] = None
    modifications_description: Optional[str] = None
    performance_gains: Optional[dict] = None
    dyno_results: Optional[dict] = None
    before_photos: Optional[List[str]] = None
    after_photos: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    parts_used: Optional[List[dict]] = None
    work_description: Optional[str] = None
    labor_hours: Optional[float] = Field(None, ge=0)
    publication_status: Optional[str] = None
    featured: Optional[bool] = None
    customer_consent: Optional[bool] = None


class PortfolioEntryResponse(BaseModel):
    id: int
    project_id: int
    tuner_id: int
    title: str
    slug: str
    description: Optional[str] = None
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    modification_categories: List[str] = []
    modifications_description: Optional[str] = None
    performance_gains: Optional[dict] = None
    dyno_results: Optional[dict] = None
    before_photos: List[str] = []
    after_photos: List[str] = []
    videos: List[str] = []
    parts_used: List[dict] = []
    work_description: Optional[str] = None
    labor_hours: Optional[float] = None
    publication_status: str
    published_at: Optional[datetime] = None
    featured: bool
    customer_consent: bool
    consent_date: Optional[datetime] = None
    views_count: int
    likes_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PortfolioListResponse(BaseModel):
    entries: List[PortfolioEntryResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Invoice Schemas
class InvoiceLineItem(BaseModel):
    description: str
    quantity: int = Field(..., gt=0)
    unit_price: int = Field(..., ge=0)
    total: int = Field(..., ge=0)


class InvoiceCreate(BaseModel):
    project_id: Optional[int] = None
    issue_date: datetime
    due_date: Optional[datetime] = None
    line_items: List[InvoiceLineItem] = Field(..., min_length=1)
    tax_rate: float = Field(default=20.0, ge=0, le=100)
    discount_amount: int = Field(default=0, ge=0)
    notes: Optional[str] = None
    terms: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    customer_id: int
    tuner_id: int
    project_id: Optional[int] = None
    issue_date: datetime
    due_date: Optional[datetime] = None
    line_items: List[InvoiceLineItem]
    subtotal: int
    tax_rate: float
    tax_amount: int
    discount_amount: int
    total: int
    status: str
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    paid_at: Optional[datetime] = None
    notes: Optional[str] = None
    terms: Optional[str] = None
    pdf_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class InvoiceListResponse(BaseModel):
    invoices: List[InvoiceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Analytics Schemas
class TunerAnalytics(BaseModel):
    period: str  # daily, weekly, monthly, yearly
    start_date: datetime
    end_date: datetime
    total_projects: int
    completed_projects: int
    total_revenue: int
    labor_revenue: int
    parts_revenue: int
    total_commissions: int
    net_revenue: int
    average_project_value: float
    projects_by_category: dict
    revenue_by_month: List[dict]


class TunerDashboardStats(BaseModel):
    new_requests: int
    active_projects: int
    completed_projects: int
    upcoming_appointments: int
    total_revenue: int
    customer_satisfaction: float
    pending_estimates: int
    awaiting_approval: int
    available_balance: int
    pending_payouts: int


# Settings Schemas
class TunerSettings(BaseModel):
    workshop_name: Optional[str] = None
    workshop_description: Optional[str] = None
    workshop_logo: Optional[str] = None
    workshop_banner: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    service_area: Optional[dict] = None
    working_hours: Optional[dict] = None
    notification_preferences: Optional[dict] = None


class TunerSettingsUpdate(BaseModel):
    workshop_name: Optional[str] = Field(None, max_length=255)
    workshop_description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    service_area: Optional[dict] = None
    working_hours: Optional[dict] = None
    notification_preferences: Optional[dict] = None
