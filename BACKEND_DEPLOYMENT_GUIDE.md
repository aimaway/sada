# 🚀 Backend mecaGO - Guide de Déploiement Complet

## 📋 Vue d'Ensemble

Le backend mecaGO est une API REST complète construite avec **FastAPI** et **PostgreSQL**, incluant :

- ✅ Authentification JWT
- ✅ Gestion des providers (mécaniciens, tuners, vendeurs)
- ✅ Système de jobs avec auto-close après 24h
- ✅ Plans d'abonnement
- ✅ WebSocket pour temps réel
- ✅ Intégration paiement (CMI, Orange Money, inwi Money)
- ✅ Notifications (SMS, WhatsApp, Push)
- ✅ Géolocalisation
- ✅ Background workers
- ✅ Tests complets

---

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py                    # Application FastAPI principale
│   ├── config.py                  # Configuration
│   ├── database.py                # Connexion PostgreSQL
│   ├── models/                    # Modèles SQLAlchemy
│   │   └── __init__.py           # Tous les modèles (User, Provider, Job, Plan, etc.)
│   ├── websocket/                 # WebSocket handlers
│   │   └── manager.py            # Connection manager
│   ├── workers/                   # Background workers
│   │   └── auto_close.py         # Auto-close des jobs après 24h
│   └── integrations/              # Intégrations externes
│       ├── payment_service.py    # CMI, Orange Money, inwi Money
│       └── notification_service.py # SMS, WhatsApp, Push
├── tests/
│   └── test_api.py               # Tests unitaires
├── requirements.txt              # Dépendances Python
├── .env.example                  # Variables d'environnement
└── README.md                     # Documentation
```

---

## 🚀 Installation et Déploiement

### 1. Prérequis

```bash
# Python 3.9+
python --version

# PostgreSQL 13+
psql --version

# Redis 6+
redis-server --version
```

### 2. Installation

```bash
# Cloner le repository
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos credentials
nano .env
```

**Variables essentielles à configurer :**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mecago

# JWT
SECRET_KEY=your-super-secret-key-change-this

# Payment (si disponible)
CMI_API_KEY=your-cmi-key
ORANGE_MONEY_API_KEY=your-orange-key
INWI_MONEY_API_KEY=your-inwi-key

# Notifications (si disponible)
TWILIO_ACCOUNT_SID=your-twilio-sid
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
FIREBASE_SERVER_KEY=your-firebase-key
```

### 4. Base de Données

```bash
# Créer la base de données
createdb mecago

# Ou avec psql
psql -U postgres
CREATE DATABASE mecago;
\q

# Exécuter les migrations (si Alembic configuré)
alembic upgrade head

# Ou créer les tables automatiquement (développement)
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### 5. Lancer le Serveur

```bash
# Développement
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Accéder à l'API :**
- API : http://localhost:8000
- Docs Swagger : http://localhost:8000/docs
- Docs ReDoc : http://localhost:8000/redoc

### 6. Lancer le Background Worker

```bash
# Dans un autre terminal
python -m app.workers.auto_close
```

Ce worker vérifie toutes les 5 minutes les jobs à auto-clôturer.

---

## 📡 API Endpoints

### Authentication

```bash
# Inscription
POST /api/v1/auth/register
{
  "phone": "+212600000001",
  "password": "password123",
  "full_name": "John Doe",
  "role": "customer"
}

# Connexion
POST /api/v1/auth/login
{
  "phone": "+212600000001",
  "password": "password123"
}

# Réponse
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "phone": "+212600000001",
    "full_name": "John Doe",
    "role": "customer"
  }
}
```

### Providers

```bash
# Liste des providers
GET /api/v1/providers?type=mechanic&city=Casablanca&verified=true

# Profil d'un provider
GET /api/v1/providers/ahmed-benali

# Créer un profil provider
POST /api/v1/providers
Headers: Authorization: Bearer <token>
{
  "type": "mechanic",
  "slug": "ahmed-benali",
  "name": "Ahmed Benali",
  "bio": "Expert en réparation auto",
  "city": "Casablanca"
}
```

### Jobs

```bash
# Liste des jobs
GET /api/v1/jobs?status=in_progress
Headers: Authorization: Bearer <token>

# Détails d'un job
GET /api/v1/jobs/123

# Mettre à jour le statut
PUT /api/v1/jobs/123/status
Headers: Authorization: Bearer <token>
{
  "new_status": "in_progress"
}

# Clôturer un job
POST /api/v1/jobs/123/close
Headers: Authorization: Bearer <token>
{
  "final_amount": 50000,
  "before_photos": ["url1", "url2"],
  "after_photos": ["url3", "url4"]
}
```

