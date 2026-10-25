"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.database import engine, Base
from app.api import global_config

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

# Include routers
app.include_router(global_config.router, prefix="/api/v1", tags=["Global Configuration"])


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
