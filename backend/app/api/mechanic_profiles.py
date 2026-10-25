"""
API endpoints for Phase 2: Mechanic Public Profiles & Visibility
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
import secrets
import string

from app.database import get_db
from app.models.phase2 import MechanicPublicProfile, MechanicVisibilityStats
from app.schemas.phase2 import (
    MechanicPublicProfileCreate,
    MechanicPublicProfileUpdate,
    MechanicPublicProfileResponse,
    MechanicPublicPage,
    MechanicVisibilityStatsResponse,
    MechanicDashboard,
)

router = APIRouter()


def generate_referral_code():
    """Generate a unique referral code"""
    return 'MEC-' + ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))


@router.post("/mechanics/{mechanic_id}/public-profile", response_model=MechanicPublicProfileResponse, status_code=status.HTTP_201_CREATED)
def create_mechanic_public_profile(
    mechanic_id: int,
    profile: MechanicPublicProfileCreate,
    db: Session = Depends(get_db)
):
    """Create or update mechanic's public profile (creator page)"""
    # Check if profile already exists
    existing = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.mechanic_id == mechanic_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Public profile already exists")
    
    # Check if slug is unique
    slug_exists = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.slug == profile.slug
    ).first()
    if slug_exists:
        raise HTTPException(status_code=400, detail="Slug already taken")
    
    db_profile = MechanicPublicProfile(
        mechanic_id=mechanic_id,
        slug=profile.slug,
        bio=profile.bio,
        specialties=profile.specialties,
        gallery_photos=profile.gallery_photos,
        video_urls=profile.video_urls,
        referral_code=generate_referral_code(),
        is_public=profile.is_public,
        is_featured=profile.is_featured
    )
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    
    return db_profile


@router.get("/mechanics/{mechanic_id}/public-profile", response_model=MechanicPublicProfileResponse)
def get_mechanic_public_profile(mechanic_id: int, db: Session = Depends(get_db)):
    """Get mechanic's public profile"""
    profile = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.mechanic_id == mechanic_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Public profile not found")
    return profile


