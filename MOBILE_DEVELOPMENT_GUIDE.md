# 📱 Guide de Développement Mobile - MécaCasablanca

## 🎯 Recommandation d'Architecture

### ✅ Option Recommandée : Une Seule Application avec Gestion des Rôles

**Pourquoi une seule application ?**

1. **Maintenance simplifiée** : Un seul codebase à maintenir
2. **Mises à jour synchronisées** : Toutes les fonctionnalités mises à jour en même temps
3. **Expérience utilisateur cohérente** : Même design et UX pour tous
4. **Coûts réduits** : Moins de développement et de maintenance
5. **Scalabilité** : Facile d'ajouter de nouveaux rôles à l'avenir

**Architecture recommandée :**
```
MécaCasablanca App (une seule app)
├── Authentification
│   └── Sélection du rôle (Client/Mécanicien/Vendeur/Tuner/Admin)
├── Client Module
│   ├── Dashboard client
│   ├── Demandes de réparation
│   ├── Suivi d'interventions
│   ├── Documents
│   ├── Wallet
│   └── Historique
├── Mécanicien Module
│   ├── Dashboard mécanicien
│   ├── Gestion des demandes
│   ├── Profil et compétences
│   ├── Wallet et gains
│   └── Statistiques
├── Vendeur Module
│   ├── Dashboard vendeur
│   ├── Gestion des produits
│   ├── Commandes
│   ├── Partenariats
│   └── Statistiques
├── Tuner Module
│   ├── Dashboard tuner
│   ├── Gestion des stages
│   ├── Galerie avant/après
│   ├── Vidéos
│   └── Statistiques
└── Admin Module
    ├── Dashboard admin
    ├── Gestion des utilisateurs
    ├── Validation des profils
    ├── Statistiques globales
    └── Configuration
```

---

## 🛠️ Technologies Recommandées

### Option 1 : React Native (Recommandé)

**Avantages :**
- ✅ Code partagé avec l'application web (React)
- ✅ Grande communauté et écosystème
- ✅ Performances natives
- ✅ Hot reload pour développement rapide
- ✅ Accès aux APIs natives (caméra, géolocalisation, notifications)

**Stack technique :**
```json
{
  "framework": "React Native",
  "navigation": "React Navigation",
  "state": "Redux Toolkit / Zustand",
  "api": "Axios + React Query",
  "auth": "JWT + Refresh Tokens",
  "storage": "AsyncStorage + SecureStore",
  "maps": "React Native Maps",
  "payments": "Stripe / CMI SDK",
  "notifications": "Firebase Cloud Messaging",
  "analytics": "Firebase Analytics"
}
```

### Option 2 : Flutter

**Avantages :**
- ✅ Performances excellentes
- ✅ UI très personnalisable
- ✅ Hot reload
- ✅ Documentation complète

**Inconvénients :**
- ❌ Courbe d'apprentissage (Dart)
- ❌ Moins de bibliothèques que React Native
- ❌ Nécessite de réécrire toute la logique métier

### Option 3 : Native (Swift + Kotlin)

**Avantages :**
- ✅ Performances maximales
- ✅ Accès complet aux APIs natives

**Inconvénients :**
- ❌ Deux codebases à maintenir
- ❌ Coût de développement x2
- ❌ Mises à jour désynchronisées

---

## 📋 Étapes de Développement

### Phase 1 : Setup du Projet (2-3 jours)

#### 1.1 Initialisation React Native
```bash
# Créer le projet
npx react-native@latest init MecaCasablanca

# Installer les dépendances principales
cd MecaCasablanca
npm install @react-navigation/native @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install redux @reduxjs/toolkit react-redux
npm install axios react-query
npm install react-native-maps
npm install @react-native-async-storage/async-storage
npm install react-native-secure-storage
npm install react-native-push-notification
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/messaging

# iOS
cd ios && pod install && cd ..
```

