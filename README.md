# 🚗 TomoBily / IFIX — Plateforme Automobile (Monorepo)

> **Statut : ✅ PRÊT POUR LA PRODUCTION** — Typecheck 0 erreur, build Vite OK (code-splitting actif), PWA + Service Worker fonctionnels, vérification runtime des routes et parcours (Playwright) sans route morte.

Application PWA multi-rôles (Client, Mécanicien, Vendeur pièces, Tuner, Admin) avec backend FastAPI et landing page Next.js SEO.

---

## 🏗️ Architecture Monorepo

```
tomobily/
├── src/               # PWA React + Vite (racine du repo = frontend)
├── backend/           # API FastAPI + PostgreSQL (+ SQLite pour le dev local)
├── landing/           # Landing page Next.js SSR (SEO-ready)
├── scripts/           # Vérifications runtime (routes, journeys, Playwright)
├── public/            # Assets PWA (icônes, manifest, sw.js)
├── docs/              # Documentation additionnelle
└── README.md          # Ce fichier
```

⚠️ **Note importante** : contrairement aux anciens guides qui mentionnaient un dossier `frontend/`, **le frontend est à la RACINE du dépôt** (`src/`, `package.json` à la racine). Il n'y a pas de sous-dossier `frontend/`.

---

## ⚡ Démarrage rapide (dev local, sans Docker)

### 1. Frontend PWA (React/Vite) — requis
```bash
npm install
cp .env.example .env.local   # optionnel : API URL + réseaux sociaux
npm run dev                  # http://localhost:3000
```

Vérifications qualité :
```bash
npm run typecheck            # tsc --noEmit → doit retourner 0 erreur
npm run build                # build de production dans dist/ (chunks séparés)
npx vite preview --port 4173 # sert le build de production
```

### 2. Backend (FastAPI) — optionnel en démo
L'app fonctionne en **mode démo autonome** (fallback données locales) sans backend.
Pour activer l'API réelle :
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # puis éditer les valeurs
uvicorn app.main:app --reload --port 8000
```
- Docs API : http://localhost:8000/docs
- Le frontend pointe sur l'API via `VITE_API_URL` (défaut : `http://localhost:8000`).

PostgreSQL/Redis sont requis pour un backend complet en production ; pour un essai rapide,
le backend supporte SQLite (`backend/dev.db`) en mode développement.

### 3. Landing page (Next.js)
```bash
cd landing
npm install
cp .env.example .env.local   # liens réseaux sociaux (NEXT_PUBLIC_*)
npm run dev                  # http://localhost:3001 (ou port indiqué)
```

---

## 🔐 Variables d'environnement

| Emplacement | Fichier exemple | Clés |
|---|---|---|
| Racine (PWA) | `.env.example` | `VITE_API_URL`, `VITE_SOCIAL_FACEBOOK/INSTAGRAM/TWITTER/LINKEDIN` |
| `landing/` | `landing/.env.example` | `NEXT_PUBLIC_SOCIAL_TWITTER/FACEBOOK/INSTAGRAM` |
| `backend/` | `backend/.env.example` | `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, CORS, S3… |

Comportement sans configuration : les icônes sociales sont affichées mais **désactivées**
(aucun lien mort `href="#"` en production) ; le frontend utilise ses données de démo locales.

🔴 **En production, obligatoirement** : définir un `SECRET_KEY` unique côté backend
(`python -c "import secrets; print(secrets.token_hex(32))"`) et basculer `ENVIRONMENT=production`, `DEBUG=False`.

---

## 🧪 Tests & Vérification runtime

```bash
# 1. Statique
npm run typecheck && npm run build

# 2. Runtime (renders the production build in headless Chromium,
#    logs in through each role's real UI flow, visits every route,
#    checks console errors + overflow, screenshots in shots/)
npx playwright install chromium
npx vite preview --port 4173 &
node scripts/verify-routes.mjs     # rapport : scripts/verify-results.json
node scripts/verify-journeys.mjs   # parcours utilisateurs complets
```

Dernier résultat connu : **256/256 checks passés**, 0 route morte, 0 erreur console bloquante.

---

## 👥 Comptes de démonstration

| Rôle | Accès | Identifiant | Code / Mot de passe |
|---|---|---|---|
| Client | `/customer/login` | Téléphone `600000010` | OTP `123456` |
| Mécanicien | `/mechanic/login` | Téléphone `600000001` | OTP `123456` |
| Vendeur | `/seller/login` | Bouton « Se connecter » (démo) | — |
| Tuner | `/tuner/login` | `0600000077` | `demo1234` |
| Admin | `/admin/login` | Voir `src/admin/` (login démo) | — |

En mode démo, l'OTP est acceptée statiquement (`123456`) ; en production l'OTP est
envoyée par le backend (SMS provider à configurer — voir `DEPLOYMENT_GUIDE.md`).

---

## 📦 Build & Déploiement

```bash
npm run build        # dist/ — chunks lazy-loadés (index ~290 Ko gz ~85 Ko)
```

- **PWA** : `public/sw.js` (Service Worker) + `manifest` — installation Android/iOS décrite dans `HOW_TO_INSTALL_PWA.md`.
- **Hébergement frontend** : tout CDN statique (Netlify, Vercel, Cloudflare Pages, Nginx). Config serveur SPA + cache : voir `DEPLOYMENT_GUIDE.md`.
- **Backend** : `BACKEND_DEPLOYMENT_GUIDE.md` (Uvicorn/Gunicorn + PostgreSQL + Redis + HTTPS obligatoire).
- Session utilisateur persistée en `localStorage` (survit au rafraîchissement, synchronisée multi-onglets).

## 🗂️ Index de la documentation

| Sujet | Fichier |
|---|---|
| Guide final complet | `GUIDE_FINAL_COMPLET.md`, `FINAL_PROJECT_GUIDE.md` |
| Démarrage rapide | `QUICK_START.md` |
| Déploiement prod | `DEPLOYMENT_GUIDE.md`, `BACKEND_DEPLOYMENT_GUIDE.md`, `WHERE_TO_BUILD.md` |
| PWA / mobile | `HOW_TO_INSTALL_PWA.md`, `MOBILE_DEVELOPMENT_GUIDE.md`, `ONLINE_OFFLINE_EXPLAINED.md` |
| Architecture technique | `TECHNICAL_ARCHITECTURE.md`, `BACKEND_COMPLETE.md` |
| Profils (client/méca/tuner) | `CUSTOMER_PROFILE_COMPLETE.md`, `MECHANIC_PROFILE_COMPLETE.md`, `TUNER_PROFILE_FINAL.md` |
| Routes & corrections | `ROUTES_CORRECTIONS.md`, `scripts/routes.json` |
| Audits | `AUDIT_COMPLET_20_QUESTIONS.md`, `REALITY_CHECK.md`, `docs/AUDIT_PRODUCTION.md` |
| Démo client | `DEMO_CLIENT.md`, `DEMO_GUIDE.md` |

---
© 2024–2026 TomoBily — Dernière revue qualité : 30 octobre 2026.