@router.put("/mechanics/{mechanic_id}/public-profile", response_model=MechanicPublicProfileResponse)
def update_mechanic_public_profile(
    mechanic_id: int,
    update: MechanicPublicProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update mechanic's public profile"""
    profile = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.mechanic_id == mechanic_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Public profile not found")
    
    for key, value in update.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/m/{slug}", response_model=MechanicPublicPage)
def get_public_mechanic_page(slug: str, db: Session = Depends(get_db)):
    """Get public mechanic page by slug (no auth required)"""
    profile = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.slug == slug,
        MechanicPublicProfile.is_public == True
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Mechanic not found")
    
    # Increment view count
    profile.total_views += 1
    db.commit()
    
    # Get mechanic basic info (in production, join with users table)
    # For demo, return mock data
    return MechanicPublicPage(
        slug=profile.slug,
        bio=profile.bio,
        specialties=profile.specialties,
        gallery_photos=profile.gallery_photos,
        video_urls=profile.video_urls,
        rating_avg=4.8,  # Mock
        jobs_completed=profile.total_bookings,
        years_experience=5,  # Mock
        verified=True  # Mock
    )


@router.post("/m/{slug}/book")
def book_mechanic_from_public_page(
    slug: str,
    referral_code: str = None,
    db: Session = Depends(get_db)
):
    """Book a mechanic from their public page"""
    profile = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.slug == slug
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Mechanic not found")
    
    # Increment booking count
    profile.total_bookings += 1
    
    # Track referral if code provided
    if referral_code and referral_code == profile.referral_code:
        profile.referral_count += 1
    
    db.commit()
    
    return {
        "message": "Booking initiated",
        "mechanic_id": profile.mechanic_id,
        "redirect_url": f"/customer/new-request?mechanic_id={profile.mechanic_id}"
    }


# ============ Visibility Stats ============

@router.get("/mechanics/{mechanic_id}/stats", response_model=List[MechanicVisibilityStatsResponse])
def get_mechanic_visibility_stats(
    mechanic_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get visibility stats for a mechanic"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    stats = db.query(MechanicVisibilityStats).filter(
        MechanicVisibilityStats.mechanic_id == mechanic_id,
        MechanicVisibilityStats.date >= start_date
    ).order_by(MechanicVisibilityStats.date.desc()).all()
    
    return stats


@router.get("/mechanics/{mechanic_id}/dashboard", response_model=MechanicDashboard)
def get_mechanic_dashboard(mechanic_id: int, db: Session = Depends(get_db)):
    """Get aggregated dashboard for mechanic"""
    stats = db.query(MechanicVisibilityStats).filter(
        MechanicVisibilityStats.mechanic_id == mechanic_id
    ).all()
    
    if not stats:
        return MechanicDashboard(
            total_profile_views=0,
            total_request_views=0,
            total_offers_sent=0,
            total_offers_accepted=0,
            total_jobs_completed=0,
            total_earned=0,
            total_commission_paid=0,
            acceptance_rate=0.0,
            average_rating=0.0,
            response_time_avg=0.0
        )
    
    total_profile_views = sum(s.profile_views for s in stats)
    total_request_views = sum(s.request_views for s in stats)
    total_offers_sent = sum(s.offers_sent for s in stats)
    total_offers_accepted = sum(s.offers_accepted for s in stats)
    total_jobs_completed = sum(s.jobs_completed for s in stats)
    total_earned = sum(s.total_earned for s in stats)
    total_commission_paid = sum(s.commission_paid for s in stats)
    
    acceptance_rate = (total_offers_accepted / total_offers_sent * 100) if total_offers_sent > 0 else 0.0
    
    # Mock values for rating and response time
    average_rating = 4.8
    response_time_avg = 5.0
    
    return MechanicDashboard(
        total_profile_views=total_profile_views,
        total_request_views=total_request_views,
        total_offers_sent=total_offers_sent,
        total_offers_accepted=total_offers_accepted,
        total_jobs_completed=total_jobs_completed,
        total_earned=total_earned,
        total_commission_paid=total_commission_paid,
        acceptance_rate=acceptance_rate,
        average_rating=average_rating,
        response_time_avg=response_time_avg
    )


@router.post("/mechanics/{mechanic_id}/stats/track")
def track_mechanic_visibility(
    mechanic_id: int,
    event_type: str,  # "profile_view", "request_view", "offer_sent", etc.
    db: Session = Depends(get_db)
):
    """Track a visibility event for a mechanic"""
    today = datetime.utcnow().date()
    
    # Get or create today's stats
    stats = db.query(MechanicVisibilityStats).filter(
        MechanicVisibilityStats.mechanic_id == mechanic_id,
        func.date(MechanicVisibilityStats.date) == today
    ).first()
    
    if not stats:
        stats = MechanicVisibilityStats(
            mechanic_id=mechanic_id,
            date=datetime.utcnow(),
            profile_views=0,
            request_views=0,
            offers_sent=0,
            offers_accepted=0,
            jobs_completed=0,
            total_earned=0,
            commission_paid=0
        )
        db.add(stats)
    
    # Increment the appropriate counter
    if event_type == "profile_view":
        stats.profile_views += 1
    elif event_type == "request_view":
        stats.request_views += 1
    elif event_type == "offer_sent":
        stats.offers_sent += 1
    elif event_type == "offer_accepted":
        stats.offers_accepted += 1
    elif event_type == "job_completed":
        stats.jobs_completed += 1
    
    db.commit()
    
    return {"message": "Event tracked", "event_type": event_type}


@router.get("/mechanics/featured", response_model=List[MechanicPublicProfileResponse])
def get_featured_mechanics(db: Session = Depends(get_db)):
    """Get featured mechanics"""
    profiles = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.is_featured == True,
        MechanicPublicProfile.is_public == True
    ).all()
    return profiles


@router.get("/mechanics/top-rated", response_model=List[MechanicPublicProfileResponse])
def get_top_rated_mechanics(limit: int = 10, db: Session = Depends(get_db)):
    """Get top-rated mechanics"""
    # In production, join with users table and order by rating
    # For demo, return featured mechanics
    profiles = db.query(MechanicPublicProfile).filter(
        MechanicPublicProfile.is_public == True
    ).limit(limit).all()
    return profiles
