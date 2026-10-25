"""
Pydantic schemas for Phase 2: New Customer Segments
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ============ Enums ============

class InspectionVerdict(str, Enum):
    BUY = "buy"
    NEGOTIATE = "negotiate"
    AVOID = "avoid"


class OnBehalfStatus(str, Enum):
    PENDING = "pending"
    LOCATION_SHARED = "location_shared"
    QUOTE_APPROVED = "quote_approved"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RecurringPlanFrequency(str, Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


# ============ Urgent Request Schemas ============

class UrgentRequestBase(BaseModel):
    vehicle_id: int
    issue_type: str = Field(..., pattern="^(puncture|chain|brakes|battery|other)$")
    description: str = Field(..., min_length=10, max_length=1000)
    photos: Optional[List[str]] = None
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    address: Optional[str] = None
    customer_price: int = Field(..., gt=0)  # in centimes
    
    # For pros
    downtime_cost_per_hour: Optional[int] = None
    estimated_downtime_hours: Optional[float] = None


class UrgentRequestCreate(UrgentRequestBase):
    pass


class UrgentRequestUpdate(BaseModel):
    status: Optional[str] = None
    assigned_mechanic_id: Optional[int] = None
    agreed_price: Optional[int] = None
    completed_at: Optional[datetime] = None


class UrgentRequestResponse(UrgentRequestBase):
    id: int
    customer_id: int
    status: str
    assigned_mechanic_id: Optional[int] = None
    agreed_price: Optional[int] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============ Recurring Plan Schemas ============

class RecurringPlanBase(BaseModel):
    vehicle_id: int
    name: str = Field(..., min_length=1, max_length=100)
    service_type: str = Field(..., pattern="^(oil_change|brake_check|tire_rotation|battery_check|full_inspection)$")
    frequency: str = Field(..., pattern="^(weekly|biweekly|monthly|quarterly|yearly)$")
    next_service_date: datetime
    next_service_mileage: Optional[int] = None
    price_per_service: int = Field(..., gt=0)
    discount_percent: int = Field(default=0, ge=0, le=100)


class RecurringPlanCreate(RecurringPlanBase):
    pass


class RecurringPlanUpdate(BaseModel):
    name: Optional[str] = None
    frequency: Optional[str] = None
    next_service_date: Optional[datetime] = None
    next_service_mileage: Optional[int] = None
    price_per_service: Optional[int] = None
    discount_percent: Optional[int] = None
    is_active: Optional[bool] = None
    last_service_date: Optional[datetime] = None
    last_service_mileage: Optional[int] = None


class RecurringPlanResponse(RecurringPlanBase):
    id: int
    customer_id: int
    is_active: bool
    last_service_date: Optional[datetime] = None
    last_service_mileage: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============ Inspection Request Schemas ============

class ChecklistItem(BaseModel):
    status: str = Field(..., pattern="^(good|fair|poor|critical)$")
    notes: Optional[str] = None
    photos: Optional[List[str]] = None


class InspectionChecklist(BaseModel):
    engine: Optional[ChecklistItem] = None
    gearbox: Optional[ChecklistItem] = None
    chassis: Optional[ChecklistItem] = None
    electrics: Optional[ChecklistItem] = None
    paint_accident: Optional[ChecklistItem] = None
    obd_scan: Optional[ChecklistItem] = None


class InspectionRequestBase(BaseModel):
    vehicle_make: str = Field(..., min_length=1, max_length=50)
    vehicle_model: str = Field(..., min_length=1, max_length=50)
    vehicle_year: int = Field(..., ge=1900, le=2030)
    vehicle_vin: Optional[str] = Field(None, min_length=17, max_length=17)
    vehicle_mileage: Optional[int] = None
    vehicle_location: Optional[str] = None
    inspection_date: datetime
    inspection_address: str = Field(..., min_length=5, max_length=500)
    inspection_fee: int = Field(..., gt=0)


class InspectionRequestCreate(InspectionRequestBase):
    pass


class InspectionRequestUpdate(BaseModel):
    checklist_data: Optional[dict] = None
    repair_cost_estimate: Optional[int] = None
    negotiation_price_range_min: Optional[int] = None
    negotiation_price_range_max: Optional[int] = None
    verdict: Optional[str] = None
    verdict_explanation: Optional[str] = None
    photos: Optional[List[str]] = None
    obd_scan_data: Optional[dict] = None
    status: Optional[str] = None
    assigned_inspector_id: Optional[int] = None


class InspectionRequestResponse(InspectionRequestBase):
    id: int
    buyer_id: int
    checklist_data: Optional[dict] = None
    repair_cost_estimate: Optional[int] = None
    negotiation_price_range_min: Optional[int] = None
    negotiation_price_range_max: Optional[int] = None
    verdict: Optional[str] = None
    verdict_explanation: Optional[str] = None
    photos: Optional[List[str]] = None
    obd_scan_data: Optional[dict] = None
    report_url: Optional[str] = None
    report_pdf_url: Optional[str] = None
    public_slug: Optional[str] = None
    status: str
    assigned_inspector_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class InspectionReportPublic(BaseModel):
    """Public view of inspection report"""
    id: int
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    vehicle_mileage: Optional[int] = None
    inspection_date: datetime
    checklist_data: Optional[dict] = None
    repair_cost_estimate: Optional[int] = None
    negotiation_price_range_min: Optional[int] = None
    negotiation_price_range_max: Optional[int] = None
    verdict: Optional[str] = None
    verdict_explanation: Optional[str] = None
    photos: Optional[List[str]] = None
    
    class Config:
        from_attributes = True


# ============ On-behalf Request Schemas ============

class OnBehalfRequestBase(BaseModel):
    beneficiary_name: str = Field(..., min_length=1, max_length=100)
    beneficiary_phone: str = Field(..., min_length=10, max_length=20)
    beneficiary_email: Optional[str] = None
    
    # Vehicle info
    vehicle_id: Optional[int] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_year: Optional[int] = None
    vehicle_plate: Optional[str] = None
    
    # Request details
    service_type: str = Field(..., min_length=1, max_length=50)
    description: str = Field(..., min_length=10, max_length=1000)
    photos: Optional[List[str]] = None
    
    # Location
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None


class OnBehalfRequestCreate(OnBehalfRequestBase):
    pass


class OnBehalfRequestUpdate(BaseModel):
    beneficiary_location_shared: Optional[bool] = None
    beneficiary_location_lat: Optional[float] = None
    beneficiary_location_lng: Optional[float] = None
    beneficiary_quote_approved: Optional[bool] = None
    approved_price: Optional[int] = None
    status: Optional[str] = None
    assigned_mechanic_id: Optional[int] = None
    agreed_price: Optional[int] = None


class OnBehalfRequestResponse(OnBehalfRequestBase):
    id: int
    payer_id: int
    beneficiary_location_shared: bool
    beneficiary_location_lat: Optional[float] = None
    beneficiary_location_lng: Optional[float] = None
    beneficiary_quote_approved: bool
    approved_price: Optional[int] = None
    share_token: Optional[str] = None
    share_url: Optional[str] = None
    status: str
    assigned_mechanic_id: Optional[int] = None
    agreed_price: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class BeneficiaryAction(BaseModel):
    """Actions taken by beneficiary via share link"""
    action: str = Field(..., pattern="^(share_location|approve_quote|reject_quote)$")
    lat: Optional[float] = None
    lng: Optional[float] = None
    approved_price: Optional[int] = None


# ============ Mechanic Public Profile Schemas ============

class MechanicPublicProfileBase(BaseModel):
    slug: str = Field(..., min_length=3, max_length=100, pattern="^[a-z0-9-]+$")
    bio: Optional[str] = Field(None, max_length=1000)
    specialties: Optional[List[str]] = None
    gallery_photos: Optional[List[str]] = None
    video_urls: Optional[List[str]] = None
    is_public: bool = True
    is_featured: bool = False


class MechanicPublicProfileCreate(MechanicPublicProfileBase):
    pass


class MechanicPublicProfileUpdate(BaseModel):
    bio: Optional[str] = None
    specialties: Optional[List[str]] = None
    gallery_photos: Optional[List[str]] = None
    video_urls: Optional[List[str]] = None
    is_public: Optional[bool] = None
    is_featured: Optional[bool] = None


class MechanicPublicProfileResponse(MechanicPublicProfileBase):
    id: int
    mechanic_id: int
    total_views: int
    total_bookings: int
    referral_code: Optional[str] = None
    referral_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class MechanicPublicPage(BaseModel):
    """Public view of mechanic profile"""
    slug: str
    bio: Optional[str] = None
    specialties: Optional[List[str]] = None
    gallery_photos: Optional[List[str]] = None
    video_urls: Optional[List[str]] = None
    rating_avg: float
    jobs_completed: int
    years_experience: int
    verified: bool
    
    class Config:
        from_attributes = True


# ============ Visibility Stats Schemas ============

class MechanicVisibilityStatsResponse(BaseModel):
    id: int
    mechanic_id: int
    date: datetime
    profile_views: int
    request_views: int
    offers_sent: int
    offers_accepted: int
    jobs_completed: int
    total_earned: int
    commission_paid: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class MechanicDashboard(BaseModel):
    """Aggregated dashboard for mechanic"""
    total_profile_views: int
    total_request_views: int
    total_offers_sent: int
    total_offers_accepted: int
    total_jobs_completed: int
    total_earned: int
    total_commission_paid: int
    acceptance_rate: float
    average_rating: float
    response_time_avg: float  # in minutes


# ============ Invoice Schemas ============

class InvoiceItem(BaseModel):
    description: str
    quantity: int
    unit_price: int  # in centimes
    total: int


class InvoiceBase(BaseModel):
    period_start: datetime
    period_end: datetime
    items: List[InvoiceItem]
    subtotal: int
    tax_amount: int = 0
    total: int
    due_date: Optional[datetime] = None


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceUpdate(BaseModel):
    status: Optional[str] = None
    paid_at: Optional[datetime] = None
    pdf_url: Optional[str] = None
    csv_url: Optional[str] = None


class InvoiceResponse(InvoiceBase):
    id: int
    customer_id: int
    invoice_number: str
    status: str
    paid_at: Optional[datetime] = None
    pdf_url: Optional[str] = None
    csv_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
