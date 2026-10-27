# 🚀 mecaGO - Guide de Démarrage Rapide

## ⚡ Démarrage en 5 Minutes

### 1. Installer les Dépendances
```bash
npm install
```

### 2. Lancer l'Application en Mode Développement
```bash
npm run dev
```

### 3. Ouvrir dans le Navigateur
```
http://localhost:5173
```

### 4. Tester comme PWA sur Mobile
1. Ouvrir `http://localhost:5173` sur votre téléphone
2. **Android (Chrome)** : Menu → "Ajouter à l'écran d'accueil"
3. **iOS (Safari)** : Partager → "Sur l'écran d'accueil"

---

## 🎯 Accès Rapide aux Fonctionnalités

### Page Principale
```
http://localhost:5173/
```
- Landing page professionnelle
- Statistiques et témoignages
- Bouton "Se connecter" en haut à droite

### Sélection de Rôle
```
http://localhost:5173/login
```
- Choisir entre : Client, Mécanicien, Vendeur, Tuner, Admin
- Pour les clients : Message de téléchargement d'app
- Pour les autres : Redirection vers le login

### Comptes Premium (5 étoiles)

#### Client Premium - Amine Khalid
```
1. Aller sur /login
2. Sélectionner "Client"
3. Utiliser le numéro : +212600000099
4. OTP : 1234
5. Redirigé vers : /customer/home-enhanced
```

#### Mécanicien Expert - Ahmed Benali
```
1. Aller sur /login
2. Sélectionner "Mécanicien"
3. Utiliser le numéro : +212600000088
4. OTP : 1234
5. Redirigé vers : /mechanic/profile-enhanced
```

#### Tuner Spécialiste - Youssef "Speed"
```
Accès direct : /tuner/speed-tuning-casa
```

#### Vendeur Établi - Karim Tazi
```
Accès direct : /seller/autopieces-maroc
```

---

## 🎮 Bouton Toggle Démo

**Position :** En bas à droite de l'écran  
**Fonction :** Basculer entre mode Démo et Production  
**État :** Activé par défaut (mode Démo)

- 🟢 **Vert (Démo)** : Données de démonstration
- ⚫ **Noir (Live)** : Mode production

---

## 📱 Routes Principales

### Client
- `/customer/home-enhanced` - Page d'accueil
- `/customer/wallet` - Wallet avec 5 méthodes de paiement
- `/customer/documents-manage` - Gestion des documents
- `/customer/new-request-enhanced` - Nouvelle demande
- `/customer/notifications` - Notifications
- `/customer/maintenance` - Entretien
- `/customer/shop` - Boutique
- `/customer/recurring-plans` - Plans récurrents

### Mécanicien
- `/mechanic/profile-enhanced` - Profil complet
- `/mechanic/dashboard` - Dashboard avec stats
- `/mechanic/wallet` - Wallet et gains
- `/mechanic/earnings` - Historique des gains

### Vendeur
- `/seller/autopieces-maroc` - Profil vendeur
- `/seller/dashboard` - Dashboard vendeur
- `/seller/products` - Gestion produits
- `/seller/orders` - Commandes
- `/seller/partnerships` - Partenariats

### Tuner
- `/tuner/speed-tuning-casa` - Profil tuner
- Stages 1-3 avec galerie

### Admin
- `/admin/login` - Login admin
- `/admin/dashboard` - Dashboard admin
- `/admin/users` - Gestion utilisateurs
- `/admin/verification` - Validation profils

### Autres
- `/gift-plans` - Plans d'abonnement
- `/login` - Sélection de rôle
- `/` - Landing page

---

## 🛠️ Commandes Disponibles

### Développement
```bash
npm run dev          # Lance le serveur de développement
```

### Build pour Production
```bash
npm run build        # Crée le build de production
```

### Preview du Build
```bash
npm run preview      # Prévisualise le build de production
```

---

## 📊 Statistiques du Projet

```
✓ 1,398 modules transformés
✓ Build réussi en 5.60s
✓ CSS : 62.93 kB (9.76 kB gzip)
✓ JS : 503.08 kB (117.66 kB gzip)
✓ 60+ routes fonctionnelles
✓ 40+ composants React
✓ 4 comptes premium
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Option 2 : Netlify
```bash
# Build
npm run build

