# 🚀 Guide de Déploiement Complet - mecaGO sur Namecheap/GoDaddy

## 📋 Ce Que Vous Avez

✅ **Nom de domaine** : mecaGo.app (acheté)  
✅ **Application web** : mecaGO (PWA complète)  
✅ **Build prêt** : Dossier `dist/` généré  

## 🎯 Ce Que Vous Devez Faire

### Architecture Requise

```
Utilisateurs
    ↓
https://mecago.app (Frontend PWA)
    ↓
https://api.mecago.app (Backend API)
    ↓
Base de données PostgreSQL
    ↓
Redis (Cache + WebSocket)
```

---

## 💰 Budget Mensuel Recommandé

### Option 1 : Économique (~200 MAD/mois)

| Service | Fournisseur | Coût/mois |
|---------|-------------|-----------|
| **Frontend** | Namecheap Shared Hosting | 30 MAD |
| **Backend** | DigitalOcean Droplet 1GB | 70 MAD |
| **Base de données** | DigitalOcean (inclus) | 0 MAD |
| **Domaine** | mecaGo.app (déjà acheté) | 12 MAD |
| **SSL** | Let's Encrypt | 0 MAD |
| **TOTAL** | | **~112 MAD/mois** |

### Option 2 : Recommandée (~350 MAD/mois)

| Service | Fournisseur | Coût/mois |
|---------|-------------|-----------|
| **Frontend** | Namecheap Shared Hosting | 30 MAD |
| **Backend** | DigitalOcean Droplet 2GB | 140 MAD |
| **Base de données** | DigitalOcean Managed DB | 100 MAD |
| **Domaine** | mecaGo.app (déjà acheté) | 12 MAD |
| **SSL** | Let's Encrypt | 0 MAD |
| **TOTAL** | | **~282 MAD/mois** |

### Option 3 : Performance (~600 MAD/mois)

| Service | Fournisseur | Coût/mois |
|---------|-------------|-----------|
| **Frontend** | Vercel Pro | 140 MAD |
| **Backend** | DigitalOcean Droplet 4GB | 280 MAD |
| **Base de données** | DigitalOcean Managed DB | 100 MAD |
| **Redis** | DigitalOcean Managed Redis | 80 MAD |
| **Domaine** | mecaGo.app (déjà acheté) | 12 MAD |
| **TOTAL** | | **~612 MAD/mois** |

---

## 🛠️ Étape 1 : Préparer le Build

### Sur Votre Ordinateur

```bash
# 1. Builder l'application
npm run build

# 2. Vérifier le dossier dist/
ls dist/
# Vous devriez voir :
# - index.html
# - assets/
# - manifest.json
# - sw.js
# - favicon.svg
```

### Résultat

Le dossier `dist/` contient tous les fichiers statiques de votre application.

---

## 🌐 Étape 2 : Déployer le Frontend sur Namecheap

### Option A : Via cPanel (Recommandé)

#### 2.1 Se connecter à cPanel

1. Aller sur https://www.namecheap.com
2. Se connecter à votre compte
3. Aller dans "Dashboard" → "Hosting List"
4. Cliquer sur "Go to cPanel"

#### 2.2 Uploader les fichiers

