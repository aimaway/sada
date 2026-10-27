# 🏗️ Architecture Technique - MécaCasablanca

## 📊 Vue d'Ensemble

Cette document décrit l'architecture technique complète de MécaCasablanca, incluant la gestion des rôles, la séparation des comptes et l'intégration mobile.

---

## 🎯 Architecture Recommandée

### Une Seule Application avec Gestion des Rôles

```
┌─────────────────────────────────────────────────────────────┐
│                    MécaCasablanca App                        │
│                   (React Native)                            │
├─────────────────────────────────────────────────────────────┤
│  Authentification                                           │
│  ├── Sélection du rôle                                      │
│  ├── Login (Phone + OTP)                                    │
│  └── JWT Token                                              │
├─────────────────────────────────────────────────────────────┤
│  Navigation par Rôle                                        │
│  ├── Client Navigator                                       │
│  ├── Mécanicien Navigator                                   │
│  ├── Vendeur Navigator                                      │
│  ├── Tuner Navigator                                        │
│  └── Admin Navigator                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Backend (FastAPI)                     │
├─────────────────────────────────────────────────────────────┤
│  Authentication & Authorization                             │
│  ├── JWT Validation                                         │
│  ├── Role-based Access Control (RBAC)                       │
│  └── Permission Checks                                      │
├─────────────────────────────────────────────────────────────┤
│  Business Logic                                             │
│  ├── Customer Service                                       │
│  ├── Mechanic Service                                       │
│  ├── Seller Service                                         │
│  ├── Tuner Service                                          │
│  └── Admin Service                                          │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── PostgreSQL (Users, Roles, Permissions)                │
│  ├── Redis (Cache, Sessions)                                │
│  └── S3 (Files, Images)                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 Gestion des Rôles et Permissions

### Modèle de Données

```sql
-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'mechanic', 'seller', 'tuner', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Métadonnées spécifiques au rôle
    profile_data JSONB, -- Stocke les données spécifiques au rôle
    
    -- Index
    INDEX idx_users_phone (phone),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
);

-- Table des permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(role, resource, action)
);

-- Table des sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    device_info JSONB,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_token (token)
);
```

### Système de Permissions par Rôle

```python
# backend/app/core/permissions.py

ROLE_PERMISSIONS = {
    'customer': {
        'requests': ['create', 'read', 'update'],
        'offers': ['read'],
        'jobs': ['read'],
        'documents': ['create', 'read', 'update', 'delete'],
        'wallet': ['read', 'create'],  # read balance, create top-up
        'reviews': ['create', 'read'],
        'profile': ['read', 'update'],
    },
    'mechanic': {
        'requests': ['read'],  # Voir les demandes reçues
        'offers': ['create', 'read', 'update'],
        'jobs': ['read', 'update'],  # Mettre à jour le statut
        'wallet': ['read'],  # Voir les gains
        'reviews': ['read'],
        'profile': ['read', 'update'],
        'certificates': ['create', 'read', 'update'],
        'skills': ['create', 'read', 'update', 'delete'],
    },
    'seller': {
        'products': ['create', 'read', 'update', 'delete'],
        'orders': ['read', 'update'],
        'partnerships': ['read', 'create'],
        'wallet': ['read'],
        'reviews': ['read'],
        'profile': ['read', 'update'],
    },
    'tuner': {
        'stages': ['create', 'read', 'update', 'delete'],
        'gallery': ['create', 'read', 'update', 'delete'],
        'videos': ['create', 'read', 'update', 'delete'],
        'requests': ['read'],
        'jobs': ['read', 'update'],
        'wallet': ['read'],
        'reviews': ['read'],
        'profile': ['read', 'update'],
    },
    'admin': {
        'users': ['read', 'update', 'delete'],
        'requests': ['read', 'update'],
        'jobs': ['read', 'update'],
        'reviews': ['read', 'delete'],
        'settings': ['read', 'update'],
        'reports': ['read', 'update'],
        'all': ['create', 'read', 'update', 'delete'],  # Super admin
    },
}

def check_permission(user_role: str, resource: str, action: str) -> bool:
    """Vérifie si un rôle a la permission d'effectuer une action sur une ressource"""
    if user_role not in ROLE_PERMISSIONS:
        return False
    
    permissions = ROLE_PERMISSIONS[user_role]
    
    # Vérifier la permission spécifique
    if resource in permissions:
        return action in permissions[resource]
    
    # Vérifier les permissions globales (admin)
    if 'all' in permissions:
        return action in permissions['all']
    
    return False
