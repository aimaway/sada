"""
Configuration de l'application mecaGO
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configuration globale de l'application"""
    
    # Application
    APP_NAME: str = "mecaGO"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/mecago"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_PASSWORD: str = ""
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://mecago.app"
    ]
    
    # Payment
    CMI_API_KEY: str = ""
    CMI_MERCHANT_ID: str = ""
    ORANGE_MONEY_API_KEY: str = ""
    ORANGE_MONEY_MERCHANT_ID: str = ""
    INWI_MONEY_API_KEY: str = ""
    
    # Notifications
    SMS_PROVIDER: str = "twilio"
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    WHATSAPP_API_URL: str = "https://graph.facebook.com/v18.0"
    WHATSAPP_ACCESS_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    
    FIREBASE_SERVER_KEY: str = ""
    FIREBASE_PROJECT_ID: str = ""
    
    # Maps
    GOOGLE_MAPS_API_KEY: str = ""
    DEFAULT_RADIUS_KM: int = 10
    
    # Auto-close
    AUTO_CLOSE_HOURS: int = 24
    AUTO_CLOSE_CHECK_INTERVAL_MINUTES: int = 5
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

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
        extra = "ignore"  # .env contains keys not modeled here (dev convenience)


settings = Settings()
