"""
API endpoints for Phase 2: Recurring Plans & Invoices
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import calendar

from app.database import get_db
from app.models.phase2 import RecurringPlan, Invoice
from app.schemas.phase2 import (
    RecurringPlanCreate,
    RecurringPlanUpdate,
    RecurringPlanResponse,
    InvoiceCreate,
    InvoiceUpdate,
    InvoiceResponse,
    InvoiceItem,
)

router = APIRouter()


# ============ Recurring Plans ============

@router.post("/recurring-plans", response_model=RecurringPlanResponse, status_code=status.HTTP_201_CREATED)
def create_recurring_plan(
    plan: RecurringPlanCreate,
    customer_id: int,
    db: Session = Depends(get_db)
):
    """Create a recurring maintenance plan"""
    db_plan = RecurringPlan(
        customer_id=customer_id,
        vehicle_id=plan.vehicle_id,
        name=plan.name,
        service_type=plan.service_type,
        frequency=plan.frequency,
        next_service_date=plan.next_service_date,
        next_service_mileage=plan.next_service_mileage,
        price_per_service=plan.price_per_service,
        discount_percent=plan.discount_percent,
        is_active=True
    )
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    
    return db_plan


@router.get("/recurring-plans/{plan_id}", response_model=RecurringPlanResponse)
def get_recurring_plan(plan_id: int, db: Session = Depends(get_db)):
    """Get recurring plan by ID"""
    plan = db.query(RecurringPlan).filter(RecurringPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Recurring plan not found")
    return plan


@router.get("/recurring-plans/customer/{customer_id}", response_model=List[RecurringPlanResponse])
def get_customer_recurring_plans(customer_id: int, db: Session = Depends(get_db)):
    """Get all recurring plans for a customer"""
    plans = db.query(RecurringPlan).filter(
        RecurringPlan.customer_id == customer_id
    ).order_by(RecurringPlan.next_service_date.asc()).all()
    return plans


@router.get("/recurring-plans/customer/{customer_id}/upcoming", response_model=List[RecurringPlanResponse])
def get_upcoming_recurring_plans(
    customer_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get upcoming recurring plans within next X days"""
    upcoming_date = datetime.utcnow() + timedelta(days=days)
    
    plans = db.query(RecurringPlan).filter(
        RecurringPlan.customer_id == customer_id,
        RecurringPlan.is_active == True,
        RecurringPlan.next_service_date <= upcoming_date
    ).order_by(RecurringPlan.next_service_date.asc()).all()
    
    return plans