```

---

## 🔐 Authentification et Autorisation

### Flow d'Authentification

```
1. Sélection du rôle
   └─> POST /api/auth/select-role
       Body: { role: 'customer' }
       Response: { session_id: '...' }

2. Envoi OTP
   └─> POST /api/auth/send-otp
       Body: { phone: '+212600000099', session_id: '...' }
       Response: { message: 'OTP sent' }

3. Vérification OTP
   └─> POST /api/auth/verify-otp
       Body: { phone: '+212600000099', otp: '123456', session_id: '...' }
       Response: { 
           token: 'jwt_token',
           refresh_token: 'refresh_token',
           user: { id, role, full_name, ... }
       }

4. Accès aux ressources
   └─> GET /api/customer/home
       Headers: { Authorization: 'Bearer jwt_token' }
       Response: { data: {...} }
```

### Middleware d'Autorisation

```python
# backend/app/core/auth.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.permissions import check_permission

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Récupère l'utilisateur actuel à partir du JWT"""
    try:
        payload = jwt.decode(
            credentials.credentials, 
            SECRET_KEY, 
            algorithms=[ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def require_permission(resource: str, action: str):
    """Décorateur pour vérifier les permissions"""
    async def permission_checker(
        current_user: User = Depends(get_current_user)
    ):
        if not check_permission(current_user.role, resource, action):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
        return current_user
    return permission_checker

# Utilisation dans les routes
@router.get("/customer/home")
async def customer_home(
    current_user: User = Depends(require_permission("profile", "read"))
):
    # Seul un client peut accéder à cette route
    if current_user.role != 'customer':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    return {"message": "Welcome customer"}
```

---

## 📱 Architecture Mobile

### Structure des Écrans par Rôle

```
App
├── Auth Screens
│   ├── RoleSelectionScreen
│   ├── AppDownloadScreen (pour clients)
│   ├── LoginScreen
│   └── OTPVerificationScreen
│
├── Customer Screens
│   ├── CustomerHomeScreen
│   ├── NewRequestScreen
│   ├── RequestDetailsScreen
│   ├── OffersScreen
│   ├── JobTrackingScreen
│   ├── ChatScreen
│   ├── DocumentsScreen
│   ├── WalletScreen
│   ├── ProfileScreen
│   └── SettingsScreen
│
├── Mechanic Screens
│   ├── MechanicHomeScreen
│   ├── RequestsListScreen
│   ├── RequestDetailsScreen
│   ├── NavigationScreen
│   ├── JobStatusScreen
│   ├── WalletScreen
│   ├── ProfileScreen
│   ├── SkillsScreen
│   ├── CertificatesScreen
│   └── SettingsScreen
│
├── Seller Screens
│   ├── SellerHomeScreen
│   ├── ProductsScreen
│   ├── ProductDetailsScreen
│   ├── OrdersScreen
│   ├── OrderDetailsScreen
│   ├── PartnershipsScreen
│   ├── WalletScreen
│   ├── ProfileScreen
│   └── SettingsScreen
│
├── Tuner Screens
│   ├── TunerHomeScreen
│   ├── StagesScreen
│   ├── StageDetailsScreen
│   ├── GalleryScreen
│   ├── VideosScreen
│   ├── RequestsScreen
│   ├── WalletScreen
│   ├── ProfileScreen
│   └── SettingsScreen
│
└── Admin Screens
    ├── AdminHomeScreen
    ├── UsersScreen
    ├── UserDetailsScreen
    ├── RequestsScreen
    ├── JobsScreen
    ├── ReportsScreen
    ├── SettingsScreen
    └── AnalyticsScreen
```

### Navigation par Rôle

```typescript
// src/navigation/RootNavigator.tsx

import { useSelector } from 'react-redux';
import { CustomerNavigator } from './CustomerNavigator';
import { MechanicNavigator } from './MechanicNavigator';
import { SellerNavigator } from './SellerNavigator';
import { TunerNavigator } from './TunerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { AuthNavigator } from './AuthNavigator';

export const RootNavigator = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  switch (user.role) {
    case 'customer':
      return <CustomerNavigator />;
    case 'mechanic':
      return <MechanicNavigator />;
    case 'seller':
      return <SellerNavigator />;
    case 'tuner':
      return <TunerNavigator />;
    case 'admin':
      return <AdminNavigator />;
    default:
      return <AuthNavigator />;
  }
};
```

---

## 🗄️ Séparation des Données

### Stratégie de Séparation

Bien que tous les utilisateurs soient dans la même table `users`, les données spécifiques à chaque rôle sont stockées dans des tables séparées :

```sql
-- Données spécifiques aux clients
CREATE TABLE customer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    loyalty_points INTEGER DEFAULT 0,
    subscription VARCHAR(50),
    total_jobs INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    favorite_mechanics UUID[],
    vehicles JSONB
);

