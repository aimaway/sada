"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.database import engine, Base
from app.api import global_config
from app.api import urgent_requests
from app.api import inspections
from app.api import on_behalf
from app.api import mechanic_profiles
from app.api import recurring_invoices

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API for MécaCasablanca - On-demand car repair platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - Phase 1
app.include_router(global_config.router, prefix="/api/v1", tags=["Global Configuration"])

# Include routers - Phase 2
app.include_router(urgent_requests.router, prefix="/api/v1", tags=["Urgent Requests"])
app.include_router(inspections.router, prefix="/api/v1", tags=["Inspections"])
app.include_router(on_behalf.router, prefix="/api/v1", tags=["On-behalf Requests"])
app.include_router(mechanic_profiles.router, prefix="/api/v1", tags=["Mechanic Profiles"])
app.include_router(recurring_invoices.router, prefix="/api/v1", tags=["Recurring Plans & Invoices"])


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to MécaCasablanca API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "demo_mode": settings.DEMO_MODE,
    }
