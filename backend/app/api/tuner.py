"""
API Endpoints pour Tuner Portal
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
import secrets

from app.database import get_db
from app.models import User, ProviderProfile, TuningService, TuningRequest, TuningProject, ProjectEstimate, Appointment, WorkLog, PortfolioEntry, Invoice
from app.schemas.tuner import (
    TuningServiceCreate, TuningServiceUpdate, TuningServiceResponse,
    TuningRequestCreate, TuningRequestResponse, TuningRequestListResponse,
    TuningProjectCreate, TuningProjectUpdate, TuningProjectResponse, TuningProjectListResponse,
    ProjectEstimateCreate, ProjectEstimateResponse,
    AppointmentCreate, AppointmentUpdate, AppointmentResponse, AppointmentListResponse,
    WorkLogCreate, WorkLogResponse,
    PortfolioEntryCreate, PortfolioEntryUpdate, PortfolioEntryResponse, PortfolioListResponse,
    InvoiceCreate, InvoiceResponse, InvoiceListResponse,
    TunerAnalytics, TunerDashboardStats,
    TunerSettings, TunerSettingsUpdate
)
from app.core.rbac import require_role

router = APIRouter()


# ============ Dashboard Endpoints ============

@router.get("/tuner/dashboard/stats", response_model=TunerDashboardStats)
async def get_tuner_dashboard_stats(
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Statistiques du dashboard tuner"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    # Requests stats
    new_requests = db.query(TuningRequest).filter(
        TuningRequest.tuner_id == tuner_profile.id,
        TuningRequest.status == "available"
    ).count()
    
    # Projects stats
    active_projects = db.query(TuningProject).filter(
        TuningProject.id.in_(
            db.query(TuningRequest.project_id).filter(
                TuningRequest.tuner_id == tuner_profile.id,
                TuningRequest.status.in_(["accepted", "in_progress"])
            )
        )
    ).count()
    
    completed_projects = db.query(TuningProject).filter(
        TuningProject.id.in_(
            db.query(TuningRequest.project_id).filter(
                TuningRequest.tuner_id == tuner_profile.id,
                TuningRequest.status == "completed"
            )
        )
    ).count()
    
    # Appointments stats
    upcoming_appointments = db.query(Appointment).filter(
        Appointment.tuner_id == tuner_profile.id,
        Appointment.status.in_(["scheduled", "confirmed"]),
        Appointment.scheduled_date >= datetime.utcnow()
    ).count()
    
    # Revenue stats
    total_revenue = db.query(func.sum(Invoice.total)).filter(
        Invoice.tuner_id == tuner_profile.id,
        Invoice.status == "paid"
    ).scalar() or 0
    
    # Customer satisfaction
    customer_satisfaction = tuner_profile.rating or 0.0
    
    # Estimates stats
    pending_estimates = db.query(ProjectEstimate).filter(
        ProjectEstimate.project_id.in_(
            db.query(TuningProject.id).filter(
                TuningProject.id.in_(
                    db.query(TuningRequest.project_id).filter(
                        TuningRequest.tuner_id == tuner_profile.id
                    )
                )
            )
        ),
        ProjectEstimate.status == "submitted"
    ).count()
    
    awaiting_approval = db.query(TuningProject).filter(
        TuningProject.id.in_(
            db.query(TuningRequest.project_id).filter(
                TuningRequest.tuner_id == tuner_profile.id,
                TuningRequest.status == "awaiting_approval"
            )
        )
    ).count()
    
    # Wallet stats
    available_balance = tuner_profile.wallet_balance
    pending_payouts = 0  # TODO: Implémenter
    
    return TunerDashboardStats(
        new_requests=new_requests,
        active_projects=active_projects,
        completed_projects=completed_projects,
        upcoming_appointments=upcoming_appointments,
        total_revenue=total_revenue,
        customer_satisfaction=customer_satisfaction,
        pending_estimates=pending_estimates,
        awaiting_approval=awaiting_approval,
        available_balance=available_balance,
        pending_payouts=pending_payouts
    )


# ============ Tuning Service Endpoints ============

@router.get("/tuner/services", response_model=List[TuningServiceResponse])
async def list_tuning_services(
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Liste des services de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    services = db.query(TuningService).filter(TuningService.tuner_id == tuner_profile.id).all()
    return services


@router.post("/tuner/services", response_model=TuningServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_tuning_service(
    service: TuningServiceCreate,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Créer un nouveau service de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    # Générer un slug unique
    slug = service.name.lower().replace(" ", "-")
    slug = ''.join(c for c in slug if c.isalnum() or c == '-')
    base_slug = slug
    counter = 1
    while db.query(TuningService).filter(TuningService.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    db_service = TuningService(
        tuner_id=tuner_profile.id,
        slug=slug,
        **service.dict()
    )
    
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    
    return db_service


@router.put("/tuner/services/{service_id}", response_model=TuningServiceResponse)
async def update_tuning_service(
    service_id: int,
    service_update: TuningServiceUpdate,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Mettre à jour un service de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    service = db.query(TuningService).filter(
        TuningService.id == service_id,
        TuningService.tuner_id == tuner_profile.id
    ).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")
    
    for key, value in service_update.dict(exclude_unset=True).items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    
    return service


# ============ Tuning Request Endpoints ============

@router.get("/tuner/requests", response_model=TuningRequestListResponse)
async def list_tuning_requests(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Liste des demandes de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    query = db.query(TuningRequest).filter(
        (TuningRequest.tuner_id == tuner_profile.id) | (TuningRequest.tuner_id == None)
    )
    
    if status:
        query = query.filter(TuningRequest.status == status)
    
    total = query.count()
    requests = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return TuningRequestListResponse(
        requests=requests,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.post("/tuner/requests/{request_id}/accept")
async def accept_tuning_request(
    request_id: int,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Accepter une demande de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    request = db.query(TuningRequest).filter(TuningRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    if request.status != "available":
        raise HTTPException(status_code=400, detail="Demande non disponible")
    
    request.tuner_id = tuner_profile.id
    request.status = "accepted"
    request.assigned_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Demande acceptée"}


# ============ Tuning Project Endpoints ============

@router.get("/tuner/projects", response_model=TuningProjectListResponse)
async def list_tuning_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Liste des projets de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    query = db.query(TuningProject).join(TuningRequest).filter(
        TuningRequest.tuner_id == tuner_profile.id
    )
    
    if status:
        query = query.filter(TuningProject.status == status)
    
    total = query.count()
    projects = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return TuningProjectListResponse(
        projects=projects,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.post("/tuner/projects", response_model=TuningProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_tuning_project(
    project: TuningProjectCreate,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Créer un nouveau projet de tuning"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    request = db.query(TuningRequest).filter(TuningRequest.id == project.request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    # Générer un numéro de projet unique
    project_number = f"TUN-{datetime.utcnow().strftime('%Y%m%d')}-{secrets.token_hex(3).upper()}"
    
    db_project = TuningProject(
        project_number=project_number,
        **project.dict(),
        vehicle_make=request.vehicle_make,
        vehicle_model=request.vehicle_model,
        vehicle_year=request.vehicle_year,
        vehicle_engine=request.vehicle_engine,
        vehicle_mileage=request.vehicle_mileage
    )
    
    db.add(db_project)
    request.project_id = db_project.id
    request.status = "in_progress"
    
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.put("/tuner/projects/{project_id}/status")
async def update_project_status(
    project_id: int,
    new_status: str,
    notes: Optional[str] = None,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Mettre à jour le statut d'un projet"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    project = db.query(TuningProject).join(TuningRequest).filter(
        TuningProject.id == project_id,
        TuningRequest.tuner_id == tuner_profile.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    # Mettre à jour le statut
    project.status = new_status
    
    # Ajouter à l'historique
    status_entry = {
        "status": new_status,
        "timestamp": datetime.utcnow().isoformat(),
        "notes": notes
    }
    project.status_history.append(status_entry)
    
    # Mettre à jour les timestamps
    if new_status == "work_in_progress" and not project.start_date:
        project.start_date = datetime.utcnow()
    elif new_status == "completed":
        project.actual_completion = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Statut du projet mis à jour: {new_status}"}


# ============ Appointment Endpoints ============

@router.get("/tuner/appointments", response_model=AppointmentListResponse)
async def list_appointments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Liste des rendez-vous"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    query = db.query(Appointment).filter(Appointment.tuner_id == tuner_profile.id)
    
    if status:
        query = query.filter(Appointment.status == status)
    
    total = query.count()
    appointments = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return AppointmentListResponse(
        appointments=appointments,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.post("/tuner/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment: AppointmentCreate,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Créer un nouveau rendez-vous"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    # Générer un numéro de rendez-vous unique
    appointment_number = f"APT-{datetime.utcnow().strftime('%Y%m%d')}-{secrets.token_hex(3).upper()}"
    
    # Calculer l'heure de fin
    end_time = appointment.scheduled_time + timedelta(minutes=appointment.duration)
    
    db_appointment = Appointment(
        appointment_number=appointment_number,
        tuner_id=tuner_profile.id,
        customer_id=appointment.request_id,  # TODO: Récupérer depuis la request
        end_time=end_time,
        **appointment.dict()
    )
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    return db_appointment


# ============ Portfolio Endpoints ============

@router.get("/tuner/portfolio", response_model=PortfolioListResponse)
async def list_portfolio_entries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    publication_status: Optional[str] = None,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Liste des entrées portfolio"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    query = db.query(PortfolioEntry).filter(PortfolioEntry.tuner_id == tuner_profile.id)
    
    if publication_status:
        query = query.filter(PortfolioEntry.publication_status == publication_status)
    
    total = query.count()
    entries = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return PortfolioListResponse(
        entries=entries,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )


@router.post("/tuner/portfolio", response_model=PortfolioEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio_entry(
    entry: PortfolioEntryCreate,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Créer une nouvelle entrée portfolio"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    db_entry = PortfolioEntry(
        tuner_id=tuner_profile.id,
        **entry.dict()
    )
    
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    return db_entry


# ============ Analytics Endpoints ============

@router.get("/tuner/analytics", response_model=TunerAnalytics)
async def get_tuner_analytics(
    period: str = Query("monthly", pattern="^(daily|weekly|monthly|yearly)$"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Analytics du tuner"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    # Définir la période par défaut
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        if period == "daily":
            start_date = end_date - timedelta(days=1)
        elif period == "weekly":
            start_date = end_date - timedelta(weeks=1)
        elif period == "monthly":
            start_date = end_date - timedelta(days=30)
        else:  # yearly
            start_date = end_date - timedelta(days=365)
    
    # Calculer les statistiques
    projects = db.query(TuningProject).join(TuningRequest).filter(
        TuningRequest.tuner_id == tuner_profile.id,
        TuningProject.status == "completed",
        TuningProject.actual_completion >= start_date,
        TuningProject.actual_completion <= end_date
    ).all()
    
    total_projects = len(projects)
    completed_projects = total_projects
    
    # Revenue
    invoices = db.query(Invoice).filter(
        Invoice.tuner_id == tuner_profile.id,
        Invoice.status == "paid",
        Invoice.paid_at >= start_date,
        Invoice.paid_at <= end_date
    ).all()
    
    total_revenue = sum(invoice.total for invoice in invoices)
    labor_revenue = sum(
        sum(item.get("labor_total", 0) for item in invoice.line_items)
        for invoice in invoices
    )
    parts_revenue = total_revenue - labor_revenue
    
    # Commissions
    total_commissions = int(total_revenue * 0.10)  # 10% commission
    net_revenue = total_revenue - total_commissions
    
    average_project_value = total_revenue / total_projects if total_projects > 0 else 0
    
    # Projects by category
    projects_by_category = {}
    for project in projects:
        cat = project.category.value if hasattr(project.category, 'value') else str(project.category)
        projects_by_category[cat] = projects_by_category.get(cat, 0) + 1
    
    # Revenue by month
    revenue_by_month = []
    for i in range(12):
        month_start = start_date.replace(day=1) + timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        month_revenue = sum(
            invoice.total for invoice in invoices
            if month_start <= invoice.paid_at < month_end
        )
        revenue_by_month.append({
            "month": month_start.strftime("%Y-%m"),
            "revenue": month_revenue
        })
    
    return TunerAnalytics(
        period=period,
        start_date=start_date,
        end_date=end_date,
        total_projects=total_projects,
        completed_projects=completed_projects,
        total_revenue=total_revenue,
        labor_revenue=labor_revenue,
        parts_revenue=parts_revenue,
        total_commissions=total_commissions,
        net_revenue=net_revenue,
        average_project_value=average_project_value,
        projects_by_category=projects_by_category,
        revenue_by_month=revenue_by_month
    )


# ============ Settings Endpoints ============

@router.get("/tuner/settings", response_model=TunerSettings)
async def get_tuner_settings(
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Paramètres du tuner"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    return TunerSettings(
        workshop_name=tuner_profile.name,
        workshop_description=tuner_profile.bio,
        workshop_logo=tuner_profile.avatar,
        workshop_banner=tuner_profile.cover,
        contact_email=current_user.email,
        contact_phone=current_user.phone,
        # TODO: Implémenter service_area, working_hours, notification_preferences
    )


@router.put("/tuner/settings")
async def update_tuner_settings(
    settings: TunerSettingsUpdate,
    current_user: User = Depends(require_role("tuner")),
    db: Session = Depends(get_db)
):
    """Mettre à jour les paramètres du tuner"""
    tuner_profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if not tuner_profile:
        raise HTTPException(status_code=404, detail="Profil tuner non trouvé")
    
    if settings.workshop_name:
        tuner_profile.name = settings.workshop_name
    if settings.workshop_description:
        tuner_profile.bio = settings.workshop_description
    
    # TODO: Implémenter les autres paramètres
    
    db.commit()
    
    return {"message": "Paramètres mis à jour"}
