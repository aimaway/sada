# MécaCasablanca - Guide de Démo Complet

## 🎯 Vue d'ensemble

Application complète de mise en relation clients-mécaniciens à Casablanca avec :
- Système de bidding style inDrive
- Marketplace de pièces auto
- Gestion documentaire avec notifications
- Wallet prepaid pour mécaniciens
- Système anti-contournement
- Spécificités locales Maroc

---

## 📱 Portails d'accès

### 1. 👤 Portail Client
**URL:** `/customer/login`
**Démo:** Entrez n'importe quel numéro → code OTP (4+ chiffres)

#### Fonctionnalités disponibles :

**🏠 Accueil (`/customer/home`)**
- Bouton "Nouvelle demande" → Créer une demande de réparation
- Bouton "Assistant IA" → Diagnostic intelligent
- Grille d'accès rapide : Boutique, Historique, Rappels, Documents
- **Bannière d'alerte critique** : "3 documents à renouveler" avec accès direct aux notifications
- **Icône cloche** avec badge rouge (3 notifications non lues)

**🔔 Notifications (`/customer/notifications`)** ⭐ NOUVEAU
- **Bannière critique** en haut : "3 documents à renouveler"
- Filtrage : Toutes / Non lues / Documents / Jobs
- Notifications par priorité (haute/moyenne/basse)
- Alertes d'expiration : Assurance, Contrôle technique, Vignette
- Clic sur notification → Redirection vers page concernée
- Résumé des documents à renouveler en bas

**📄 Documents Juridiques (`/customer/documents`)**
- Liste complète : Permis, Assurance, Contrôle technique, Carte grise, Vignette
- Statuts : Valide (vert) / Expire bientôt (orange) / Expiré (rouge)
- Jours restants avant expiration
- Coût de renouvellement affiché
- Bouton "Renouveler" pour documents expirants

**💬 Négociation (`/customer/negotiation`)**
- Chat temps réel avec mécanicien
- Barre de négociation de prix
- Commande de produits pendant le trajet
- Panier avec quantités ajustables

**🛒 Boutique (`/customer/shop`)**
- Catalogue produits : Huiles, Batteries, Pneus, Freins, Filtres
- Recherche et filtrage par catégorie
- Ajout au panier

**📋 Historique (`/customer/orders`)**
- Onglets : En cours / Planifiées / Historique
- Détails des jobs passés
- Bouton "Rebooker" pour recommencer

**🔧 Entretien (`/customer/maintenance`)**
- Check-list quotidienne
- Rappels d'entretien
- Statistiques

**💼 Business & Sécurité** (Section sur accueil)
- Wallet (portefeuille mécanicien)
- Sécurité (anti-bypassing)
- Maroc (spécificités locales)

---

### 2. 🔧 Portail Mécanicien
**URL:** `/mechanic/login`
**Démo:** 
- Nouveau mécanicien : n'importe quel numéro → Formulaire d'inscription
- Mécanicien approuvé : `600000001` → Accès direct

#### Fonctionnalités disponibles :

**🏠 Accueil (`/mechanic/home`)**
- **Avatar cliquable** → Accès au profil détaillé
- Toggle "En ligne / Hors ligne"
- Bannière "Job en cours" (si actif)
- Liste des demandes à proximité
- Navigation : Demandes, Boutique, Gains, Wallet

**👤 Profil Détaillé (`/mechanic/profile`)** ⭐ ENHANCED
- Photo + badge vérifié
- Statistiques : Note, Jobs, Complétion, Temps de réponse
- **Expérience & Spécialités** : Années, Marques, Spécialités
- **Zone de service** : Ville, Rayon, Position GPS
- **Langues parlées** : Darija, Français, Arabe, English
- **Vérifications** : ID, Atelier, Certificats, Références, Assurance
- **Services proposés** : Catégories cochées
- **Garantie** : 7-30 jours affichée
- Bouton "Modifier le profil"

**⚙️ Paramètres Profil (`/mechanic/profile-settings`)** ⭐ NOUVEAU
- **Rayon de service** : Slider 3-25 km
- **Garantie offerte** : 7j / 15j / 30j / 60j
- **Services proposés** : Checkboxes (Batterie, Vidange, Freins, Pneus)
- **Marques spécialisées** : Toyota, Dacia, Renault, Peugeot, BMW, Mercedes
- **Langues parlées** : Darija, Français, Arabe, English

**💳 Wallet (`/mechanic/wallet`)** ⭐ ENHANCED
- Solde en temps réel avec barre de progression
- **Seuil minimum** : 50 MAD (bloqué si < seuil)
- Alerte rouge quand solde insuffisant
- Commission auto-déduite : 10% par job
- Ledger complet : Rechargements + Commissions
- Bouton "Recharger maintenant"

**🛒 Boutique (`/mechanic/shop`)**
- Catalogue produits à recommander
- Commission 5% sur chaque vente

**📊 Gains (`/mechanic/earnings`)**
- Statistiques de revenus
- Historique des jobs