1. Dans cPanel, aller dans **"File Manager"**
2. Naviguer vers le dossier `public_html/`
3. **Supprimer** le fichier `index.html` par défaut (s'il existe)
4. Cliquer sur **"Upload"** en haut
5. **Zipper** le contenu du dossier `dist/` sur votre ordinateur :
   ```bash
   cd dist
   zip -r ../mecago-frontend.zip .
   ```
6. Uploader le fichier `mecago-frontend.zip`
7. Dans cPanel, cliquer sur **"Extract"** pour décompresser

#### 2.3 Configurer .htaccess pour SPA

Créer un fichier `.htaccess` dans `public_html/` :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Handle SPA routing
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compress files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>
```

#### 2.4 Tester le Frontend

1. Ouvrir https://mecago.app
2. Vérifier que la landing page s'affiche
3. Tester la navigation
4. Tester l'installation PWA sur mobile

---

## 🖥️ Étape 3 : Déployer le Backend sur DigitalOcean

### 3.1 Créer un Droplet

1. Aller sur https://cloud.digitalocean.com
2. Cliquer sur **"Create"** → **"Droplets"**
3. Configurer :
   - **Image** : Ubuntu 22.04 LTS
   - **Plan** : Basic (1GB ou 2GB RAM)
   - **Region** : Frankfurt (proche du Maroc)
   - **Authentication** : SSH Key (recommandé)
   - **Hostname** : api.mecago.app
4. Cliquer sur **"Create Droplet"**

### 3.2 Se connecter au serveur

```bash
# Depuis votre ordinateur
ssh root@VOTRE_IP_DROPLET
```

### 3.3 Installer les dépendances

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
apt install docker-compose -y

# Installer Nginx
apt install nginx -y

# Installer Certbot (pour HTTPS)
apt install certbot python3-certbot-nginx -y
```

### 3.4 Cloner le Backend

```bash
# Installer Git
apt install git -y

# Cloner le repository
cd /var/www
git clone VOTRE_REPO_URL backend
cd backend
```

### 3.5 Configurer les Variables d'Environnement

Créer un fichier `.env` :

```bash
nano .env
```

Contenu :

```env
# Application
APP_NAME=mecaGO API
APP_VERSION=1.0.0
DEBUG=False
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://mecago:VOTRE_MOT_DE_PASSE@localhost:5432/mecago

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=VOTRE_CLE_SECRETE_TRES_LONGUE_ET_ALEATOIRE
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["https://mecago.app", "https://www.mecago.app"]

# SMS/WhatsApp
SMS_PROVIDER=mock
SMS_API_KEY=

# Maps
MAPS_PROVIDER=mock
MAPS_API_KEY=

# Demo mode
DEMO_MODE=False
```

### 3.6 Lancer avec Docker Compose

Créer un fichier `docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mecago
      POSTGRES_USER: mecago
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://mecago:${DB_PASSWORD}@db:5432/mecago
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

Lancer :

```bash
# Définir le mot de passe DB
export DB_PASSWORD=VOTRE_MOT_DE_PASSE_TRES_SECURE

# Lancer les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier que tout fonctionne
docker-compose -f docker-compose.prod.yml ps
```

### 3.7 Configurer Nginx comme Reverse Proxy

Créer un fichier de configuration Nginx :

```bash
nano /etc/nginx/sites-available/api.mecago.app
```

Contenu :

```nginx
server {
    listen 80;
    server_name api.mecago.app;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Activer la configuration :

```bash
ln -s /etc/nginx/sites-available/api.mecago.app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3.8 Configurer HTTPS avec Let's Encrypt

```bash
certbot --nginx -d api.mecago.app
```

Suivre les instructions :
- Email : votre@email.com
- Agree : Y
- Redirect : 2 (redirect HTTP to HTTPS)

### 3.9 Tester le Backend

```bash
curl https://api.mecago.app/health
# Devrait retourner : {"status":"healthy","environment":"production"}
```

---

## 🌍 Étape 4 : Configurer le DNS

### Dans Namecheap/GoDaddy

Ajouter les enregistrements DNS suivants :

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | @ | IP_DU_SERVEUR_FRONTEND | Automatic |
| **A** | www | IP_DU_SERVEUR_FRONTEND | Automatic |
| **A** | api | IP_DU_SERVEUR_BACKEND | Automatic |
| **CNAME** | * | mecago.app | Automatic |

**Attendre 5-30 minutes pour la propagation DNS.**

### Vérifier la propagation

```bash
# Depuis votre ordinateur
ping mecago.app
# Devrait retourner l'IP du serveur frontend

ping api.mecago.app
# Devrait retourner l'IP du serveur backend
```

---

## 🔐 Étape 5 : Configurer HTTPS sur le Frontend

### Sur Namecheap

1. Se connecter à cPanel
2. Aller dans **"SSL/TLS Status"**
3. Sélectionner `mecago.app` et `www.mecago.app`
4. Cliquer sur **"Run AutoSSL"**
5. Attendre que le certificat soit généré

### Vérifier

```bash
curl -I https://mecago.app
# Devrait retourner : HTTP/2 200
```

---

## 🧪 Étape 6 : Tester en Production

### Checklist de Test

- [ ] https://mecago.app s'affiche correctement
- [ ] https://www.mecago.app redirige vers https://mecago.app
- [ ] L'installation PWA fonctionne sur Android
- [ ] L'installation PWA fonctionne sur iOS
- [ ] https://api.mecago.app/health retourne "healthy"
- [ ] Le chat fonctionne en temps réel
- [ ] La géolocalisation fonctionne
- [ ] Les notifications push fonctionnent
- [ ] Le paiement fonctionne (si configuré)

### Test sur Mobile

1. **Android** :
   - Ouvrir Chrome
   - Aller sur https://mecago.app
   - Menu ⋮ → "Ajouter à l'écran d'accueil"
   - Ouvrir l'app depuis l'icône
   - Tester toutes les fonctionnalités

2. **iOS** :
   - Ouvrir Safari
   - Aller sur https://mecago.app
   - Partager □↑ → "Sur l'écran d'accueil"
   - Ouvrir l'app depuis l'icône
   - Tester toutes les fonctionnalités

---

## 📊 Monitoring et Maintenance

### Logs

```bash
# Voir les logs du backend
docker-compose -f docker-compose.prod.yml logs -f api

# Voir les logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Backup

```bash
# Backup de la base de données
docker-compose -f docker-compose.prod.yml exec db pg_dump -U mecago mecago > backup_$(date +%Y%m%d).sql

# Restaurer
cat backup_20240315.sql | docker-compose -f docker-compose.prod.yml exec -T db psql -U mecago mecago
```

### Mise à Jour

```bash
# Frontend
cd /var/www/public_html
# Uploader le nouveau build via cPanel

# Backend
cd /var/www/backend
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🚨 Dépannage

### Problème : "502 Bad Gateway"

**Cause** : Le backend ne répond pas

**Solution** :
```bash
# Vérifier que Docker tourne
docker-compose -f docker-compose.prod.yml ps

# Redémarrer les services
docker-compose -f docker-compose.prod.yml restart

# Voir les logs
docker-compose -f docker-compose.prod.yml logs api
```

### Problème : "SSL Certificate Error"

**Cause** : Le certificat SSL n'est pas valide

**Solution** :
```bash
# Renouveler le certificat
certbot renew

# Redémarrer Nginx
systemctl restart nginx
```

### Problème : "CORS Error"

**Cause** : Les origines CORS ne sont pas configurées

**Solution** :
Modifier `.env` :
```env
CORS_ORIGINS=["https://mecago.app", "https://www.mecago.app", "http://localhost:5173"]
```

Redémarrer le backend :
```bash
docker-compose -f docker-compose.prod.yml restart api
```

---

## ✅ Checklist Finale de Déploiement

### Infrastructure

- [ ] Serveur frontend configuré (Namecheap)
- [ ] Serveur backend configuré (DigitalOcean)
- [ ] Base de données PostgreSQL installée
- [ ] Redis installé
- [ ] Nginx configuré comme reverse proxy
- [ ] HTTPS activé sur frontend et backend
- [ ] DNS configuré (mecago.app + api.mecago.app)

### Application

- [ ] Frontend déployé (dossier dist/)
- [ ] Backend déployé (Docker)
- [ ] Variables d'environnement configurées
- [ ] Base de données initialisée
- [ ] Service Worker enregistré
- [ ] Manifest.json configuré

### Tests

- [ ] https://mecago.app fonctionne
- [ ] https://api.mecago.app/health retourne "healthy"
- [ ] Installation PWA fonctionne sur Android
- [ ] Installation PWA fonctionne sur iOS
- [ ] Chat en temps réel fonctionne
- [ ] Géolocalisation fonctionne
- [ ] Notifications push fonctionnent
- [ ] Paiement fonctionne (si configuré)

### Sécurité

- [ ] HTTPS obligatoire
- [ ] Mots de passe sécurisés
- [ ] Variables d'environnement protégées
- [ ] Firewall configuré
- [ ] Backup automatique configuré
- [ ] Monitoring des erreurs (Sentry)

---

## 📞 Support

### Documentation

- `ONLINE_OFFLINE_EXPLAINED.md` - Fonctionnement en ligne/hors ligne
- `HOW_TO_INSTALL_PWA.md` - Installation PWA
- `QUICK_START.md` - Démarrage rapide
- `FINAL_SUMMARY.md` - Résumé du projet

### Contacts

- **Namecheap Support** : https://www.namecheap.com/support
- **DigitalOcean Support** : https://www.digitalocean.com/support
- **Documentation technique** : Voir tous les fichiers .md

---

## 🎉 Félicitations !

Votre application **mecaGO** est maintenant déployée et accessible à l'adresse :

**https://mecago.app**

Les utilisateurs peuvent :
1. Aller sur https://mecago.app
2. Installer l'app sur leur téléphone (PWA)
3. Utiliser toutes les fonctionnalités (avec internet)

**Coût total : ~142-282 MAD/mois**  
**Temps de déploiement : 1-2 jours**

---

**mecaGO est prêt pour le lancement !** 🚀
