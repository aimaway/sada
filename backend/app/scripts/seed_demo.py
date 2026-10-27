"""
Seed script for demo data - Phase 1: Global Foundation
Run with: python -m app.scripts.seed_demo
"""
from app.database import SessionLocal, engine, Base
from app.models.global_config import Country, City, VehicleType, UserSegment, FeatureFlag
from app.config.feature_flags import FeatureFlags

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    print("🌱 Seeding demo data...")
    
    # ============ Countries ============
    print("  📍 Creating countries...")
    
    countries_data = [
        {
            "code": "MA",
            "name": "Maroc",
            "name_ar": "المغرب",
            "name_en": "Morocco",
            "currency": "MAD",
            "currency_symbol": "MAD",
            "phone_format": r"^\+212[5-7]\d{8}$",
            "plate_format": r"^\d{1,5}-[أ-يA-Z]-\d{1,2}$",
            "locales": ["fr", "ar", "en"],
            "default_locale": "fr",
            "legal_texts": {
                "terms": "https://mecacasablanca.ma/terms",
                "privacy": "https://mecacasablanca.ma/privacy",
            },
            "is_active": True,
            "launch_status": "live",
        },
    ]
    
    for country_data in countries_data:
        existing = db.query(Country).filter(Country.code == country_data["code"]).first()
        if not existing:
            country = Country(**country_data)
            db.add(country)
            print(f"    ✓ Created country: {country_data['name']}")
        else:
            print(f"    ⚠ Country already exists: {country_data['name']}")
    
    db.commit()
    
    # ============ Cities ============
    print("  🏙️  Creating cities...")
    
    morocco = db.query(Country).filter(Country.code == "MA").first()
    
    cities_data = [
        {
            "country_id": morocco.id,
            "name": "Casablanca",
            "name_ar": "الدار البيضاء",
            "name_en": "Casablanca",
            "latitude": 33.5731,
            "longitude": -7.5898,
            "launch_status": "live",
        },
        {
            "country_id": morocco.id,
            "name": "Rabat",
            "name_ar": "الرباط",
            "name_en": "Rabat",
            "latitude": 34.0209,
            "longitude": -6.8416,
            "launch_status": "coming_soon",
        },
        {
            "country_id": morocco.id,
            "name": "Marrakech",
            "name_ar": "مراكش",
            "name_en": "Marrakech",
            "latitude": 31.6295,
            "longitude": -7.9811,
            "launch_status": "coming_soon",
        },
    ]
    
    for city_data in cities_data:
        existing = db.query(City).filter(
            City.country_id == city_data["country_id"],
            City.name == city_data["name"]
        ).first()
        if not existing:
            city = City(**city_data)
            db.add(city)
            print(f"    ✓ Created city: {city_data['name']}")
        else:
            print(f"    ⚠ City already exists: {city_data['name']}")
    
    db.commit()
    
    # ============ Vehicle Types ============
    print("  🚗 Creating vehicle types...")
    
    vehicle_types_data = [
        {"name": "car", "name_ar": "سيارة", "name_en": "Car", "icon": "🚗", "description": "Voiture particulière", "display_order": 1},
        {"name": "motorcycle", "name_ar": "دراجة نارية", "name_en": "Motorcycle", "icon": "🏍️", "description": "Moto", "display_order": 2},
        {"name": "scooter", "name_ar": "سكوتر", "name_en": "Scooter", "icon": "🛵", "description": "Scooter", "display_order": 3},
        {"name": "e-bike", "name_ar": "دراجة كهربائية", "name_en": "E-bike", "icon": "🚲", "description": "Vélo électrique", "display_order": 4},
        {"name": "van", "name_ar": "شاحنة صغيرة", "name_en": "Van", "icon": "🚐", "description": "Utilitaire", "display_order": 5},
        {"name": "taxi", "name_ar": "سيارة أجرة", "name_en": "Taxi", "icon": "🚕", "description": "Taxi", "display_order": 6},
        {"name": "delivery_bike", "name_ar": "دراجة توصيل", "name_en": "Delivery Bike", "icon": "🚴", "description": "Vélo de livraison", "display_order": 7},
    ]
    
    for vt_data in vehicle_types_data:
        existing = db.query(VehicleType).filter(VehicleType.name == vt_data["name"]).first()
        if not existing:
            vt = VehicleType(**vt_data, is_active=True)
            db.add(vt)
            print(f"    ✓ Created vehicle type: {vt_data['name']}")
        else:
            print(f"    ⚠ Vehicle type already exists: {vt_data['name']}")
    
    db.commit()
    
    # ============ User Segments ============
    print("  👥 Creating user segments...")
    
    segments_data = [
        {
            "name": "individual",
            "name_ar": "فرد",
            "name_en": "Individual",
            "description": "Particulier standard",
            "onboarding_copy_key": "onboarding.individual",
            "default_services": [1, 2, 3],  # Battery, Oil change, Brakes
            "display_order": 1,
        },
        {
            "name": "pro_driver",
            "name_ar": "سائق محترف",
            "name_en": "Pro Driver",
            "description": "Taxi, VTC, Livraison",
            "onboarding_copy_key": "onboarding.pro_driver",
            "default_services": [1, 2, 3, 4],  # All urgent services
            "display_order": 2,
        },
        {
            "name": "fleet",
            "name_ar": "أسطول",
            "name_en": "Fleet",
            "description": "Entreprise avec flotte",
            "onboarding_copy_key": "onboarding.fleet",
            "default_services": [1, 2, 3, 4, 5],  # All services
            "display_order": 3,
        },
        {
            "name": "family_helper",
            "name_ar": "مساعدة عائلية",
            "name_en": "Family Helper",
            "description": "Aide familiale (paiement pour tiers)",
            "onboarding_copy_key": "onboarding.family_helper",
            "default_services": [1, 2, 3],
            "display_order": 4,
        },
        {
            "name": "tourist",
            "name_ar": "سائح",
            "name_en": "Tourist/MRE",
            "description": "Touriste ou diaspora",
            "onboarding_copy_key": "onboarding.tourist",
            "default_services": [1, 2],  # Quick services
            "display_order": 5,
        },
    ]
    
    for seg_data in segments_data:
        existing = db.query(UserSegment).filter(UserSegment.name == seg_data["name"]).first()
        if not existing:
            seg = UserSegment(**seg_data, is_active=True)
            db.add(seg)
            print(f"    ✓ Created user segment: {seg_data['name']}")
        else:
            print(f"    ⚠ User segment already exists: {seg_data['name']}")
    
    db.commit()
    
    # ============ Feature Flags ============
    print("  🚩 Creating feature flags...")
    
    all_flags = FeatureFlags.get_all_flags()
    
    for flag_key, default_value in all_flags.items():
        existing = db.query(FeatureFlag).filter(FeatureFlag.key == flag_key).first()
        if not existing:
            flag = FeatureFlag(
                key=flag_key,
                enabled=default_value,
                rollout_percentage=100,
                description=f"Feature flag for {flag_key}",
            )
            db.add(flag)
            print(f"    ✓ Created feature flag: {flag_key} = {default_value}")
        else:
            print(f"    ⚠ Feature flag already exists: {flag_key}")
    
    db.commit()
    
    print("\n✅ Demo data seeded successfully!")
    print("\n📊 Summary:")
    print(f"  • Countries: {db.query(Country).count()}")
    print(f"  • Cities: {db.query(City).count()}")
    print(f"  • Vehicle Types: {db.query(VehicleType).count()}")
    print(f"  • User Segments: {db.query(UserSegment).count()}")
    print(f"  • Feature Flags: {db.query(FeatureFlag).count()}")

except Exception as e:
    print(f"\n❌ Error seeding data: {e}")
    db.rollback()
    raise
finally:
    db.close()
