"""
Feature flags configuration
All features can be toggled via environment variables or database
"""
from typing import Dict
from app.config.settings import settings


class FeatureFlags:
    """Feature flags for gradual rollout and A/B testing"""
    
    # Phase 2 - New Customer Segments
    ENABLE_TWO_WHEELERS: bool = True
    ENABLE_PRE_PURCHASE_INSPECTION: bool = True
    ENABLE_ON_BEHALF: bool = True
    
    # Phase 3 - Virality Engine
    ENABLE_PRICE_INDEX: bool = True
    ENABLE_OFFER_VERDICT: bool = True
    ENABLE_MECHANIC_CREATOR_PAGES: bool = True
    ENABLE_REFERRAL_SYSTEM: bool = True
    
    # Phase 4 - Seasonal Moments
    ENABLE_SEASONAL_CAMPAIGNS: bool = True
    ENABLE_TOURIST_MODE: bool = True
    
    # Phase 5 - Community & Tuning
    ENABLE_COMMUNITY_FEED: bool = True
    ENABLE_TUNING_HUB: bool = True
    ENABLE_CLUBS_EVENTS: bool = True
    
    # Phase 6 - Partners B2B
    ENABLE_PARTNER_PORTAL: bool = True
    ENABLE_FLEET_MANAGEMENT: bool = True
    ENABLE_PARTNER_API: bool = True
    
    # Phase 7 - Digital Vehicle Passport
    ENABLE_VEHICLE_PASSPORT: bool = True
    ENABLE_PUBLIC_PASSPORT: bool = True
    
    # Additional features
    ENABLE_WHATSAPP_NOTIFICATIONS: bool = False  # Requires real integration
    ENABLE_CARD_PAYMENTS: bool = False  # Requires CMI integration
    ENABLE_ESCROW_PAYMENTS: bool = False  # Complex, phase later
    
    @classmethod
    def get_all_flags(cls) -> Dict[str, bool]:
        """Get all feature flags as a dictionary"""
        return {
            key: getattr(cls, key)
            for key in dir(cls)
            if key.startswith("ENABLE_") and not key.startswith("_")
        }
    
    @classmethod
    def is_enabled(cls, flag_name: str) -> bool:
        """Check if a specific feature flag is enabled"""
        return getattr(cls, flag_name, False)


# Feature flag dependency for FastAPI
def get_feature_flags() -> Dict[str, bool]:
    """FastAPI dependency to inject feature flags"""
    return FeatureFlags.get_all_flags()
