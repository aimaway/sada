# 🎮 Démo Frontend - Guide Client

## 📱 Aperçu de l'Application

Bienvenue dans la démo complète de **MécaCasablanca** ! Cette application mobile-first permet aux clients de trouver des mécaniciens vérifiés à domicile, de proposer leur prix et de suivre l'intervention en temps réel.

---

## 🚀 Accès Rapide

### 🌐 Landing Page (Next.js SSR)
```bash
cd landing
npm install
npm run dev
```
**URL:** http://localhost:3000

### 📱 Application Mobile (React/Vite)
```bash
cd frontend  # ou le dossier racine
npm install
npm run dev
```
**URL:** http://localhost:5173

### 🔧 Backend API (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m app.scripts.seed_demo
uvicorn app.main:app --reload --port 8000
```
**URL:** http://localhost:8000  
**Docs API:** http://localhost:8000/docs

---

## 👤 Comptes de Démo

### Client (Customer)
- **Téléphone:** +212 600 000 010
- **OTP:** 1234 (mode démo)
- **Nom:** Amine Khalid
- **Véhicule:** Dacia Logan 2019

### Mécanicien Approuvé (Mechanic)
- **Téléphone:** +212 600 000 001
- **OTP:** 1234 (mode démo)
- **Nom:** Ahmed Benali
- **Spécialité:** Toyota, Dacia, Renault
- **Note:** 4.8 ⭐ (145 jobs)

### Vendeur (Seller)
- **Email:** autopieces@demo.ma
- **Password:** demo123
- **Boutique:** AutoPièces Maroc
- **Spécialité:** Huiles, batteries, filtres

### Admin
- **Email:** admin@demo.ma
- **Password:** admin123

---

## 🎬 Scénarios de Démo

### Scénario 1: Client - Demande de Réparation

1. **Accueil Client** (`/customer/home`)
   - Voir la bannière d'alerte "3 documents à renouveler"
   - Cliquer sur "Nouvelle demande"

2. **Créer une Demande** (`/customer/new-request`)
   - Choisir une catégorie (ex: 🔋 Batterie)
   - Décrire le problème
   - Proposer un prix (ex: 250 MAD)
   - Confirmer la localisation

3. **Recevoir des Offres** (`/customer/offers`)
   - Voir les offres arriver en temps réel (simulation)
   - Chaque offre affiche :
     - Photo du mécanicien + badge vérifié
     - Note et nombre de jobs
     - Prix proposé / contre-offre
     - Temps d'arrivée estimé
     - Distance
     - Spécialités et langues
     - Inclut pièces ou main d'œuvre

4. **Voir le Profil du Mécanicien** (`/customer/mechanic-profile/:id`)
   - Statistiques complètes
   - Vérifications (ID, atelier, certificats)
   - Marques et spécialités
   - Avis clients avec photos
   - Garantie offerte

5. **Accepter une Offre**
   - Cliquer sur "Accepter"
   - Voir le mécanicien en route

6. **Suivi en Direct** (`/customer/tracking`)
   - Carte avec position du mécanicien
   - Stepper de statut : Accepté → En route → Arrivé → Diagnostic → En cours → Terminé
   - Chat in-app
   - Appel masqué
   - Partager le trajet (WhatsApp/SMS)

7. **Négociation** (`/customer/negotiation`)
   - Discuter avec le mécanicien
   - Proposer un contre-prix
   - Commander des produits pendant le trajet
   - Panier avec quantités ajustables

8. **Approbation de Changement de Prix**
   - Si le mécanicien trouve un problème supplémentaire
   - Voir le détail avec photos
   - Approuver ou refuser

9. **Paiement** (`/customer/payment`)
   - Voir le détail transparent : main d'œuvre + pièces + frais de service
   - Choisir le mode de paiement : Espèces / Carte / Wallet
   - Ajouter un pourboire (optionnel)
   - Recevoir le reçu PDF

10. **Notation** (`/customer/rate`)
    - Donner 1-5 étoiles
    - Laisser un commentaire
    - Tags rapides (ponctuel, travail propre, prix juste)

### Scénario 2: Notifications & Documents

1. **Notifications** (`/customer/notifications`)
   - Voir les alertes critiques en haut
   - Filtrer : Toutes / Non lues / Documents / Jobs
   - Cliquer sur une notification → redirection automatique

2. **Documents Juridiques** (`/customer/documents`)
   - Voir tous les documents : Permis, Assurance, Contrôle technique, Carte grise, Vignette
   - Statuts : Valide (vert) / Expire bientôt (orange) / Expiré (rouge)
   - Jours restants avant expiration
   - Coût de renouvellement
   - Bouton "Renouveler"

### Scénario 3: Assistant IA

1. **Assistant IA** (`/customer/ai-assistant`)
   - Choisir le type d'input : Photo / Son / Voyant
   - Uploader ou décrire le problème
   - Voir le diagnostic IA
   - Estimation de prix
   - Niveau d'urgence

2. **Scanner de Voyants** (`/customer/warning-scanner`)
   - Pointer la caméra vers un voyant
   - Voir l'explication
   - Niveau d'urgence
   - Coût estimé
   - Action recommandée

### Scénario 4: Entretien & Maintenance

1. **Dashboard Entretien** (`/customer/maintenance`)
   - Check-list quotidienne (5 vérifications)
   - Rappels d'entretien
   - Statistiques (dépenses, interventions, km)

2. **Boutique** (`/customer/shop`)
   - Catalogue de produits
   - Filtrer par catégorie
   - Ajouter au panier
   - Commander

3. **Historique** (`/customer/orders`)
   - Onglets : En cours / Planifiées / Historique
   - Détails des jobs passés
   - Reçus PDF
   - Bouton "Rebooker"

### Scénario 5: Mécanicien

1. **Accueil Mécanicien** (`/mechanic/home`)
   - Cliquer sur l'avatar → Profil détaillé
   - Toggle "En ligne / Hors ligne"
   - Voir les demandes à proximité

2. **Profil Détaillé** (`/mechanic/profile`)
   - Statistiques complètes
   - Expérience & spécialités
   - Zone de service
   - Langues parlées
   - Vérifications
   - Services proposés
   - Garantie

3. **Paramètres Profil** (`/mechanic/profile-settings`)
   - Ajuster le rayon de service (slider 3-25 km)
   - Choisir la garantie (7j / 15j / 30j / 60j)
   - Cocher les services proposés
   - Sélectionner les marques spécialisées
   - Choisir les langues parlées

4. **Wallet** (`/mechanic/wallet`)
   - Voir le solde avec barre de progression
   - Seuil minimum : 50 MAD
   - Alerte si solde insuffisant
   - Commission auto-déduite (10%)
   - Ledger complet
   - Bouton "Recharger"

5. **Voir une Demande** (`/mechanic/request/:id`)
   - Détails de la demande
   - Prix proposé par le client
   - Distance et temps d'arrivée
   - Accepter ou contre-offrir

### Scénario 6: Vendeur

1. **Dashboard Vendeur** (`/seller/dashboard`)
   - Stats : Revenu du jour, Ventes totales
   - Actions rapides : Produits, Commandes, Partenaires, Stats
   - Commandes récentes
   - Mécaniciens partenaires

2. **Produits** (`/seller/products`)
   - Liste des produits avec stock
   - Recherche
   - Ajouter nouveau produit

3. **Commandes** (`/seller/orders`)
   - Filtrer par statut
   - Détails des commandes
   - Actions : Confirmer, Préparer, Envoyer

4. **Partenariats** (`/seller/partnerships`)
   - Liste des mécaniciens partenaires
   - Commission reversée (5-7%)
   - Nombre de références

### Scénario 7: Admin

1. **Dashboard Admin** (`/admin/dashboard`)
   - KPIs : Demandes, Taux acceptation, Jobs terminés, Mécaniciens, Commission
   - Jobs récents
   - Mécaniciens en attente

2. **Vérification** (`/admin/verification`)
   - File d'attente des mécaniciens
   - Documents soumis
   - Approuver / Rejeter

3. **Jobs** (`/admin/requests`)
   - Liste de tous les jobs
   - Filtrage par statut

4. **Users** (`/admin/users`)
   - Liste utilisateurs
   - Suspendre / Réactiver

5. **Settings** (`/admin/settings`)
   - Commission (%, min, max)
   - Seuil wallet minimum
   - Rayon par défaut
   - Expiration demandes

---

## 🎨 Fonctionnalités Clés

### ✅ Bidding Style inDrive
- Client propose un prix
- Mécaniciens acceptent ou contre-offrent
- Client choisit le meilleur offer
- Transparence totale

### ✅ Notifications Documents
- Bannière critique sur accueil
- Alertes d'expiration
- Redirection automatique

### ✅ Profil Mécanicien Enrichi
- Stats complètes
- Vérifications visibles
- Spécialités et marques
- Avis avec photos
- Garantie

### ✅ Wallet Prepaid
- Commission auto-déduite
- Seuil minimum
- Blocage si solde insuffisant
- Ledger complet

### ✅ Anti-Bypassing
- Numéros masqués
- Chat in-app obligatoire
- Récompenses fidélité

### ✅ Spécificités Maroc
- MAD (Dirham)
- Plaques marocaines
- FR / AR / DARIJA
- Quartiers : Derb Ghallef, Ain Sebaa, Maarif

### ✅ Assistant IA
- Diagnostic par photo/son
- Scanner de voyants
- Estimation de prix
- Niveau d'urgence

---

## 📊 Données Mock Unifiées

**Fichier:** `src/shared/unifiedMockData.ts`

### Contenu :
- 3 clients, 4 mécaniciens, 2 vendeurs, 1 admin
- 3 véhicules avec plaques marocaines
- 5 documents juridiques
- 6 notifications
- 5 produits marketplace
- 2 commandes
- 3 partenariats
- 3 rappels entretien
- 5 quartiers Casablanca

---

## 🧪 Tests

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## 📝 Notes Techniques

### Architecture
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** FastAPI + PostgreSQL + SQLAlchemy
- **Landing:** Next.js 14 (SSR) + Tailwind CSS
- **Routing:** React Router v6
- **State:** Context API
- **i18n:** FR / AR / EN (RTL support)

### Prochaines Étapes
1. Intégrer le backend réel (API calls)
2. WebSocket pour temps réel
3. Intégration paiement (CMI, mWallet)
4. SMS/WhatsApp pour notifications
5. Stockage fichiers (S3)

---

## 🎯 Checklist Démo

- [x] Login client/mécanicien/vendeur/admin
- [x] Notifications documents avec bannière critique
- [x] Profil mécanicien détaillé
- [x] Paramètres profil mécanicien
- [x] Wallet avec seuil minimum
- [x] Système anti-bypassing
- [x] Spécificités Maroc
- [x] Marketplace produits
- [x] Négociation temps réel
- [x] Documents juridiques
- [x] Check-list quotidienne
- [x] Rappels entretien
- [x] Partenariats vendeur-mécanicien
- [x] Admin dashboard
- [x] Assistant IA
- [x] Scanner de voyants

---

**Application prête pour démo complète !** 🎉

Toutes les fonctionnalités sont accessibles et fonctionnelles avec des données réalistes.
