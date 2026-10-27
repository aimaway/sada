# mecaGO Backend API

Backend FastAPI pour la plateforme mecaGO avec PostgreSQL, WebSocket, et intégrations complètes.

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py                 # Application FastAPI principale
│   ├── config.py               # Configuration
│   ├── database.py             # Connexion PostgreSQL
│   ├── models/                 # Modèles SQLAlchemy
│   │   ├── user.py
│   │   ├── provider.py
│   │   ├── job.py
│   │   ├── plan.py
│   │   └── request.py
│   ├── schemas/                # Schémas Pydantic
│   │   ├── user.py
│   │   ├── provider.py
│   │   ├── job.py
│   │   ├── plan.py
│   │   └── request.py
│   ├── api/                    # Endpoints API
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── providers.py
│   │   ├── jobs.py
│   │   ├── plans.py
│   │   └── requests.py
│   ├── services/               # Logique métier
│   │   ├── auth_service.py
│   │   ├── provider_service.py
│   │   ├── job_service.py
│   │   ├── plan_service.py
│   │   ├── payment_service.py
│   │   └── notification_service.py
│   ├── websocket/              # WebSocket handlers
│   │   ├── manager.py
│   │   └── handlers.py
│   ├── workers/                # Background workers
│   │   ├── auto_close.py
│   │   └── notifications.py
│   └── integrations/           # Intégrations externes
│       ├── payment/
│       │   ├── cmi.py
│       │   ├── orange_money.py
│       │   └── inwi_money.py
│       ├── notification/
│       │   ├── sms.py
│       │   ├── whatsapp.py
│       │   └── push.py
│       └── maps/
│           └── geolocation.py
├── alembic/                    # Migrations
│   ├── versions/
│   └── env.py
├── tests/                      # Tests
│   ├── unit/
│   └── e2e/
├── requirements.txt
├── alembic.ini
└── .env.example
```

## 🚀 Installation

```bash
# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données
cp .env.example .env
# Éditer .env avec vos credentials

# Créer les migrations
alembic upgrade head

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir token
- `POST /api/auth/logout` - Déconnexion

### Users
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Modifier profil
- `GET /api/users/{id}` - Voir profil public

### Providers
- `GET /api/providers` - Liste des providers
- `GET /api/providers/{slug}` - Profil provider
- `POST /api/providers` - Créer profil provider
- `PUT /api/providers/{id}` - Modifier profil
- `GET /api/providers/search` - Recherche avancée

### Jobs
- `GET /api/jobs` - Liste des jobs
- `GET /api/jobs/{id}` - Détails job
- `POST /api/jobs` - Créer job
- `PUT /api/jobs/{id}/status` - Mettre à jour statut
- `POST /api/jobs/{id}/close` - Clôturer job

### Plans
- `GET /api/plans` - Liste des plans
- `GET /api/plans/{slug}` - Détails plan
- `POST /api/plans/subscribe` - S'abonner
- `DELETE /api/plans/unsubscribe` - Se désabonner

### Requests
- `GET /api/requests` - Liste des demandes
- `POST /api/requests` - Créer demande
- `PUT /api/requests/{id}` - Modifier demande
- `DELETE /api/requests/{id}` - Annuler demande

### WebSocket
- `WS /ws/requests` - Temps réel demandes
- `WS /ws/jobs/{id}` - Temps réel jobs

## 🔧 Configuration

Variables d'environnement dans `.env` :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mecago

# Redis
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Payment
CMI_API_KEY=your-cmi-key
ORANGE_MONEY_API_KEY=your-orange-key
INWI_MONEY_API_KEY=your-inwi-key

# Notifications
SMS_API_KEY=your-sms-key
WHATSAPP_API_KEY=your-whatsapp-key
FIREBASE_SERVER_KEY=your-firebase-key

# Maps
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## 🧪 Tests

```bash
# Tests unitaires
pytest tests/unit/

# Tests E2E
pytest tests/e2e/

# Couverture
pytest --cov=app tests/
```

## 📦 Déploiement

### Docker
```bash
docker-compose up -d
```

### Production
```bash
# Build
docker build -t mecago-backend .

# Run
docker run -d -p 8000:8000 --env-file .env mecago-backend
```

## 📝 Documentation

- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔒 Sécurité

- JWT Authentication
- CORS Configuration
- Rate Limiting
- Input Validation
- SQL Injection Protection
- XSS Protection

## 📊 Monitoring

- Logs structurés
- Métriques Prometheus
- Health checks
- Error tracking

## 🚀 Features

- ✅ Authentification JWT
- ✅ Gestion des providers (mécaniciens, tuners, vendeurs)
- ✅ Système de jobs avec auto-close
- ✅ Plans d'abonnement
- ✅ WebSocket temps réel
- ✅ Intégration paiement (CMI, Orange Money, inwi Money)
- ✅ Notifications (SMS, WhatsApp, Push)
- ✅ Géolocalisation
- ✅ Background workers
- ✅ Tests complets

## 📄 License

Propriétaire - mecaGO 2024
