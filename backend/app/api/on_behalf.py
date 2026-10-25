"""
API endpoints for Phase 2: On-behalf Requests (Request for someone else)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import secrets
import string

from app.database import get_db
from app.models.phase2 import OnBehalfRequest
from app.schemas.phase2 import (
    OnBehalfRequestCreate,
    OnBehalfRequestUpdate,
    OnBehalfRequestResponse,
    BeneficiaryAction,
)

router = APIRouter()


def generate_share_token():
    """Generate a unique share token for beneficiary access"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))


@router.post("/on-behalf", response_model=OnBehalfRequestResponse, status_code=status.HTTP_201_CREATED)
def create_on_behalf_request(
    request: OnBehalfRequestCreate,
    payer_id: int,
    db: Session = Depends(get_db)
):
    """Create a request on behalf of someone else"""
    share_token = generate_share_token()
    share_url = f"https://mecacasablanca.ma/on-behalf/{share_token}"
    
    db_request = OnBehalfRequest(
        payer_id=payer_id,
        beneficiary_name=request.beneficiary_name,
        beneficiary_phone=request.beneficiary_phone,
        beneficiary_email=request.beneficiary_email,
        vehicle_id=request.vehicle_id,
        vehicle_make=request.vehicle_make,
        vehicle_model=request.vehicle_model,
        vehicle_year=request.vehicle_year,
        vehicle_plate=request.vehicle_plate,
        service_type=request.service_type,
        description=request.description,
        photos=request.photos,
        lat=request.lat,
        lng=request.lng,
        address=request.address,
        share_token=share_token,
        share_url=share_url,
        status="pending"
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    # In production: Send WhatsApp/SMS to beneficiary with share_url
    # For demo: Return the URL
    return db_request


@router.get("/on-behalf/{request_id}", response_model=OnBehalfRequestResponse)
def get_on_behalf_request(request_id: int, db: Session = Depends(get_db)):
    """Get on-behalf request by ID"""
    request = db.query(OnBehalfRequest).filter(OnBehalfRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="On-behalf request not found")
    return request


@router.get("/on-behalf/payer/{payer_id}", response_model=List[OnBehalfRequestResponse])
def get_payer_on_behalf_requests(payer_id: int, db: Session = Depends(get_db)):
    """Get all on-behalf requests created by a payer"""
    requests = db.query(OnBehalfRequest).filter(
        OnBehalfRequest.payer_id == payer_id
    ).order_by(OnBehalfRequest.created_at.desc()).all()
    return requests


@router.get("/on-behalf/shared/{share_token}", response_model=OnBehalfRequestResponse)
def get_on_behalf_request_by_token(share_token: str, db: Session = Depends(get_db)):
    """Get on-behalf request by share token (beneficiary access)"""
    request = db.query(OnBehalfRequest).filter(
        OnBehalfRequest.share_token == share_token
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Share link not found or expired")
    return request


@router.post("/on-behalf/shared/{share_token}/action")
def beneficiary_action(
    share_token: str,
    action: BeneficiaryAction,
    db: Session = Depends(get_db)
):
    """Beneficiary performs an action via share link"""
    request = db.query(OnBehalfRequest).filter(
        OnBehalfRequest.share_token == share_token
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Share link not found")
    
    if action.action == "share_location":
        if action.lat is None or action.lng is None:
            raise HTTPException(status_code=400, detail="Location coordinates required")
        
        request.beneficiary_location_shared = True
        request.beneficiary_location_lat = action.lat
        request.beneficiary_location_lng = action.lng
        request.status = "location_shared"
        
        # Update request location if not set
        if not request.lat:
            request.lat = action.lat
            request.lng = action.lng
        
    elif action.action == "approve_quote":
        if action.approved_price is None:
            raise HTTPException(status_code=400, detail="Approved price required")
        
        request.beneficiary_quote_approved = True
        request.approved_price = action.approved_price
        request.status = "quote_approved"
        
    elif action.action == "reject_quote":
        request.status = "cancelled"
    
    db.commit()
    db.refresh(request)
    
    return {
        "message": f"Action '{action.action}' completed",
        "status": request.status
    }


@router.put("/on-behalf/{request_id}", response_model=OnBehalfRequestResponse)
def update_on_behalf_request(
    request_id: int,
    update: OnBehalfRequestUpdate,
    db: Session = Depends(get_db)
):
    """Update on-behalf request (by payer or mechanic)"""
    request = db.query(OnBehalfRequest).filter(OnBehalfRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="On-behalf request not found")
    
    for key, value in update.dict(exclude_unset=True).items():
        setattr(request, key, value)
    
    db.commit()
    db.refresh(request)
    return request


@router.post("/on-behalf/{request_id}/accept")
def accept_on_behalf_request(
    request_id: int,
    mechanic_id: int,
    agreed_price: int,
    db: Session = Depends(get_db)
):
    """Mechanic accepts an on-behalf request"""
    request = db.query(OnBehalfRequest).filter(OnBehalfRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="On-behalf request not found")
    
    if request.status not in ["pending", "location_shared", "quote_approved"]:
        raise HTTPException(status_code=400, detail="Request cannot be accepted")
    
    request.status = "in_progress"
    request.assigned_mechanic_id = mechanic_id
    request.agreed_price = agreed_price
    
    db.commit()
    db.refresh(request)
    
    # In production: Notify payer and beneficiary
    return {"message": "Request accepted", "request_id": request_id}


@router.post("/on-behalf/{request_id}/complete")
def complete_on_behalf_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """Mark on-behalf request as completed"""
    request = db.query(OnBehalfRequest).filter(OnBehalfRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="On-behalf request not found")
    
    if request.status != "in_progress":
        raise HTTPException(status_code=400, detail="Request is not in progress")
    
    request.status = "completed"
    
    db.commit()
    db.refresh(request)
    
    # In production: Charge payer, notify all parties
    return {"message": "Request completed", "request_id": request_id}


@router.get("/on-behalf/beneficiary/phone/{phone}", response_model=List[OnBehalfRequestResponse])
def get_beneficiary_requests_by_phone(phone: str, db: Session = Depends(get_db)):
    """Get all on-behalf requests where this phone is the beneficiary"""
    requests = db.query(OnBehalfRequest).filter(
        OnBehalfRequest.beneficiary_phone == phone
    ).order_by(OnBehalfRequest.created_at.desc()).all()
    return requests


@router.post("/on-behalf/{request_id}/send-notification")
def send_beneficiary_notification(
    request_id: int,
    notification_type: str,  # "location_request", "quote_ready", "mechanic_assigned"
    db: Session = Depends(get_db)
):
    """Send notification to beneficiary (WhatsApp/SMS)"""
    request = db.query(OnBehalfRequest).filter(OnBehalfRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="On-behalf request not found")
    
    # In production: Send actual WhatsApp/SMS
    # For demo: Return mock response
    message_templates = {
        "location_request": f"Hi {request.beneficiary_name}, please share your location for your car service request: {request.share_url}",
        "quote_ready": f"Hi {request.beneficiary_name}, a quote is ready for your approval: {request.share_url}",
        "mechanic_assigned": f"Hi {request.beneficiary_name}, a mechanic has been assigned to your request. Track here: {request.share_url}",
    }
    
    message = message_templates.get(notification_type, "Notification sent")
    
    return {
        "message": "Notification sent",
        "phone": request.beneficiary_phone,
        "message_preview": message[:100] + "..."
    }
