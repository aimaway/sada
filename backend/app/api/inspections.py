"""
API endpoints for Phase 2: Pre-purchase Inspections
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets
import string

from app.database import get_db
from app.models.phase2 import InspectionRequest
from app.schemas.phase2 import (
    InspectionRequestCreate,
    InspectionRequestUpdate,
    InspectionRequestResponse,
    InspectionReportPublic,
)

router = APIRouter()


def generate_public_slug():
    """Generate a unique public slug for inspection reports"""
    return ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(12))


@router.post("/inspections", response_model=InspectionRequestResponse, status_code=status.HTTP_201_CREATED)
def create_inspection_request(
    request: InspectionRequestCreate,
    buyer_id: int,
    db: Session = Depends(get_db)
):
    """Create a pre-purchase inspection request"""
    db_inspection = InspectionRequest(
        buyer_id=buyer_id,
        vehicle_make=request.vehicle_make,
        vehicle_model=request.vehicle_model,
        vehicle_year=request.vehicle_year,
        vehicle_vin=request.vehicle_vin,
        vehicle_mileage=request.vehicle_mileage,
        vehicle_location=request.vehicle_location,
        inspection_date=request.inspection_date,
        inspection_address=request.inspection_address,
        inspection_fee=request.inspection_fee,
        public_slug=generate_public_slug(),
        status="pending"
    )
    
    db.add(db_inspection)
    db.commit()
    db.refresh(db_inspection)
    
    return db_inspection


@router.get("/inspections/{inspection_id}", response_model=InspectionRequestResponse)
def get_inspection_request(inspection_id: int, db: Session = Depends(get_db)):
    """Get inspection request by ID"""
    inspection = db.query(InspectionRequest).filter(InspectionRequest.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection request not found")
    return inspection


@router.get("/inspections/buyer/{buyer_id}", response_model=List[InspectionRequestResponse])
def get_buyer_inspections(buyer_id: int, db: Session = Depends(get_db)):
    """Get all inspection requests for a buyer"""
    inspections = db.query(InspectionRequest).filter(
        InspectionRequest.buyer_id == buyer_id
    ).order_by(InspectionRequest.created_at.desc()).all()
    return inspections


@router.put("/inspections/{inspection_id}", response_model=InspectionRequestResponse)
def update_inspection_request(
    inspection_id: int,
    update: InspectionRequestUpdate,
    db: Session = Depends(get_db)
):
    """Update inspection request (inspector fills checklist)"""
    inspection = db.query(InspectionRequest).filter(InspectionRequest.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection request not found")
    
    for key, value in update.dict(exclude_unset=True).items():
        setattr(inspection, key, value)
    
    # Auto-generate report URL when completed
    if update.status == "completed" and not inspection.report_url:
        inspection.report_url = f"/inspection-report/{inspection.public_slug}"
    
    db.commit()
    db.refresh(inspection)
    return inspection


@router.get("/inspection-report/{slug}", response_model=InspectionReportPublic)
def get_public_inspection_report(slug: str, db: Session = Depends(get_db)):
    """Get public inspection report by slug (no auth required)"""
    inspection = db.query(InspectionRequest).filter(
        InspectionRequest.public_slug == slug,
        InspectionRequest.status == "completed"
    ).first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return inspection


@router.post("/inspections/{inspection_id}/submit-checklist")
def submit_inspection_checklist(
    inspection_id: int,
    checklist_data: dict,
    repair_cost_estimate: int,
    negotiation_min: int,
    negotiation_max: int,
    verdict: str,
    verdict_explanation: str,
    photos: List[str],
    db: Session = Depends(get_db)
):
    """Inspector submits completed checklist and verdict"""
    inspection = db.query(InspectionRequest).filter(InspectionRequest.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection request not found")
    
    if inspection.status not in ["scheduled", "in_progress"]:
        raise HTTPException(status_code=400, detail="Inspection is not in progress")
    
    inspection.checklist_data = checklist_data
    inspection.repair_cost_estimate = repair_cost_estimate
    inspection.negotiation_price_range_min = negotiation_min
    inspection.negotiation_price_range_max = negotiation_max
    inspection.verdict = verdict
    inspection.verdict_explanation = verdict_explanation
    inspection.photos = photos
    inspection.status = "completed"
    inspection.report_url = f"/inspection-report/{inspection.public_slug}"
    
    db.commit()
    db.refresh(inspection)
    
    return {
        "message": "Inspection completed",
        "report_url": inspection.report_url,
        "verdict": verdict
    }


@router.get("/inspections/{inspection_id}/pdf")
def download_inspection_pdf(inspection_id: int, db: Session = Depends(get_db)):
    """Download inspection report as PDF"""
    inspection = db.query(InspectionRequest).filter(InspectionRequest.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection request not found")
    
    if inspection.status != "completed":
        raise HTTPException(status_code=400, detail="Inspection not completed yet")
    
    # In production, generate PDF here
    # For now, return a mock URL
    return {
        "pdf_url": f"/api/v1/inspections/{inspection_id}/pdf/download",
        "filename": f"inspection_{inspection.public_slug}.pdf"
    }


@router.get("/inspections/nearby/{lat}/{lng}", response_model=List[InspectionRequestResponse])
def get_nearby_inspections(
    lat: float,
    lng: float,
    radius_km: float = 20.0,
    db: Session = Depends(get_db)
):
    """Get inspection requests near a location (for inspectors)"""
    # Simplified - in production use PostGIS
    inspections = db.query(InspectionRequest).filter(
        InspectionRequest.status.in_(["pending", "scheduled"])
    ).all()
    
    return inspections


@router.post("/inspections/{inspection_id}/assign")
def assign_inspector(
    inspection_id: int,
    inspector_id: int,
    db: Session = Depends(get_db)
):
    """Assign an inspector to an inspection request"""
    inspection = db.query(InspectionRequest).filter(InspectionRequest.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection request not found")
    
    if inspection.status != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    
    inspection.assigned_inspector_id = inspector_id
    inspection.status = "scheduled"
    
    db.commit()
    db.refresh(inspection)
    
    return {"message": "Inspector assigned", "inspection_id": inspection_id}
