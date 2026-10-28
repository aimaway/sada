"""
Application FastAPI principale pour mecaGO
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from app.config import settings
from app.database import get_db, engine
from app.models import User, UserRole, ProviderProfile, Job, JobStatus, ServiceRequest, Plan, Subscription
from app.websocket.manager import ConnectionManager

# Import seller and tuner routers
from app.api import seller, tuner
# Import marketplace & IFIX AI routers (SADA)
from app.api import marketplace, ifix_ai

# Create tables
from app.database import Base
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer(auto_error=False)

# WebSocket manager
ws_manager = ConnectionManager()

# FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API backend pour la plateforme mecaGO",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Utility Functions ============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifier un mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hasher un mot de passe (bcrypt limite à 72 octets — tronqué ici)."""
    return pwd_context.hash(password.encode("utf-8")[:72].decode("utf-8", errors="ignore"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Créer un token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Obtenir l'utilisateur actuel depuis le token JWT"""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            user_id = None
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    return user


# ============ Authentication Endpoints ============

@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(
    phone: str,
    password: str,
    full_name: str,
    role: UserRole = UserRole.CUSTOMER,
    db: Session = Depends(get_db)
):
    """Inscription d'un nouvel utilisateur"""
    # Vérifier si le téléphone existe déjà
    existing_user = db.query(User).filter(User.phone == phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce numéro de téléphone est déjà utilisé"
        )
    
    # Créer l'utilisateur
    hashed_password = get_password_hash(password)
    user = User(
        phone=phone,
        password_hash=hashed_password,
        full_name=full_name,
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Créer le token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "role": user.role
        }
    }


@app.post("/api/v1/auth/login")
def login(
    phone: str,
    password: str,
    db: Session = Depends(get_db)
):
    """Connexion d'un utilisateur"""
    user = db.query(User).filter(User.phone == phone).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Numéro de téléphone ou mot de passe incorrect"
        )
    
    # Mettre à jour last_login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Créer le token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "role": user.role
        }
    }


# ============ User Endpoints ============

@app.get("/api/v1/users/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Obtenir le profil de l'utilisateur actuel"""
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "status": current_user.status,
        "language": current_user.language,
        "created_at": current_user.created_at,
        "last_login": current_user.last_login
    }