# Uploader le dossier dist/ sur Netlify
```

### Option 3 : AWS/DigitalOcean
```bash
# Build
npm run build

# Copier dist/ sur votre serveur
# Configurer nginx pour servir les fichiers statiques
```

---

## 📱 Installation PWA

### Android
1. Ouvrir Chrome
2. Aller sur votre URL
3. Menu (⋮) → "Ajouter à l'écran d'accueil"
4. Confirmer
5. L'icône mecaGO apparaît

### iOS
1. Ouvrir Safari
2. Aller sur votre URL
3. Bouton Partager (□↑)
4. "Sur l'écran d'accueil"
5. Confirmer
6. L'icône mecaGO apparaît

---

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env` à la racine :
```env
VITE_API_URL=https://api.mecago.app
VITE_APP_NAME=mecaGO
VITE_DEMO_MODE=true
```

### Manifest PWA
Déjà configuré dans `/public/manifest.json`

### Service Worker
Déjà configuré dans `/public/sw.js`

---

## 📚 Documentation Complète

Tous les documents sont disponibles dans le projet :

- **`MECAGO_PWA_GUIDE.md`** - Guide complet PWA vs Native
- **`FINAL_PROJECT_GUIDE.md`** - Guide final du projet
- **`PREMIUM_ACCOUNTS.md`** - Détails des 4 comptes premium
- **`MOBILE_DEVELOPMENT_GUIDE.md`** - Guide développement mobile
- **`TECHNICAL_ARCHITECTURE.md`** - Architecture technique
- **`MOBILE_ROADMAP.md`** - Roadmap et budget
- **`IMPROVEMENTS_SUMMARY.md`** - Améliorations implémentées

---

## ❓ FAQ

### Q: Est-ce une vraie app mobile ?
**R:** Non, c'est une PWA (Progressive Web App). Elle peut être installée sur mobile comme une app, mais ce n'est pas une app native Android/iOS.

### Q: Comment transformer en app native ?
**R:** Il faut développer une app React Native séparée. Budget : ~270,000 MAD, Durée : 5-6 mois. Voir `MOBILE_DEVELOPMENT_GUIDE.md`.

### Q: Puis-je publier sur App Store/Google Play ?
**R:** Pas directement. Vous devez développer une app native. La PWA peut être installée via le navigateur.

### Q: Le bouton démo sert à quoi ?
**R:** Il permet de basculer entre mode démo (données fictives) et mode production (vraies données).

### Q: Comment accéder aux comptes premium ?
**R:** Via la page `/login` ou directement via les URLs :
- Client : `/customer/home-enhanced`
- Mécanicien : `/mechanic/profile-enhanced`
- Tuner : `/tuner/speed-tuning-casa`
- Vendeur : `/seller/autopieces-maroc`

---

## 🎯 Prochaines Étapes

### Immédiat
1. ✅ Tester toutes les fonctionnalités
2. ✅ Déployer sur un serveur web
3. ✅ Acheter le domaine mecego.app
4. ✅ Configurer HTTPS

### Cette Semaine
1. ✅ Lancer beta test avec 50 utilisateurs
2. ✅ Collecter feedback
3. ✅ Corriger bugs
4. ✅ Améliorer UX

### Ce Mois
1. ✅ Lancement officiel
2. ✅ Marketing de lancement
3. ✅ Acquérir 500 utilisateurs
4. ✅ Valider le business model

---

## 📞 Support

### Documentation
- Voir tous les fichiers `.md` dans le projet

### Issues
- GitHub Issues (si configuré)

### Contact
- Email : support@mecago.app
- Téléphone : +212 5XX-XXXXXX

---

## ✅ Checklist de Lancement

- [x] Application fonctionnelle
- [x] Tous les routers corrigés
- [x] Bouton toggle démo ajouté
- [x] 4 comptes premium configurés
- [x] PWA configurée
- [x] Documentation complète
- [ ] Déployé sur serveur
- [ ] Domaine acheté
- [ ] HTTPS configuré
- [ ] Beta test lancé
- [ ] Marketing démarré

---

**mecaGO est prêt pour le lancement !** 🚀

**Prochaine action :** Déployer sur un serveur web et commencer le beta testing.
