"""
Backend configuration and settings
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App
    APP_NAME: str = "TomoBily API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development, staging, production
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/tomobily"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Frontend dev
        "http://localhost:3000",  # Landing dev
        "https://tomobily.ma",
    ]
    
    # Storage (S3-compatible)
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "tomobily"
    
    # SMS/WhatsApp (Mock in dev)
    SMS_PROVIDER: str = "mock"  # mock, twilio, nexmo
    SMS_API_KEY: Optional[str] = None
    
    # Maps
    MAPS_PROVIDER: str = "mock"  # mock, google, mapbox
    MAPS_API_KEY: Optional[str] = None
    
    # Demo mode
    DEMO_MODE: bool = True

    # IFIX AI — LLM externe (OpenAI-compatible : OpenAI, Groq, Together, Ollama...)
    # Si IFIX_LLM_API_KEY est vide, IFIX fonctionne en moteur de regles local
    # (reponses explicitement etiquettees "moteur de regles", jamais un faux LLM).
    IFIX_LLM_API_KEY: str = ""
    IFIX_LLM_BASE_URL: str = "https://api.openai.com/v1"
    IFIX_LLM_MODEL: str = "gpt-4o-mini"
    IFIX_LLM_ENABLED: bool = True   # inert si pas de cle ; permet de forcer le mode regles
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # dev .env may carry keys from other settings modules


settings = Settings()