@app.put("/api/v1/users/me")
def update_current_user_profile(
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    language: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Modifier le profil de l'utilisateur actuel"""
    if full_name:
        current_user.full_name = full_name
    if email:
        current_user.email = email
    if language:
        current_user.language = language
    
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profil mis à jour avec succès"}


# ============ Provider Endpoints ============

@app.get("/api/v1/providers")
def get_providers(
    type: Optional[str] = None,
    city: Optional[str] = None,
    verified: Optional[bool] = None,
    online: Optional[bool] = None,
    min_rating: Optional[float] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtenir la liste des providers avec filtres"""
    query = db.query(ProviderProfile)
    
    if type:
        query = query.filter(ProviderProfile.type == type)
    if city:
        query = query.filter(ProviderProfile.city == city)
    if verified is not None:
        query = query.filter(ProviderProfile.verified == verified)
    if online is not None:
        query = query.filter(ProviderProfile.is_online == online)
    if min_rating is not None:
        query = query.filter(ProviderProfile.rating >= min_rating)
    
    providers = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": p.id,
            "slug": p.slug,
            "type": p.type,
            "name": p.name,
            "avatar": p.avatar,
            "bio": p.bio,
            "verified": p.verified,
            "rating": p.rating,
            "review_count": p.review_count,
            "jobs_completed": p.jobs_completed,
            "city": p.city,
            "is_online": p.is_online,
            "specialties": p.specialties,
            "response_time": p.response_time
        }
        for p in providers
    ]


@app.get("/api/v1/providers/{slug}")
def get_provider_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtenir le profil complet d'un provider"""
    provider = db.query(ProviderProfile).filter(ProviderProfile.slug == slug).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider non trouvé"
        )
    
    return {
        "id": provider.id,
        "slug": provider.slug,
        "type": provider.type,
        "name": provider.name,
        "avatar": provider.avatar,
        "cover": provider.cover,
        "bio": provider.bio,
        "verified": provider.verified,
        "badges": provider.badges,
        "rating": provider.rating,
        "review_count": provider.review_count,
        "jobs_completed": provider.jobs_completed,
        "response_time": provider.response_time,
        "completion_rate": provider.completion_rate,
        "city": provider.city,
        "address": provider.address,
        "service_zone": provider.service_zone,
        "is_online": provider.is_online,
        "languages": provider.languages,
        "specialties": provider.specialties,
        "brands": provider.brands,
        "vehicle_types": provider.vehicle_types,
        "services": provider.services,
        "certificates": provider.certificates,
        "equipment": provider.equipment,
        "gallery": provider.gallery,
        "videos": provider.videos,
        "member_since": provider.member_since
    }


@app.post("/api/v1/providers", status_code=status.HTTP_201_CREATED)
def create_provider_profile(
    type: str,
    slug: str,
    name: str,
    bio: Optional[str] = None,
    city: str = "Casablanca",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Créer un profil provider"""
    # Vérifier si l'utilisateur a déjà un profil provider
    existing = db.query(ProviderProfile).filter(ProviderProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà un profil provider"
        )
    
    # Vérifier si le slug est disponible
    slug_exists = db.query(ProviderProfile).filter(ProviderProfile.slug == slug).first()
    if slug_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce slug est déjà utilisé"
        )
    
    provider = ProviderProfile(
        user_id=current_user.id,
        type=type,
        slug=slug,
        name=name,
        bio=bio,
        city=city
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)
    
    return {"message": "Profil provider créé avec succès", "provider_id": provider.id}


# ============ Job Endpoints ============

@app.get("/api/v1/jobs")
def get_jobs(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtenir la liste des jobs de l'utilisateur"""
    query = db.query(Job).filter(Job.customer_id == current_user.id)
    
    if status:
        query = query.filter(Job.status == status)
    
    jobs = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": job.id,
            "status": job.status,
            "agreed_price": job.agreed_price,
            "provider_id": job.provider_id,
            "created_at": job.created_at,
            "accepted_at": job.accepted_at,
            "completed_at": job.completed_at
        }
        for job in jobs
    ]


@app.get("/api/v1/jobs/{job_id}")
def get_job_details(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtenir les détails d'un job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    # Vérifier que l'utilisateur est le client ou le provider
    if job.customer_id != current_user.id and job.provider.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    provider = db.query(ProviderProfile).filter(ProviderProfile.id == job.provider_id).first()
    
    return {
        "id": job.id,
        "status": job.status,
        "agreed_price": job.agreed_price,
        "provider": {
            "id": provider.id,
            "name": provider.name,
            "avatar": provider.avatar,
            "rating": provider.rating
        },
        "diagnosis": job.diagnosis,
        "quote_update": job.quote_update,
        "quote_update_approved": job.quote_update_approved,
        "accepted_at": job.accepted_at,
        "started_at": job.started_at,
        "completed_at": job.completed_at,
        "auto_close_deadline": job.auto_close_deadline,
        "before_photos": job.before_photos,
        "after_photos": job.after_photos,
        "final_amount": job.final_amount,
        "created_at": job.created_at
    }


@app.put("/api/v1/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    new_status: JobStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour le statut d'un job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    # Vérifier que l'utilisateur est le provider
    if job.provider.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul le provider peut mettre à jour le statut"
        )
    
    job.status = new_status
    
    # Mettre à jour les timestamps selon le statut
    if new_status == JobStatus.ACCEPTED:
        job.accepted_at = datetime.utcnow()
        job.auto_close_deadline = datetime.utcnow() + timedelta(hours=settings.AUTO_CLOSE_HOURS)
    elif new_status == JobStatus.IN_PROGRESS:
        job.started_at = datetime.utcnow()
    elif new_status == JobStatus.COMPLETED:
        job.completed_at = datetime.utcnow()
    
    db.commit()
    
    # Envoyer notification WebSocket au client
    # await ws_manager.send_to_user(job.customer_id, {"type": "job_status_updated", "job_id": job_id, "status": new_status})
    
    return {"message": "Statut mis à jour avec succès"}


@app.post("/api/v1/jobs/{job_id}/close")
def close_job(
    job_id: int,
    final_amount: int,
    before_photos: List[str] = [],
    after_photos: List[str] = [],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clôturer un job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job non trouvé"
        )
    
    # Vérifier que l'utilisateur est le provider
    if job.provider.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seul le provider peut clôturer le job"
        )
    
    job.status = JobStatus.COMPLETED
    job.completed_at = datetime.utcnow()
    job.final_amount = final_amount
    job.before_photos = before_photos
    job.after_photos = after_photos
    
    # Mettre à jour les stats du provider
    provider = job.provider
    provider.jobs_completed += 1
    
    # Calculer la commission (10%)
    commission = int(final_amount * 0.10)
    provider.wallet_balance -= commission
    
    db.commit()
    
    return {"message": "Job clôturé avec succès", "commission": commission}