### Plans

```bash
# Liste des plans
GET /api/v1/plans?audience=client

# Détails d'un plan
GET /api/v1/plans/client-gold

# S'abonner
POST /api/v1/plans/subscribe
Headers: Authorization: Bearer <token>
{
  "plan_slug": "client-gold",
  "payment_method": "cmi"
}
```

### WebSocket

```javascript
// Connexion WebSocket pour les demandes en temps réel
const ws = new WebSocket('ws://localhost:8000/ws/requests');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Nouvelle demande:', data);
};

// Connexion WebSocket pour un job spécifique
const jobWs = new WebSocket('ws://localhost:8000/ws/jobs/123');
```

---

## 🧪 Tests

```bash
# Exécuter tous les tests
pytest tests/ -v

# Exécuter avec couverture
pytest tests/ --cov=app --cov-report=html

# Ouvrir le rapport de couverture
open htmlcov/index.html
```

**Tests inclus :**
- ✅ Authentication (register, login, duplicate phone)
- ✅ Providers (create, list, get by slug)
- ✅ Jobs (list, get details, update status)
- ✅ Plans (list, get by slug)
- ✅ Auto-close logic
- ✅ Health check

---

## 🔄 Background Workers

### Auto-close Worker

Le worker `auto_close.py` vérifie toutes les 5 minutes :

1. **Jobs à auto-clôturer** (après 24h)
   - Statut : `IN_PROGRESS`
   - Deadline dépassé
   - Pas de dispute ouverte
   - Pas de quote update en attente

2. **Rappels envoyés**
   - 12h avant deadline
   - 4h avant deadline
   - 1h avant deadline (URGENT)

3. **Actions lors de l'auto-close**
   - Statut → `AUTO_CLOSED`
   - Commission de 10% prélevée
   - Wallet du provider débité
   - Provider mis hors ligne si wallet < minimum
   - Notifications envoyées

```bash
# Lancer le worker
python -m app.workers.auto_close

# Ou avec systemd (production)
sudo systemctl start mecago-worker
sudo systemctl enable mecago-worker
```

---

## 💳 Intégrations Paiement

### CMI (Centre Monétique Interbancaire)

```python
from app.integrations.payment_service import payment_service

# Créer un paiement
result = await payment_service.create_payment(
    amount=50000,  # 500 MAD en centimes
    method="cmi",
    customer_id=123,
    description="Abonnement Gold"
)

# Résultat
{
  "payment_id": "cmi_123_1234567890",
  "status": "pending",
  "redirect_url": "https://payment.cmi.ma/pay?session_id=123",
  "amount": 50000
}
```

### Orange Money

```python
result = await payment_service.create_payment(
    amount=50000,
    method="orange_money",
    customer_id=123
)
```

### inwi Money

```python
result = await payment_service.create_payment(
    amount=50000,
    method="inwi_money",
    customer_id=123
)
```

---

## 📱 Notifications

### SMS (Twilio)

```python
from app.integrations.notification_service import notification_service

await notification_service.send_notification(
    user_id=123,
    notification_type="job_reminder",
    message="Votre job commence dans 1 heure",
    channel="sms",
    phone="+212600000001"
)
```

### WhatsApp

```python
await notification_service.send_notification(
    user_id=123,
    notification_type="job_update",
    message="Le mécanicien est en route",
    channel="whatsapp",
    phone="+212600000001",
    data={"job_id": 456}
)
```

### Push Notifications (Firebase)

```python
await notification_service.send_notification(
    user_id=123,
    notification_type="new_offer",
    message="Vous avez reçu une nouvelle offre",
    channel="push",
    data={"request_id": 789}
)
```

---

## 🗺️ Géolocalisation

```python
from app.integrations.maps_service import geolocation_service

# Trouver les providers proches
providers = await geolocation_service.find_nearby_providers(
    lat=33.5731,
    lng=-7.5898,
    radius_km=10,
    provider_type="mechanic"
)

# Calculer la distance
distance = await geolocation_service.calculate_distance(
    lat1=33.5731, lng1=-7.5898,
    lat2=33.5800, lng2=-7.6000
)
```

---

## 🔒 Sécurité

### Authentification JWT

```python
from app.main import get_current_user

@app.get("/api/v1/protected")
def protected_endpoint(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.full_name}"}
```

### CORS

Configuré dans `app/main.py` :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limiting

À implémenter avec `slowapi` :

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/v1/public")
@limiter.limit("100/minute")
def public_endpoint(request: Request):
    return {"data": "public"}