**📝 Inscription (`/mechanic/profile-setup`)**
- Étape 1 : Nom complet
- Étape 2 : Services proposés (checkboxes)
- Étape 3 : Upload documents (simulé)
- Statut : "En attente d'approbation"
- Bouton "Simuler l'approbation"

---

### 3. 🏪 Portail Vendeur
**URL:** `/seller/login`
**Démo:** Connexion directe

#### Fonctionnalités disponibles :

**📊 Dashboard (`/seller/dashboard`)**
- Stats : Revenu du jour, Ventes totales
- Actions rapides : Produits, Commandes, Partenaires, Stats
- Commandes récentes
- Mécaniciens partenaires
- Produits populaires

**📦 Produits (`/seller/products`)**
- Liste des produits avec stock
- Recherche
- Ajouter nouveau produit

**🛍️ Commandes (`/seller/orders`)**
- Filtrage par statut : Toutes / Nouvelles / Préparation / En route / Livrées
- Détails des commandes
- Actions : Confirmer, Préparer, Envoyer en livraison

**🤝 Partenariats (`/seller/partnerships`)**
- Liste des mécaniciens partenaires
- Commission reversée (5-7%)
- Nombre de références
- Date de début de partenariat

**⚙️ Paramètres (`/seller/settings`)**
- Infos boutique
- Livraison (rayon, frais, gratuité)
- Notifications

---

### 4. 🛡️ Portail Admin
**URL:** `/admin/login`
**Démo:** Connexion directe

#### Fonctionnalités disponibles :

**📊 Dashboard (`/admin/dashboard`)**
- KPIs : Demandes, Taux acceptation, Jobs terminés, Mécaniciens actifs, Commission
- Jobs récents
- Mécaniciens en attente de vérification

**✅ Vérification (`/admin/verification`)**
- File d'attente des mécaniciens
- Documents soumis
- Actions : Approuver / Rejeter

**📋 Jobs (`/admin/requests`)**
- Liste de tous les jobs
- Filtrage par statut

**👥 Users (`/admin/users`)**
- Liste utilisateurs
- Actions : Suspendre / Réactiver

**⚙️ Settings (`/admin/settings`)**
- Commission (%, min, max)
- Seuil wallet minimum
- Rayon par défaut
- Expiration demandes
- Contre-offres (min/max %)

**⚠️ Litiges (`/admin/disputes`)**
- Liste des litiges
- Statut : Ouvert / Résolu

---

## 🎮 Mode Démo - Flux complets

### Flux Client Complet :
1. **Login** → `/customer/login` → Entrez `600000010` → Code OTP `1234`
2. **Accueil** → Voir bannière alerte documents → Cliquer "Voir →"
3. **Notifications** → Voir 3 documents à renouveler → Cliquer sur notification
4. **Documents** → Voir détails assurance/contrôle technique/vignette
5. **Nouvelle demande** → Choisir catégorie → Décrire problème → Proposer prix
6. **Offres** → Voir offres mécaniciens (apparition progressive) → Accepter
7. **Tracking** → Suivre mécanicien en temps réel → Chat/négociation
8. **Négociation** → Proposer contre-offre → Commander produits
9. **Paiement** → Choisir méthode → Payer → Reçu PDF
10. **Notation** → Donner étoiles + commentaire

### Flux Mécanicien Complet :
1. **Login** → `/mechanic/login` → Entrez `600000001` → Code OTP `1234`
2. **Accueil** → Cliquer sur avatar → Voir profil détaillé
3. **Profil** → Voir stats, vérifications, spécialités → "Modifier le profil"
4. **Paramètres** → Ajuster rayon (slider) → Choisir garantie (7-60j) → Cocher services/marques/langues → Enregistrer
5. **Retour accueil** → Se mettre "En ligne"
6. **Voir demandes** → Cliquer sur demande → Voir détails
7. **Accepter/Contre-offrir** → Proposer prix → Message
8. **Job actif** → Suivre statut → Terminer job
9. **Wallet** → Voir solde → Commission déduite → Recharger si besoin

### Flux Vendeur Complet :
1. **Login** → `/seller/login` → Connexion directe
2. **Dashboard** → Voir stats → Commandes récentes
3. **Produits** → Gérer catalogue → Ajouter produit
4. **Commandes** → Filtrer par statut → Confirmer/Préparer/Livrer
5. **Partenariats** → Voir mécaniciens partenaires → Commission

### Flux Admin Complet :
1. **Login** → `/admin/login` → Connexion directe
2. **Dashboard** → Voir KPIs → Jobs récents
3. **Vérification** → Voir mécaniciens en attente → Approuver/Rejeter
4. **Jobs** → Voir tous les jobs → Filtrer
5. **Users** → Voir utilisateurs → Suspendre/Réactiver
6. **Settings** → Ajuster commission/seuils/rayon

---

## 📊 Données Mock Unifiées

**Fichier:** `src/shared/unifiedMockData.ts`

