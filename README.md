# MécaCasablanca - Architecture & Setup

## 🏗️ Architecture Monorepo

```
mecacasablanca/
├── frontend/          # App mobile React/Vite (existante + améliorée)
├── backend/           # API FastAPI + PostgreSQL
├── landing/           # Next.js SSR (SEO-ready)
├── docs/              # Documentation
└── README.md          # Ce fichier
```

## 🚀 Quick Start

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup PostgreSQL
createdb mecacasablanca

# Run migrations
alembic upgrade head

# Seed demo data
python -m app.scripts.seed_demo

# Start server
uvicorn app.main:app --reload --port 8000
```

**Backend disponible sur :** http://localhost:8000  
**API Docs :** http://localhost:8000/docs  
**Demo Accounts :** Voir `backend/app/scripts/seed_demo.py`

### 2. Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

**Frontend disponible sur :** http://localhost:5173

### 3. Landing Page (Next.js)
```bash
cd landing
npm install
npm run dev
```

**Landing disponible sur :** http://localhost:3000

## 🧪 Tests

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Landing Tests
```bash
cd landing
npm test
```

## 📊 Demo Accounts

### Customer
- **Phone:** +212600000010
- **OTP:** 1234 (dev mode)
- **Name:** Amine Khalid

### Mechanic (Approved)
- **Phone:** +212600000001
- **OTP:** 1234 (dev mode)
- **Name:** Ahmed Benali

### Seller
- **Email:** autopieces@demo.ma
- **Password:** demo123
- **Shop:** AutoPièces Maroc

### Admin
- **Email:** admin@demo.ma
- **Password:** admin123

## 🌍 Feature Flags

Voir `backend/app/config/feature_flags.py` :
- `ENABLE_TWO_WHEELERS` : Flux urgent 2 roues
- `ENABLE_PRE_PURCHASE_INSPECTION` : Inspection achat occasion
- `ENABLE_ON_BEHALF` : Demande pour tiers
- `ENABLE_PRICE_INDEX` : Index prix public
- `ENABLE_COMMUNITY` : Feed communautaire
- `ENABLE_TUNING` : Hub tuning
- `ENABLE_PARTNERS` : Portail B2B
- `ENABLE_PASSPORT` : Passeport véhicule digital

## 📱 User Segments

1. **Individual** - Particulier standard
2. **Pro Driver** - Taxi/VTC/Livraison
3. **Fleet** - Entreprise avec flotte
4. **Family Helper** - Aide familiale (paiement pour tiers)
5. **Tourist/MRE** - Touriste ou diaspora

## 🚗 Vehicle Types

1. **Car** - Voiture
2. **Motorcycle** - Moto
3. **Scooter** - Scooter
4. **E-bike** - Vélo électrique
5. **Van** - Utilitaire
6. **Taxi** - Taxi
7. **Delivery Bike** - Vélo livraison

## 🌐 Supported Countries

- **MA** - Maroc (Lancé)
  - Casablanca ✅
  - Rabat 🔄 (Coming soon)
  - Marrakech 🔄 (Coming soon)

## 📋 Phases d'Implémentation

### ✅ Phase 1 - Global Foundation
- Config system (pays, villes, véhicules, segments)
- i18n amélioré (FR/AR/EN)
- Feature flags
- Types étendus

### 🔄 Phase 2 - New Customer Segments
- Two-wheelers urgent flow
- Pre-purchase inspection
- On-behalf request
- Mechanic/Seller dashboards

### ⏳ Phase 3 - Virality Engine
- Price index public
- Offer verdict
- Mechanic creator pages
- Sharing system

### ⏳ Phase 4 - Seasonal Moments
- Campaigns system
- Home banners
- Tourist mode

### ⏳ Phase 5 - Community & Tuning
- Community feed
- Tuning hub
- Clubs/Events

### ⏳ Phase 6 - Partners B2B
- Partner accounts
- Fleet management
- API/Webhooks

### ⏳ Phase 7 - Digital Vehicle Passport
- Vehicle timeline
- Reminders
- Public sharing

## 🔧 Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL 15 + PostGIS
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Auth:** JWT + OAuth2
- **Cache:** Redis
- **Queue:** Celery
- **Storage:** S3-compatible (MinIO dev)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Context API
- **Icons:** Lucide React
- **Testing:** Jest + React Testing Library

### Landing
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **SEO:** React Helmet + Structured Data
- **i18n:** next-intl
- **Testing:** Jest + React Testing Library

## 📚 Documentation

- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Feature Flags](./docs/FEATURE_FLAGS.md)
- [Testing Guide](./docs/TESTING.md)

## 🤝 Contribution

1. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
2. Commit les changements (`git commit -m 'Add AmazingFeature'`)
3. Push vers la branche (`git push origin feature/AmazingFeature`)
4. Ouvrir une Pull Request

## 📄 License

Propriétaire - MécaCasablanca 2024

## 📞 Support

- Email: support@mecacasablanca.ma
- WhatsApp: +212 600 000 000