```

---

## 📊 Monitoring

### Logs Structurés

```python
import structlog

logger = structlog.get_logger()

logger.info(
    "job_created",
    job_id=123,
    customer_id=456,
    provider_id=789,
    amount=50000
)
```

### Health Checks

```bash
# Vérifier l'état de l'API
curl http://localhost:8000/health

# Réponse
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 🐳 Docker

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mecago
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mecago
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build: .
    command: python -m app.workers.auto_close
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mecago
    depends_on:
      - db
```

### Build et Run

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f api

# Stop
docker-compose down
```

---

## 🚀 Déploiement Production

### Sur DigitalOcean

1. **Créer un Droplet**
   - Ubuntu 22.04
   - 2GB RAM minimum
   - 50GB SSD

2. **Installer les dépendances**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv postgresql redis-server nginx
   ```

3. **Cloner le repository**
   ```bash
   git clone https://github.com/your-repo/mecago-backend.git
   cd mecago-backend
   ```

4. **Configurer l'environnement**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   nano .env  # Éditer avec les valeurs de production
   ```

5. **Créer la base de données**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE mecago;
   CREATE USER mecago WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE mecago TO mecago;
   \q
   ```

6. **Configurer Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.mecago.app;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Configurer HTTPS**
   ```bash
   sudo certbot --nginx -d api.mecago.app
   ```

8. **Créer un service systemd**
   ```bash
   sudo nano /etc/systemd/system/mecago-api.service
   ```

   ```ini
   [Unit]
   Description=mecaGO API
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/path/to/backend
   ExecStart=/path/to/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

9. **Démarrer le service**
   ```bash
   sudo systemctl start mecago-api
   sudo systemctl enable mecago-api
   ```

10. **Démarrer le worker**
    ```bash
    sudo nano /etc/systemd/system/mecago-worker.service
    ```

    ```ini
    [Unit]
    Description=mecaGO Worker
    After=network.target

    [Service]
    User=www-data
    WorkingDirectory=/path/to/backend
    ExecStart=/path/to/backend/venv/bin/python -m app.workers.auto_close
    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

    ```bash
    sudo systemctl start mecago-worker
    sudo systemctl enable mecago-worker
    ```

---

## 📈 Performance

### Optimisations

1. **Database Indexes**
   ```sql
   CREATE INDEX idx_users_phone ON users(phone);
   CREATE INDEX idx_providers_slug ON provider_profiles(slug);
   CREATE INDEX idx_jobs_status ON jobs(status);
   ```

2. **Redis Caching**
   ```python
   from redis import Redis
   
   redis_client = Redis.from_url(settings.REDIS_URL)
   
   # Cache les providers pour 1 heure
   providers = redis_client.get("providers:casablanca")
   if not providers:
       providers = db.query(ProviderProfile).filter(...).all()
       redis_client.setex("providers:casablanca", 3600, json.dumps(providers))
   ```

3. **Connection Pooling**
   ```python
   engine = create_engine(
       settings.DATABASE_URL,
       pool_size=20,
       max_overflow=10,
       pool_pre_ping=True
   )
   ```

---

## 🐛 Dépannage

### Erreur : "Connection refused"

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Vérifier que Redis tourne
sudo systemctl status redis

# Vérifier les logs
tail -f /var/log/mecago/api.log
```

### Erreur : "Table does not exist"

```bash
# Créer les tables
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### Erreur : "Worker ne démarre pas"

```bash
# Vérifier les logs du worker
journalctl -u mecago-worker -f

# Redémarrer le worker
sudo systemctl restart mecago-worker
```

---

## 📚 Ressources

- **Documentation API** : http://localhost:8000/docs
- **FastAPI** : https://fastapi.tiangolo.com
- **SQLAlchemy** : https://docs.sqlalchemy.org
- **PostgreSQL** : https://www.postgresql.org/docs
- **Redis** : https://redis.io/docs

---

## ✅ Checklist de Déploiement

- [ ] Installer Python 3.9+
- [ ] Installer PostgreSQL 13+
- [ ] Installer Redis 6+
- [ ] Cloner le repository
- [ ] Configurer `.env`
- [ ] Créer la base de données
- [ ] Installer les dépendances
- [ ] Créer les tables
- [ ] Lancer l'API
- [ ] Lancer le worker
- [ ] Configurer Nginx
- [ ] Configurer HTTPS
- [ ] Tester les endpoints
- [ ] Configurer le monitoring
- [ ] Configurer les backups

---

**Le backend mecaGO est prêt pour la production !** 🚀