@router.put("/recurring-plans/{plan_id}", response_model=RecurringPlanResponse)
def update_recurring_plan(
    plan_id: int,
    update: RecurringPlanUpdate,
    db: Session = Depends(get_db)
):
    """Update recurring plan"""
    plan = db.query(RecurringPlan).filter(RecurringPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Recurring plan not found")
    
    for key, value in update.dict(exclude_unset=True).items():
        setattr(plan, key, value)
    
    db.commit()
    db.refresh(plan)
    return plan


@router.post("/recurring-plans/{plan_id}/complete-service")
def complete_recurring_service(
    plan_id: int,
    service_mileage: int,
    db: Session = Depends(get_db)
):
    """Mark a recurring service as completed and schedule next"""
    plan = db.query(RecurringPlan).filter(RecurringPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Recurring plan not found")
    
    # Update last service info
    plan.last_service_date = datetime.utcnow()
    plan.last_service_mileage = service_mileage
    
    # Calculate next service date based on frequency
    frequency_map = {
        "weekly": timedelta(weeks=1),
        "biweekly": timedelta(weeks=2),
        "monthly": timedelta(days=30),
        "quarterly": timedelta(days=90),
        "yearly": timedelta(days=365),
    }
    
    interval = frequency_map.get(plan.frequency, timedelta(days=30))
    plan.next_service_date = datetime.utcnow() + interval
    
    # Calculate next service mileage if needed
    if plan.next_service_mileage:
        # Assume average 1000 km per month for calculation
        km_per_interval = {
            "weekly": 250,
            "biweekly": 500,
            "monthly": 1000,
            "quarterly": 3000,
            "yearly": 12000,
        }
        km_interval = km_per_interval.get(plan.frequency, 1000)
        plan.next_service_mileage = service_mileage + km_interval
    
    db.commit()
    db.refresh(plan)
    
    return {
        "message": "Service completed, next service scheduled",
        "next_service_date": plan.next_service_date,
        "next_service_mileage": plan.next_service_mileage
    }


# ============ Invoices ============

def generate_invoice_number(customer_id: int, db: Session) -> str:
    """Generate unique invoice number"""
    year = datetime.utcnow().year
    month = datetime.utcnow().month
    
    # Count invoices this month
    count = db.query(Invoice).filter(
        Invoice.customer_id == customer_id,
        Invoice.invoice_number.like(f'INV-{year}{month}-%')
    ).count()
    
    return f"INV-{year}{month}-{count + 1:04d}"


@router.post("/invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice: InvoiceCreate,
    customer_id: int,
    db: Session = Depends(get_db)
):
    """Create an invoice for a customer"""
    invoice_number = generate_invoice_number(customer_id, db)
    
    db_invoice = Invoice(
        customer_id=customer_id,
        invoice_number=invoice_number,
        period_start=invoice.period_start,
        period_end=invoice.period_end,
        items=[item.dict() for item in invoice.items],
        subtotal=invoice.subtotal,
        tax_amount=invoice.tax_amount,
        total=invoice.total,
        due_date=invoice.due_date,
        status="draft"
    )
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Get invoice by ID"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.get("/invoices/customer/{customer_id}", response_model=List[InvoiceResponse])
def get_customer_invoices(customer_id: int, db: Session = Depends(get_db)):
    """Get all invoices for a customer"""
    invoices = db.query(Invoice).filter(
        Invoice.customer_id == customer_id
    ).order_by(Invoice.created_at.desc()).all()
    return invoices


@router.get("/invoices/customer/{customer_id}/pending", response_model=List[InvoiceResponse])
def get_pending_invoices(customer_id: int, db: Session = Depends(get_db)):
    """Get pending/overdue invoices for a customer"""
    invoices = db.query(Invoice).filter(
        Invoice.customer_id == customer_id,
        Invoice.status.in_(["sent", "overdue"])
    ).order_by(Invoice.due_date.asc()).all()
    return invoices


@router.put("/invoices/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: int,
    update: InvoiceUpdate,
    db: Session = Depends(get_db)
):
    """Update invoice"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    for key, value in update.dict(exclude_unset=True).items():
        setattr(invoice, key, value)
    
    db.commit()
    db.refresh(invoice)
    return invoice


@router.post("/invoices/{invoice_id}/send")
def send_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Mark invoice as sent"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    if invoice.status != "draft":
        raise HTTPException(status_code=400, detail="Invoice already sent")
    
    invoice.status = "sent"
    
    # Set due date if not set (30 days from now)
    if not invoice.due_date:
        invoice.due_date = datetime.utcnow() + timedelta(days=30)
    
    db.commit()
    db.refresh(invoice)
    
    # In production: Send email with PDF attachment
    return {"message": "Invoice sent", "invoice_id": invoice_id}


@router.post("/invoices/{invoice_id}/mark-paid")
def mark_invoice_paid(invoice_id: int, db: Session = Depends(get_db)):
    """Mark invoice as paid"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.status = "paid"
    invoice.paid_at = datetime.utcnow()
    
    db.commit()
    db.refresh(invoice)
    
    return {"message": "Invoice marked as paid", "invoice_id": invoice_id}


@router.get("/invoices/{invoice_id}/pdf")
def download_invoice_pdf(invoice_id: int, db: Session = Depends(get_db)):
    """Download invoice as PDF"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # In production: Generate PDF
    # For demo: Return mock URL
    return {
        "pdf_url": f"/api/v1/invoices/{invoice_id}/pdf/download",
        "filename": f"{invoice.invoice_number}.pdf"
    }


@router.get("/invoices/{invoice_id}/csv")
def download_invoice_csv(invoice_id: int, db: Session = Depends(get_db)):
    """Download invoice as CSV"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # In production: Generate CSV
    # For demo: Return mock URL
    return {
        "csv_url": f"/api/v1/invoices/{invoice_id}/csv/download",
        "filename": f"{invoice.invoice_number}.csv"
    }


@router.post("/invoices/generate-monthly/{customer_id}")
def generate_monthly_invoice(
    customer_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db)
):
    """Generate monthly invoice for a customer (for fleets)"""
    # Get all jobs for this customer in the specified month
    # In production: Query jobs table
    # For demo: Create mock invoice
    
    period_start = datetime(year, month, 1)
    _, last_day = calendar.monthrange(year, month)
    period_end = datetime(year, month, last_day, 23, 59, 59)
    
    # Mock items
    items = [
        InvoiceItem(description="Oil change - Vehicle 1", quantity=1, unit_price=30000, total=30000),
        InvoiceItem(description="Brake pads - Vehicle 2", quantity=2, unit_price=25000, total=50000),
    ]
    
    subtotal = sum(item.total for item in items)
    tax_amount = int(subtotal * 0.20)  # 20% VAT
    total = subtotal + tax_amount
    
    invoice_data = InvoiceCreate(
        period_start=period_start,
        period_end=period_end,
        items=items,
        subtotal=subtotal,
        tax_amount=tax_amount,
        total=total,
        due_date=datetime.utcnow() + timedelta(days=30)
    )
    
    return create_invoice(invoice_data, customer_id, db)