#### 1.2 Structure du Projet
```
MecaCasablanca/
├── src/
│   ├── api/              # API calls
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── requests.ts
│   │   └── ...
│   ├── components/       # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── screens/          # Écrans par rôle
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RoleSelectionScreen.tsx
│   │   ├── customer/
│   │   │   ├── CustomerHomeScreen.tsx
│   │   │   ├── NewRequestScreen.tsx
│   │   │   └── ...
│   │   ├── mechanic/
│   │   │   ├── MechanicHomeScreen.tsx
│   │   │   ├── RequestDetailsScreen.tsx
│   │   │   └── ...
│   │   ├── seller/
│   │   │   ├── SellerHomeScreen.tsx
│   │   │   ├── ProductsScreen.tsx
│   │   │   └── ...
│   │   ├── tuner/
│   │   │   ├── TunerHomeScreen.tsx
│   │   │   ├── StagesScreen.tsx
│   │   │   └── ...
│   │   └── admin/
│   │       ├── AdminHomeScreen.tsx
│   │       ├── UsersScreen.tsx
│   │       └── ...
│   ├── navigation/       # Configuration navigation
│   │   ├── RootNavigator.tsx
│   │   ├── CustomerNavigator.tsx
│   │   ├── MechanicNavigator.tsx
│   │   └── ...
│   ├── store/            # Redux store
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── userSlice.ts
│   │   └── ...
│   ├── utils/            # Utilitaires
│   │   ├── storage.ts
│   │   ├── constants.ts
│   │   └── ...
│   └── types/            # TypeScript types
│       ├── user.ts
│       ├── request.ts
│       └── ...
├── assets/               # Images, fonts, etc.
├── android/              # Configuration Android
├── ios/                  # Configuration iOS
└── package.json
```

### Phase 2 : Authentification (3-4 jours)

#### 2.1 Écran de Sélection de Rôle
```typescript
// src/screens/auth/RoleSelectionScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const roles = [
  { id: 'customer', title: 'Client', icon: '👤', color: '#10B981' },
  { id: 'mechanic', title: 'Mécanicien', icon: '🔧', color: '#3B82F6' },
  { id: 'seller', title: 'Vendeur', icon: '🏪', color: '#8B5CF6' },
  { id: 'tuner', title: 'Tuner', icon: '🏎️', color: '#EF4444' },
  { id: 'admin', title: 'Admin', icon: '🛡️', color: '#64748B' },
];

export const RoleSelectionScreen = ({ navigation }) => {
  const handleRoleSelect = (roleId) => {
    if (roleId === 'customer') {
      navigation.navigate('AppDownload');
    } else {
      navigation.navigate('Login', { role: roleId });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur MécaCasablanca</Text>
      <Text style={styles.subtitle}>Choisissez votre rôle</Text>
      
      <View style={styles.grid}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[styles.card, { borderColor: role.color }]}
            onPress={() => handleRoleSelect(role.id)}
          >
            <Text style={styles.icon}>{role.icon}</Text>
            <Text style={styles.roleTitle}>{role.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
```

#### 2.2 Écran de Téléchargement App (pour clients)
```typescript
// src/screens/auth/AppDownloadScreen.tsx
export const AppDownloadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Téléchargez l'application</Text>
      
      <TouchableOpacity style={styles.storeButton}>
        <Text>🍎 App Store</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.storeButton}>
        <Text>🤖 Google Play</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('CustomerHome')}>
        <Text>Continuer sur le web →</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### 2.3 Gestion de l'Authentification
```typescript
// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/client';

export const login = createAsyncThunk(
  'auth/login',
  async ({ phone, otp, role }: { phone: string; otp: string; role: string }) => {
    const response = await api.post('/auth/login', { phone, otp, role });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
    token: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
    });
  },
});
```

### Phase 3 : Navigation par Rôle (2-3 jours)

```typescript
// src/navigation/RootNavigator.tsx
import { useSelector } from 'react-redux';
import { CustomerNavigator } from './CustomerNavigator';
import { MechanicNavigator } from './MechanicNavigator';
import { SellerNavigator } from './SellerNavigator';
import { TunerNavigator } from './TunerNavigator';
import { AdminNavigator } from './AdminNavigator';