-- Données spécifiques aux mécaniciens
CREATE TABLE mechanic_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    years_experience INTEGER,
    rating_avg DECIMAL(3,2),
    jobs_completed INTEGER,
    response_time_min INTEGER,
    completion_rate DECIMAL(5,2),
    wallet_balance INTEGER,
    certificates JSONB,
    skills TEXT[],
    badges TEXT[],
    service_radius_km INTEGER,
    is_online BOOLEAN
);

-- Données spécifiques aux vendeurs
CREATE TABLE seller_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    shop_name VARCHAR(255),
    description TEXT,
    total_sales INTEGER,
    total_products INTEGER,
    years_active INTEGER,
    partnered_mechanics UUID[],
    partnered_tuners UUID[],
    delivery_radius_km INTEGER,
    subscription VARCHAR(50)
);

-- Données spécifiques aux tuners
CREATE TABLE tuner_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    shop_name VARCHAR(255),
    description TEXT,
    total_preparations INTEGER,
    years_experience INTEGER,
    stages JSONB,
    certifications TEXT[],
    gallery JSONB,
    videos JSONB
);

-- Données spécifiques aux admins
CREATE TABLE admin_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    admin_level VARCHAR(50), -- 'super_admin', 'moderator', 'support'
    permissions JSONB,
    last_activity TIMESTAMP
);
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **JWT Tokens**
   - Access token : 15 minutes
   - Refresh token : 7 jours
   - Stockage sécurisé (Keychain iOS, Keystore Android)

2. **Validation des Rôles**
   - Vérification côté backend à chaque requête
   - Middleware d'autorisation
   - Logs d'audit

3. **Protection des Données**
   - Chiffrement des données sensibles
   - HTTPS obligatoire
   - Rate limiting

4. **Sécurité Mobile**
   - Certificate pinning
   - Jailbreak/Root detection
   - Biometric authentication

---

## 📊 Monitoring et Analytics

### Métriques à Suivre

```typescript
// Analytics par rôle
const metrics = {
  customer: {
    total_requests: number,
    completed_jobs: number,
    average_rating: number,
    total_spent: number,
  },
  mechanic: {
    total_offers: number,
    accepted_offers: number,
    completed_jobs: number,
    total_earned: number,
    average_rating: number,
  },
  seller: {
    total_products: number,
    total_sales: number,
    total_revenue: number,
    partnerships_count: number,
  },
  tuner: {
    total_preparations: number,
    completed_jobs: number,
    total_revenue: number,
    average_rating: number,
  },
};
```

---

## 🚀 Déploiement

### Backend
- **Hébergement** : AWS / DigitalOcean / OVH
- **Base de données** : PostgreSQL (managed)
- **Cache** : Redis (managed)
- **Storage** : S3 / MinIO
- **CDN** : CloudFlare

### Mobile
- **App Store** : Apple Developer Account ($99/an)
- **Google Play** : Google Play Console ($25 one-time)
- **CI/CD** : GitHub Actions / Bitrise
- **Testing** : Firebase Test Lab

---

## 📈 Scalabilité

### Architecture Scalable

```
Load Balancer
    ↓
API Gateway
    ↓
┌──────────┬──────────┬──────────┐
│ Service  │ Service  │ Service  │
│ Auth     │ Customer │ Mechanic │
└──────────┴──────────┴──────────┘
    ↓
Database Cluster (Primary + Replicas)
    ↓
Cache Layer (Redis Cluster)
```

### Optimisations

1. **Database**
   - Indexation appropriée
   - Query optimization
   - Connection pooling

2. **Cache**
   - Redis pour les sessions
   - CDN pour les assets
   - API response caching

3. **API**
   - Rate limiting
   - Pagination
   - Async processing

---

## 🎯 Conclusion

### Recommandations Finales

1. **Architecture** : Une seule application avec gestion des rôles
2. **Backend** : FastAPI + PostgreSQL + Redis
3. **Mobile** : React Native (code partagé avec web)
4. **Sécurité** : JWT + RBAC + Encryption
5. **Scalabilité** : Microservices ready

### Prochaines Étapes

1. ✅ Valider l'architecture
2. ✅ Créer le schéma de base de données
3. ✅ Implémenter l'authentification
4. ✅ Développer les modules par rôle
5. ✅ Tester sur devices réels
6. ✅ Déployer sur les stores

---

**Architecture prête pour le développement !** 🚀