### Contenu :
- **Users** : 3 clients, 4 mécaniciens (1 pending), 2 vendeurs, 1 admin
- **Véhicules** : 3 véhicules avec plaques marocaines
- **Catégories** : 4 catégories (Batterie, Vidange, Freins, Pneus)
- **Documents** : 5 documents (permis, assurance, contrôle technique, carte grise, vignette)
- **Notifications** : 6 notifications (3 documents, 1 job, 1 offre, 1 rappel)
- **Requêtes** : 2 requêtes (1 open, 1 offered)
- **Offres** : 3 offres (2 accept, 1 counter)
- **Jobs** : 2 jobs (1 in_progress, 1 completed)
- **Produits** : 5 produits (huiles, batteries, filtres, plaquettes, pneus)
- **Commandes** : 2 commandes (1 out_for_delivery, 1 preparing)
- **Partenariats** : 3 partenariats vendeur-mécanicien
- **Rappels entretien** : 3 rappels (vidange, pneus, freins)
- **Settings admin** : Commission 10%, seuil 50 MAD, rayon 10 km
- **Check-list quotidienne** : 5 vérifications
- **Quartiers** : 5 quartiers (Derb Ghallef, Ain Sebaa, Maarif, Ain Diab, Anfa)

### Fonctions utilitaires :
- `getDaysUntilExpiry(date)` → Calcul jours restants
- `getUnreadNotificationsCount(userId)` → Nombre notifications non lues
- `getExpiringDocumentsCount(userId)` → Nombre documents expirants

---

## 🔔 Système de Notifications

### Types de notifications :
1. **document_expiry** (haute priorité)
   - Assurance expire bientôt
   - Contrôle technique à planifier
   - Vignette fiscale

2. **job_update** (haute priorité)
   - Mécanicien en route
   - Job terminé

3. **offer_received** (moyenne priorité)
   - Nouvelle offre reçue

4. **maintenance_reminder** (basse priorité)
   - Vidange à prévoir
   - Permutation pneus

### Affichage :
- **Bannière critique** sur accueil client (rouge/orange)
- **Icône cloche** avec badge rouge (nombre non lus)
- **Page notifications** avec filtrage
- **Clic notification** → Redirection vers page concernée

---

## 💼 Fonctionnalités Business

### Wallet Prepaid :
- Solde en centimes (ex: 15000 = 150 MAD)
- Seuil minimum : 5000 centimes (50 MAD)
- Commission auto-déduite : 10% par job
- Blocage si solde < seuil
- Ledger append-only

### Anti-Bypassing :
- Numéros masqués jusqu'à acceptation
- Chat in-app obligatoire
- Récompenses fidélité (points, frais réduits, garantie étendue)
- Pénalités pour contournement

### Spécificités Maroc :
- Devise : MAD
- Plaques : Format `12345-A-1`
- Langues : FR / AR / DARIJA
- Quartiers : Derb Ghallef, Ain Sebaa, Maarif...
- Fournisseurs locaux intégrés

### Cold Start Strategy :
- Phase 1 : 2-3 quartiers (30-50 mécaniciens)
- Phase 2 : Validation modèle
- Phase 3 : Expansion ville entière

---

## 🚀 Build Status

```
✓ 1380 modules transformés
✓ dist/index.html: 3.19 kB (1.37 kB gzip)
✓ dist/assets/index.css: 45.24 kB (7.78 kB gzip)
✓ dist/assets/index.js: 348.99 kB (90.63 kB gzip)
✓ Build réussi en 5.07s
```

---

## 📝 Notes Techniques

### Architecture :
- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Routing** : React Router v6
- **State** : Context API (AppProvider)
- **Icons** : Lucide React
- **Données** : Mock data unifié (prêt pour backend)

### Prochaines étapes pour backend :
1. Remplacer mock data par API calls
2. Implémenter WebSocket pour temps réel
3. Intégrer paiement (CMI, mWallet)
4. SMS/WhatsApp pour notifications
5. Stockage fichiers (S3) pour documents
6. Géolocalisation (PostGIS) pour matching

---

## 🎯 Checklist Démo

- [x] Login client/mécanicien/vendeur/admin
- [x] Notifications documents avec bannière critique
- [x] Profil mécanicien détaillé avec tous paramètres
- [x] Paramètres profil mécanicien (rayon, garantie, services, marques, langues)
- [x] Wallet avec seuil minimum et blocage
- [x] Système anti-bypassing
- [x] Spécificités Maroc (MAD, plaques, quartiers)
- [x] Marketplace produits
- [x] Négociation temps réel
- [x] Documents juridiques avec expiration
- [x] Check-list quotidienne
- [x] Rappels entretien
- [x] Partenariats vendeur-mécanicien
- [x] Admin dashboard avec KPIs
- [x] Données mock unifiées

---

**Application prête pour démo complète !** 🎉

Toutes les fonctionnalités sont accessibles et fonctionnelles avec des données réalistes.