export const RootNavigator = () => {
  const { role } = useSelector((state) => state.auth);

  switch (role) {
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

### Phase 4 : Modules par Rôle (2-3 semaines)

#### 4.1 Module Client
- Dashboard client
- Nouvelle demande (8 services)
- Suivi d'intervention en temps réel
- Chat avec mécanicien
- Gestion des documents
- Wallet et paiements
- Historique et notes

#### 4.2 Module Mécanicien
- Dashboard mécanicien
- Liste des demandes reçues
- Accepter/Refuser une demande
- Navigation vers le client
- Mise à jour du statut
- Wallet et gains
- Profil et compétences

#### 4.3 Module Vendeur
- Dashboard vendeur
- Gestion des produits
- Commandes reçues
- Partenariats mécaniciens
- Statistiques de ventes

#### 4.4 Module Tuner
- Dashboard tuner
- Gestion des stages (1-3)
- Galerie avant/après
- Vidéos de préparations
- Demandes de tuning

#### 4.5 Module Admin
- Dashboard admin
- Gestion des utilisateurs
- Validation des profils
- Statistiques globales
- Configuration plateforme

### Phase 5 : Fonctionnalités Avancées (2-3 semaines)

- Notifications push
- Géolocalisation en temps réel
- Paiement mobile (Orange Money, inwi Money)
- Upload de photos
- Chat en temps réel
- QR codes
- Partage de lien

### Phase 6 : Tests et Déploiement (1-2 semaines)

- Tests unitaires
- Tests d'intégration
- Tests sur devices réels
- Publication sur App Store
- Publication sur Google Play

---

## 📊 Comparaison des Options

| Critère | Une App (Recommandé) | Apps Séparées |
|---------|---------------------|---------------|
| **Coût de développement** | 💰 Faible | 💰💰💰 Élevé |
| **Maintenance** | 🔧 Simple | 🔧🔧🔧 Complexe |
| **Mises à jour** | 🚀 Synchronisées | 🐌 Désynchronisées |
| **Expérience utilisateur** | ✅ Cohérente | ⚠️ Variable |
| **Temps de développement** | ⚡ 2-3 mois | 🐢 6-9 mois |
| **Scalabilité** | ✅ Facile | ⚠️ Complexe |
| **Store approval** | ✅ 1 submission | ⚠️ 4 submissions |

---

## 🎯 Recommandation Finale

### Architecture : **Une Seule Application**

**Rôles gérés :**
1. Client
2. Mécanicien
3. Vendeur
4. Tuner
5. Admin

**Avantages :**
- ✅ Développement plus rapide
- ✅ Maintenance simplifiée
- ✅ Expérience utilisateur cohérente
- ✅ Coûts réduits
- ✅ Mises à jour synchronisées

**Backend :**
- ✅ Une seule API
- ✅ Gestion des rôles et permissions
- ✅ Base de données unifiée
- ✅ Authentification centralisée

---

## 📅 Timeline Estimé

| Phase | Durée | Description |
|-------|-------|-------------|
| **Phase 1** | 2-3 jours | Setup du projet |
| **Phase 2** | 3-4 jours | Authentification |
| **Phase 3** | 2-3 jours | Navigation par rôle |
| **Phase 4** | 2-3 semaines | Modules par rôle |
| **Phase 5** | 2-3 semaines | Fonctionnalités avancées |
| **Phase 6** | 1-2 semaines | Tests et déploiement |
| **TOTAL** | **2-3 mois** | Application complète |

---

## 💰 Budget Estimé

### Option 1 : React Native (Recommandé)
- **Développeur senior** : 15,000-25,000 MAD/mois
- **Durée** : 2-3 mois
- **Total** : 30,000-75,000 MAD

### Option 2 : Flutter
- **Développeur senior** : 15,000-25,000 MAD/mois
- **Durée** : 2-3 mois
- **Total** : 30,000-75,000 MAD

### Option 3 : Native (Swift + Kotlin)
- **2 développeurs seniors** : 30,000-50,000 MAD/mois
- **Durée** : 4-6 mois
- **Total** : 120,000-300,000 MAD

---

## 🚀 Prochaines Étapes

1. **Valider l'architecture** : Une seule app avec gestion des rôles
2. **Choisir la technologie** : React Native recommandé
3. **Recruter l'équipe** : 1 développeur React Native senior
4. **Démarrer le développement** : Phase 1 (Setup)
5. **Tests réguliers** : Chaque semaine
6. **Déploiement** : App Store + Google Play

---

## 📞 Support

Pour toute question sur le développement mobile :
- Documentation React Native : https://reactnative.dev
- Documentation Flutter : https://flutter.dev
- Support technique : support@mecacasablanca.ma

---

**Prêt à démarrer le développement mobile !** 🚀
