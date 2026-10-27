"""
API endpoints for Phase 2: Urgent Requests (Two-wheelers & Pros)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.phase2 import UrgentRequest
from app.schemas.phase2 import (
    UrgentRequestCreate,
    UrgentRequestUpdate,
    UrgentRequestResponse,
)

router = APIRouter()


@router.post("/urgent-requests", response_model=UrgentRequestResponse, status_code=status.HTTP_201_CREATED)
def create_urgent_request(
    request: UrgentRequestCreate,
    customer_id: int,
    db: Session = Depends(get_db)
):
    """Create an urgent request for two-wheelers or pros"""
    # Calculate expiry (30 minutes for urgent requests)
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    
    db_request = UrgentRequest(
        customer_id=customer_id,
        vehicle_id=request.vehicle_id,
        issue_type=request.issue_type,
        description=request.description,
        photos=request.photos,
        lat=request.lat,
        lng=request.lng,
        address=request.address,
        customer_price=request.customer_price,
        downtime_cost_per_hour=request.downtime_cost_per_hour,
        estimated_downtime_hours=request.estimated_downtime_hours,
        expires_at=expires_at,
        status="open"
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request


@router.get("/urgent-requests/{request_id}", response_model=UrgentRequestResponse)
def get_urgent_request(request_id: int, db: Session = Depends(get_db)):
    """Get urgent request by ID"""
    request = db.query(UrgentRequest).filter(UrgentRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Urgent request not found")
    return request


@router.get("/urgent-requests/customer/{customer_id}", response_model=List[UrgentRequestResponse])
def get_customer_urgent_requests(customer_id: int, db: Session = Depends(get_db)):
    """Get all urgent requests for a customer"""
    requests = db.query(UrgentRequest).filter(
        UrgentRequest.customer_id == customer_id
    ).order_by(UrgentRequest.created_at.desc()).all()
    return requests


@router.get("/urgent-requests/nearby", response_model=List[UrgentRequestResponse])
def get_nearby_urgent_requests(
    lat: float,
    lng: float,
    radius_km: float = 10.0,
    db: Session = Depends(get_db)
):
    """Get urgent requests near a location (for mechanics)"""
    # Simple distance calculation (should use PostGIS in production)
    # This is a simplified version - in production use PostGIS
    requests = db.query(UrgentRequest).filter(
        UrgentRequest.status == "open",
        UrgentRequest.lat.between(lat - 0.1, lat + 0.1),  # Rough approximation
        UrgentRequest.lng.between(lng - 0.1, lng + 0.1),
    ).all()
    
    # Filter by actual distance if needed
    return requests


@router.put("/urgent-requests/{request_id}", response_model=UrgentRequestResponse)
def update_urgent_request(
    request_id: int,
    update: UrgentRequestUpdate,
    db: Session = Depends(get_db)
):
    """Update urgent request status"""
    request = db.query(UrgentRequest).filter(UrgentRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Urgent request not found")
    
    for key, value in update.dict(exclude_unset=True).items():
        setattr(request, key, value)
    
    db.commit()
    db.refresh(request)
    return request


@router.post("/urgent-requests/{request_id}/accept")
def accept_urgent_request(
    request_id: int,
    mechanic_id: int,
    agreed_price: int,
    db: Session = Depends(get_db)
):
    """Mechanic accepts an urgent request"""
    request = db.query(UrgentRequest).filter(UrgentRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Urgent request not found")
    
    if request.status != "open":
        raise HTTPException(status_code=400, detail="Request is not open")
    
    request.status = "accepted"
    request.assigned_mechanic_id = mechanic_id
    request.agreed_price = agreed_price
    
    db.commit()
    db.refresh(request)
    
    return {"message": "Request accepted", "request_id": request_id}


@router.post("/urgent-requests/{request_id}/complete")
def complete_urgent_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """Mark urgent request as completed"""
    request = db.query(UrgentRequest).filter(UrgentRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Urgent request not found")
    
    if request.status not in ["accepted", "in_progress"]:
        raise HTTPException(status_code=400, detail="Request cannot be completed")
    
    request.status = "completed"
    request.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(request)
    
    return {"message": "Request completed", "request_id": request_id}


@router.get("/urgent-requests/mechanic/{mechanic_id}/active", response_model=List[UrgentRequestResponse])
def get_mechanic_active_urgent_requests(mechanic_id: int, db: Session = Depends(get_db)):
    """Get active urgent requests assigned to a mechanic"""
    requests = db.query(UrgentRequest).filter(
        UrgentRequest.assigned_mechanic_id == mechanic_id,
        UrgentRequest.status.in_(["accepted", "in_progress"])
    ).all()
    return requests