# ============ Plan Endpoints ============

@app.get("/api/v1/plans")
def get_plans(
    audience: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Obtenir la liste des plans"""
    query = db.query(Plan).filter(Plan.status == "active")
    
    if audience:
        query = query.filter(Plan.audience == audience)
    
    plans = query.all()
    
    return [
        {
            "id": plan.id,
            "slug": plan.slug,
            "audience": plan.audience,
            "name": plan.name,
            "price": plan.price,
            "features": plan.features
        }
        for plan in plans
    ]


@app.get("/api/v1/plans/{slug}")
def get_plan_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtenir les détails d'un plan"""
    plan = db.query(Plan).filter(Plan.slug == slug).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan non trouvé"
        )
    
    return {
        "id": plan.id,
        "slug": plan.slug,
        "audience": plan.audience,
        "name": plan.name,
        "price": plan.price,
        "features": plan.features
    }


@app.post("/api/v1/plans/subscribe")
def subscribe_to_plan(
    plan_slug: str,
    payment_method: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """S'abonner à un plan"""
    plan = db.query(Plan).filter(Plan.slug == plan_slug).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan non trouvé"
        )
    
    # Vérifier que l'utilisateur n'a pas déjà un abonnement actif
    existing_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).first()
    
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà un abonnement actif"
        )
    
    # Créer l'abonnement
    subscription = Subscription(
        user_id=current_user.id,
        plan_id=plan.id,
        status="active",
        expires_at=datetime.utcnow() + timedelta(days=30),
        payment_method=payment_method,
        last_payment_at=datetime.utcnow()
    )
    db.add(subscription)
    db.commit()
    
    return {"message": "Abonnement activé avec succès", "expires_at": subscription.expires_at}


# ============ WebSocket Endpoints ============

@app.websocket("/ws/requests")
async def websocket_requests(websocket: WebSocket):
    """WebSocket pour les demandes en temps réel"""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast to all connected providers
            await ws_manager.broadcast({
                "type": "new_request",
                "data": data
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


@app.websocket("/ws/jobs/{job_id}")
async def websocket_job(websocket: WebSocket, job_id: int):
    """WebSocket pour un job spécifique"""
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Send to job participants
            await ws_manager.send_personal_message({
                "type": "job_update",
                "job_id": job_id,
                "data": data
            }, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


# ============ Health Check ============

@app.get("/health")
def health_check():
    """Vérifier l'état de l'API"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }


from app.api import global_config as _gc
app.include_router(_gc.router, prefix="/api/v1", tags=["Global Config"])

# Include Seller and Tuner routers
app.include_router(seller.router, prefix="/api/v1", tags=["Seller Portal"])
app.include_router(marketplace.router)
app.include_router(ifix_ai.router)
app.include_router(tuner.router, prefix="/api/v1", tags=["Tuner Portal"])


@app.get("/")
def root():
    """Route racine"""
    return {
        "message": "Bienvenue sur l'API mecaGO",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }
