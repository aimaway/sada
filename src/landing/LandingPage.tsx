import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../shared/context';
import {
  Wrench,
  Package,
  Gauge,
  ClipboardList,
  Car,
  Smartphone,
  MousePointerClick,
  FileText,
  SearchCheck,
  ShieldCheck,
  Wallet,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Compass,
  Menu,
  X,
  Info,
  Bot,
  BrainCircuit,
  Lock,
  Check,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  BadgeCheck,
  Crown,
} from 'lucide-react';
import './landing.css';

/* -------------------------------------------------------------------------- */
/*  Local image assets (verified against /public — .jpg where noted)          */
/* -------------------------------------------------------------------------- */

interface MediaItem {
  src: string;
  alt: string;
}

const serviceItems: Array<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  media: MediaItem;
}> = [
  {
    icon: <Wrench className="w-5 h-5" />,
    title: 'Mécanique & Réparation',
    desc: 'À domicile ou en atelier, trouvez un professionnel qualifié près de chez vous.',
    media: { src: '/service-mechanic.jpg', alt: 'Mécanicien professionnel intervenant sur un véhicule' },
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: 'Pièces & Accessoires',
    desc: 'Découvrez des pièces et accessoires pour tous types de véhicules.',
    media: { src: '/service-parts.jpg', alt: 'Pièces détachées et accessoires automobiles' },
  },
  {
    icon: <Gauge className="w-5 h-5" />,
    title: 'Tuning & Personnalisation',
    desc: 'Trouvez des experts et réalisez vos projets de personnalisation.',
    media: { src: '/service-tuning.jpg', alt: 'Véhicule personnalisé par un préparateur' },
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: 'Gestion de votre véhicule',
    desc: 'Entretenez, suivez vos rendez-vous, vos documents et votre historique.',
    media: {
      src: '/service-vehicle-management.jpg',
      alt: 'Suivi de l’entretien et des documents d’un véhicule',
    },
  },
];

const heroHighlights = [
  { icon: <Wrench className="w-6 h-6" />, title: 'Mécanique & Réparation', label: 'À domicile ou en atelier' },
  { icon: <Package className="w-6 h-6" />, title: 'Pièces détachées & accessoires', label: 'Auto & moto' },
  { icon: <Gauge className="w-6 h-6" />, title: 'Tuning & personnalisation', label: 'Donnez vie à vos projets' },
  { icon: <ClipboardList className="w-6 h-6" />, title: 'Gestion & suivi', label: 'Votre véhicule au quotidien' },
];

const steps = [
  {
    icon: <MousePointerClick className="w-6 h-6" />,
    num: '01',
    title: 'Choisissez un service',
    desc: 'Réparation, pièces, tuning ou gestion de votre véhicule.',
  },
  {
    icon: <Car className="w-6 h-6" />,
    num: '02',
    title: 'Sélectionnez votre véhicule',
    desc: 'Voiture, moto ou scooter — chaque demande est adaptée.',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    num: '03',
    title: 'Précisez vos besoins',
    desc: 'Décrivez votre besoin et indiquez ce qui vous convient.',
  },
  {
    icon: <SearchCheck className="w-6 h-6" />,
    num: '04',
    title: 'Suivez votre demande',
    desc: 'Visualisez l’avancement de bout en bout.',
  },
];

const profiles: Array<{
  title: string;
  desc: string;
  media: MediaItem;
  cta: string;
  to: string;
}> = [
  {
    title: 'Clients',
    desc: 'Trouvez le bon service, au bon prix, et en toute simplicité.',
    media: { src: '/profile-clients.jpg', alt: 'Client utilisant la plateforme TomoBily' },
    cta: 'En savoir plus',
    to: '/login',
  },
  {
    title: 'Mécaniciens',
    desc: 'Développez votre activité et gérez vos interventions.',
    media: { src: '/profile-mechanics.jpg', alt: 'Mécanicien partenaire au travail' },
    cta: 'Rejoindre',
    to: '/mechanic/login',
  },
  {
    title: 'Vendeurs de pièces',
    desc: 'Vendez vos produits et gérez votre stock facilement.',
    media: { src: '/profile-parts-sellers.jpg', alt: 'Vendeur de pièces détachées' },
    cta: 'Rejoindre',
    to: '/seller/login',
  },
  {
    title: 'Préparateurs & Tuners',
    desc: 'Présentez vos réalisations et développez votre clientèle.',
    media: { src: '/profile-tuners.jpg', alt: 'Atelier de préparation et personnalisation' },
    cta: 'Rejoindre',
    to: '/tuner/register',
  },
  {
    title: 'Entreprises & Flottes',
    desc: 'Gérez vos véhicules et optimisez vos coûts.',
    media: { src: '/profile-fleets.jpg', alt: 'Gestion d’une flotte de véhicules' },
    cta: 'Nous contacter',
    to: '/contact',
  },
];

const values = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Une expérience moderne',
    desc: 'Un parcours clair, du premier besoin jusqu’au suivi final de votre demande.',
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    title: 'Maîtrise des coûts',
    desc: 'Comparez les possibilités et gardez une vision complète de votre budget véhicule.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Un écosystème complet',
    desc: 'Mécanique, pièces, tuning et gestion réunis sur une seule plateforme.',
  },
];

/* ------------------------------- IFIX AI ---------------------------------- */

const ifixAdvantages = [
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    title: 'Un diagnostic instantané, 24/7',
    desc: 'Décrivez un bruit, un voyant ou un comportement étrange : IFIX analyse vos symptômes en langage naturel et vous répond en quelques secondes, jour et nuit.',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Des explications claires, pas du jargon',
    desc: 'IFIX vous explique les causes probables et les vérifications simples à faire vous-même — sans jamais inventer de panne confirmée.',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'La sécurité avant tout',
    desc: 'Freins, direction, surchauffe… IFIX détecte les signaux critiques et vous guide immédiatement vers les bons réflexes, même hors quota.',
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    title: 'Les bons professionnels, près de chez vous',
    desc: 'À la fin de chaque diagnostic, IFIX recommande des mécaniciens et tuners réellement disponibles sur la plateforme, classés par pertinence.',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Confidentialité garantie',
    desc: 'Votre conversation reste privée. Rien n’est transmis à un professionnel sans votre consentement explicite, à tout moment.',
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    title: '3 diagnostics offerts',
    desc: 'Chaque client bénéficie de 3 cas de diagnostic complets et gratuits. Les messages d’un même cas ne consomment jamais de quota.',
  },
];

const ifixSteps = [
  { num: '1', title: 'Décrivez le problème', desc: 'Bruit, voyant, comportement : avec vos mots.' },
  { num: '2', title: 'IFIX pose ses questions', desc: 'Un entretien guidé pour affiner le diagnostic.' },
  { num: '3', title: 'Recevez l’analyse', desc: 'Causes probables, contrôles simples, niveau d’urgence.' },
  { num: '4', title: 'Choisissez la suite', desc: 'Partagez le résumé (avec accord) et recevez des offres réelles.' },
];

/* ------------------------------- Pricing ---------------------------------- */

interface PricingPlan {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  price: number | null;
  priceLabel: string;
  highlight?: boolean;
  features: string[];
}

/** Plans clients (offres & cadeaux) — identiques à la page /gift-plans. */
const clientGiftPlans: PricingPlan[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    icon: '🥉',
    gradient: 'from-amber-600 to-amber-700',
    price: 0,
    priceLabel: 'Gratuit',
    features: [
      'Accès à tous les services',
      'Support client standard',
      '1 point par 10 MAD dépensés',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    icon: '🥈',
    gradient: 'from-slate-400 to-slate-500',
    price: 99,
    priceLabel: '99 MAD',
    features: [
      'Tout Bronze +',
      'Diagnostic gratuit 1x/mois',
      '10% réduction sur entretiens',
      'Support prioritaire',
      '2x points fidélité',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: '🥇',
    gradient: 'from-yellow-500 to-yellow-600',
    price: 199,
    priceLabel: '199 MAD',
    highlight: true,
    features: [
      'Tout Silver +',
      '1 vidange offerte/mois',
      '15% réduction sur tout',
      'Mécanicien dédié',
      '3x points fidélité',
      'Annulations gratuites',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    icon: '💎',
    gradient: 'from-purple-500 to-purple-600',
    price: 399,
    priceLabel: '399 MAD',
    features: [
      'Tout Gold +',
      'Entretien complet offert/mois',
      '20% réduction sur tout',
      'Service VIP 24/7',
      '5x points fidélité',
      'Voiture de remplacement',
      'Garantie étendue 1 an',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

/** Renders an <img> with lazy loading + a restrained CSS placeholder on error. */
function CardImage({
  source,
  eager,
  imgClassName,
}: {
  source: MediaItem;
  eager?: boolean;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="lp-img-placeholder" role="presentation">
        <Info className="w-7 h-7" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={source.src}
      alt={source.alt}
      className={imgClassName}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Landing page                                                              */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* Close the mobile menu with Escape and reset it when resizing up to desktop */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => mq.matches && setMobileMenuOpen(false);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  /* Keep focus reachable when the panel opens */
  useEffect(() => {
    if (mobileMenuOpen) menuRef.current?.focus({ preventScroll: true });
  }, [mobileMenuOpen]);

  const goToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const navLinks: Array<{ label: string; to?: string; section?: string }> = [
    { label: 'Accueil', section: 'top' },
    { label: 'Services', section: 'services' },
    { label: 'IFIX AI', section: 'ifix' },
    { label: 'Tarifs', section: 'tarifs' },
    { label: 'Produits', to: '/login' },
    { label: 'Professionnels', section: 'profils' },
    { label: 'À propos', to: '/about' },
  ];

  return (
    <div className="lp-page min-h-screen" id="top">
      {/* ============================== HEADER / HERO ============================== */}
      <header className="lp-hero">
        <div className="lp-header">
          <div className="lp-header-inner">
            {/* Logo (existing brand mark: wrench tile + wordmark) */}
            <Link to="/" className="lp-logo" aria-label="TomoBily — Accueil">
              <span className="lp-logo-mark" aria-hidden="true">
                <Wrench className="w-[21px] h-[21px]" />
              </span>
              <span className="lp-logo-word">
                meca<em>GO</em>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="lp-nav-desktop" aria-label="Navigation principale">
              {navLinks.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to} className="lp-nav-link">
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    className="lp-nav-link text-left"
                    onClick={() => goToSection(link.section!)}
                  >
                    {link.label}
                  </button>
                ),
              )}
            </nav>

            <div className="lp-header-actions">
              <button
                className="lp-lang"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                aria-label={language === 'fr' ? 'Passer à l’arabe' : 'Passer au français'}
              >
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>
              <Link to="/login" className="lp-btn lp-btn-outline-light">
                Se connecter
              </Link>
              <Link to="/login" className="lp-btn lp-btn-primary">
                S’inscrire
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lp-menu-toggle"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-controls="lp-mobile-nav"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile navigation panel */}
          {mobileMenuOpen && (
            <div
              id="lp-mobile-nav"
              className="lp-mobile-nav"
              ref={menuRef}
              tabIndex={-1}
              role="dialog"
              aria-label="Menu de navigation"
            >
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="lp-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    className="lp-nav-link text-left"
                    onClick={() => goToSection(link.section!)}
                  >
                    {link.label}
                  </button>
                ),
              )}
              <div className="lp-mobile-nav-actions">
                <Link to="/login" className="lp-btn lp-btn-outline-light" onClick={() => setMobileMenuOpen(false)}>
                  Se connecter
                </Link>
                <Link to="/login" className="lp-btn lp-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  S’inscrire
                </Link>
              </div>
              <button
                className="lp-lang mt-3 self-start"
                onClick={() => {
                  setLanguage(language === 'fr' ? 'ar' : 'fr');
                  setMobileMenuOpen(false);
                }}
              >
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>
            </div>
          )}
        </div>

        {/* Hero copy */}
        <div className="lp-hero-body">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">Tout l’univers automobile et moto, au même endroit</p>
            <h1 className="lp-hero-title">
              Votre véhicule.
              <span className="accent">Notre priorité.</span>
            </h1>
            <p className="lp-hero-sub">
              Réparez, achetez, personnalisez, gérez. Une seule plateforme pour tous vos besoins
              automobiles et moto, simplement et en toute confiance.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-btn lp-btn-primary" onClick={() => goToSection('services')}>
                Trouver un service
                <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>
              <Link to="/about" className="lp-btn lp-btn-outline-light">
                <Compass className="w-[18px] h-[18px]" aria-hidden="true" />
                Découvrir la plateforme
              </Link>
            </div>
          </div>

          {/* Four service highlights */}
          <div className="lp-hero-highlights">
            {heroHighlights.map((h) => (
              <div key={h.title} className="lp-highlight">
                <span className="lp-highlight-icon" aria-hidden="true">
                  {h.icon}
                </span>
                <div>
                  <div className="lp-highlight-title">{h.title}</div>
                  <div className="lp-highlight-label">{h.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ================================ SERVICES ================================ */}
      <section id="services" className="lp-section lp-services">
        <div className="lp-container">
          <div className="lp-head-row">
            <div>
              <p className="lp-section-eyebrow">Nos services</p>
              <h2 className="lp-section-title">Une plateforme complète pour tous les conducteurs</h2>
              <p className="lp-section-sub">
                Que vous ayez besoin d’un mécanicien, de pièces, d’accessoires, d’un professionnel
                du tuning ou simplement de gérer votre véhicule, la plateforme est faite pour vous.
              </p>
            </div>
            <Link to="/login" className="lp-link-cyan">
              Explorer tous les services
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="lp-card-grid cols-4">
            {serviceItems.map((s) => (
              <article key={s.title} className="lp-service-card">
                <div className="lp-service-media">
                  <CardImage source={s.media} imgClassName="lp-cover-img" />
                  <span className="lp-service-badge" aria-hidden="true">
                    {s.icon}
                  </span>
                </div>
                <div className="lp-service-body">
                  <h3 className="lp-service-title">{s.title}</h3>
                  <p className="lp-service-desc">{s.desc}</p>
                  <button className="lp-link-cyan self-start text-sm" onClick={() => navigate('/login')}>
                    Découvrir
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================= IFIX AI ================================ */}
      <section id="ifix" className="lp-section lp-ifix" aria-labelledby="lp-ifix-title">
        <div className="lp-container">
          <div className="lp-ifix-hero">
            <figure className="lp-ifix-figure m-0">
              <img
                src="/IFIX AI Garage Mascot.png"
                alt="IFIX AI, la mascotte experte en diagnostic automobile de TomoBily"
                className="lp-ifix-img"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="lp-ifix-figure-caption">
                <Bot className="w-4 h-4" aria-hidden="true" />
                IFIX — votre copilote de diagnostic
              </figcaption>
            </figure>

            <div className="lp-ifix-copy">
              <p className="lp-ifix-eyebrow">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Nouveauté&nbsp;: l’expertise d’un diagnostician IA
              </p>
              <h2 id="lp-ifix-title" className="lp-ifix-title">
                IFIX AI diagnostique votre véhicule
                <span className="accent">avant même le mécanicien.</span>
              </h2>
              <p className="lp-ifix-sub">
                Un bruit suspect&nbsp;? Un voyant allumé&nbsp;? Une perte de puissance&nbsp;? Décrivez
                le problème à IFIX avec vos mots. Notre expert de diagnostic IA vous pose les bonnes
                questions, identifie les causes probables, veille à votre sécurité et vous oriente
                vers les professionnels vérifiés les plus pertinents — tout ça, gratuitement.
              </p>
              <ul className="lp-ifix-badges" role="list">
                <li><BadgeCheck className="w-4 h-4" aria-hidden="true" /> 3 diagnostics offerts</li>
                <li><Lock className="w-4 h-4" aria-hidden="true" /> Confidentialité totale</li>
                <li><ShieldCheck className="w-4 h-4" aria-hidden="true" /> Alertes de sécurité</li>
              </ul>
              <div className="lp-ifix-actions">
                <Link to="/customer/ifix" className="lp-btn lp-btn-primary">
                  <Bot className="w-[18px] h-[18px]" aria-hidden="true" />
                  Essayer IFIX AI
                </Link>
                <button className="lp-btn lp-btn-outline-light" onClick={() => goToSection('tarifs')}>
                  Voir les tarifs
                </button>
              </div>
            </div>
          </div>

          <div className="lp-card-grid cols-3 mt-14">
            {ifixAdvantages.map((a) => (
              <article key={a.title} className="lp-ifix-card">
                <span className="lp-ifix-card-icon" aria-hidden="true">
                  {a.icon}
                </span>
                <h3 className="lp-ifix-card-title">{a.title}</h3>
                <p className="lp-ifix-card-desc">{a.desc}</p>
              </article>
            ))}
          </div>

          <div className="lp-ifix-steps" aria-label="Comment IFIX fonctionne">
            {ifixSteps.map((s, i) => (
              <React.Fragment key={s.num}>
                {i > 0 && <span className="lp-ifix-step-arrow" aria-hidden="true">→</span>}
                <div className="lp-ifix-step">
                  <span className="lp-ifix-step-num">{s.num}</span>
                  <div>
                    <div className="lp-ifix-step-title">{s.title}</div>
                    <div className="lp-ifix-step-desc">{s.desc}</div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <p className="lp-ifix-note">
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            IFIX AI est un assistant d’orientation : il évoque des causes probables et ne remplace
            jamais l’inspection d’un professionnel qualifié. Vos échanges restent privés et ne sont
            partagés qu’avec votre accord explicite.
          </p>
        </div>
      </section>

      {/* ================================= PRICING ================================ */}
      <section id="tarifs" className="lp-section bg-white" aria-labelledby="lp-pricing-title">
        <div className="lp-container">
          <div className="text-center mb-12 md:mb-14">
            <p className="lp-section-eyebrow">Tarifs — Clients uniquement</p>
            <h2 id="lp-pricing-title" className="lp-section-title">
              Nos offres & cadeaux pour les conducteurs
            </h2>
            <p className="lp-section-sub mx-auto">
              S’inscrire et publier une demande restent gratuits. Choisissez ensuite le plan client
              qui vous offre le plus de cadeaux : diagnostics offerts, réductions, vidanges
              gratuites et bien plus.
            </p>
          </div>

          <div className="lp-pricing-grid lp-pricing-grid-4">
            {clientGiftPlans.map((plan) => (
              <article
                key={plan.id}
                className={`lp-price-card${plan.highlight ? ' featured' : ''}`}
              >
                {plan.highlight && (
                  <span className="lp-price-flag">
                    <Crown className="w-4 h-4" aria-hidden="true" />
                    Le plus populaire
                  </span>
                )}
                <div
                  className={`lp-price-icon bg-gradient-to-br ${plan.gradient}`}
                  role="img"
                  aria-label={`Plan ${plan.name}`}
                >
                  <span aria-hidden="true">{plan.icon}</span>
                </div>
                <h3 className="lp-price-name">{plan.name}</h3>
                <p className="lp-price-audience">Plan client</p>
                <div className="lp-price-value">
                  <span className="lp-price-amount">{plan.priceLabel}</span>
                  <span className="lp-price-period">
                    {plan.price === 0 ? 'pour toujours' : '/ mois'}
                  </span>
                </div>
                <ul className="lp-price-features" role="list">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/gift-plans"
                  className={`lp-btn w-full ${plan.highlight ? 'lp-btn-primary' : 'lp-btn-ghost-navy'}`}
                >
                  Choisir {plan.name}
                  <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <p className="lp-pricing-note">
            Ces plans et cadeaux sont réservés aux clients (conducteurs). Les demandes de service
            et la mise en relation avec les professionnels restent gratuites pour tous. Les
            tarifs affichés peuvent évoluer — le contrat en vigueur fait foi.
          </p>
        </div>
      </section>

      {/* =============================== MOBILE APP =============================== */}
      <section className="lp-section lp-app" aria-labelledby="lp-app-title">
        <div className="lp-container">
          <div className="lp-app-grid">
            <div>
              <p className="lp-section-eyebrow">Votre véhicule dans votre poche</p>
              <h2 id="lp-app-title" className="lp-app-title">
                Une application simple et puissante
              </h2>
              <p className="lp-app-sub">
                Accédez à vos services, suivez vos demandes et gérez votre véhicule depuis une
                expérience conçue pour vous simplifier la vie.
              </p>
              {/* No public store URLs are configured — PWA install is the real path */}
              <div className="lp-app-note">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
                <span>
                  Installez TomoBily comme application web (PWA) depuis votre navigateur pour un accès
                  rapide, comme sur votre téléphone.
                </span>
              </div>
            </div>
            <figure className="lp-app-figure m-0">
              <CardImage
                source={{
                  src: '/mobile-app-promo.jpg',
                  alt: 'Utilisateur consultant l’application TomoBily sur son smartphone',
                }}
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ============================== HOW IT WORKS ============================== */}
      <section className="lp-section bg-white" aria-labelledby="lp-steps-title">
        <div className="lp-container">
          <div className="text-center mb-12 md:mb-14">
            <p className="lp-section-eyebrow">Comment ça marche&nbsp;?</p>
            <h2 id="lp-steps-title" className="lp-section-title">
              En quelques étapes, tout devient simple
            </h2>
          </div>
          <div className="lp-steps">
            {steps.map((step) => (
              <div key={step.num} className="lp-step">
                <span className="lp-step-icon" aria-hidden="true">
                  {step.icon}
                </span>
                <span className="lp-step-num">{step.num}</span>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ PROFILES ================================ */}
      <section id="profils" className="lp-section lp-profiles" aria-labelledby="lp-profiles-title">
        <div className="lp-container">
          <div className="text-center mb-12 md:mb-14">
            <h2 id="lp-profiles-title" className="lp-section-title">
              5 profils pour une même passion
            </h2>
            <p className="lp-section-sub mx-auto">
              Notre plateforme connecte tous les acteurs de l’écosystème automobile et moto.
            </p>
          </div>

          <div className="lp-card-grid cols-5">
            {profiles.map((p) => (
              <article key={p.title} className="lp-profile-card">
                <div className="lp-profile-media">
                  <CardImage source={p.media} imgClassName="lp-cover-img" />
                </div>
                <div className="lp-profile-body">
                  <h3 className="lp-profile-title">{p.title}</h3>
                  <p className="lp-profile-desc">{p.desc}</p>
                  <Link to={p.to} className="lp-link-cyan self-start text-sm">
                    {p.cta}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= VALUE PROPOSITION =========================== */}
      <section className="lp-section lp-vision" aria-labelledby="lp-vision-title">
        <div className="lp-container">
          <p className="lp-section-eyebrow">Notre ambition</p>
          <h2 id="lp-vision-title" className="lp-vision-title">
            Plus qu’une application, une vision pour l’avenir
          </h2>
          <p className="lp-vision-sub">
            Une plateforme pensée pour simplifier votre quotidien, réduire vos coûts et vous offrir
            une expérience automobile moderne et sécurisée.
          </p>
          <div className="lp-values">
            {values.map((v) => (
              <div key={v.title} className="lp-value">
                <span className="lp-value-icon" aria-hidden="true">
                  {v.icon}
                </span>
                <h3 className="lp-value-title">{v.title}</h3>
                <p className="lp-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================= CTA BAND ================================ */}
      <section className="lp-section lp-cta-band">
        <div className="lp-container">
          <div className="lp-cta-panel">
            <h2 className="lp-cta-title">Rejoignez une communauté de passionnés</h2>
            <p className="lp-cta-sub">
              Que vous soyez un conducteur, un professionnel ou une entreprise, notre plateforme est
              faite pour vous.
            </p>
            <div className="lp-cta-actions">
              <Link to="/login" className="lp-btn lp-btn-primary">
                S’inscrire maintenant
                <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
              </Link>
              <Link to="/about" className="lp-btn lp-btn-ghost-navy">
                Découvrir TomoBily
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================== FOOTER ================================= */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link to="/" className="lp-logo" aria-label="TomoBily — Accueil">
                <span className="lp-logo-mark" aria-hidden="true">
                  <Wrench className="w-[21px] h-[21px]" />
                </span>
                <span className="lp-logo-word">
                  meca<em>GO</em>
                </span>
              </Link>
              <p>
                La plateforme qui connecte conducteurs, mécaniciens, vendeurs de pièces, tuners et
                flottes autour de l’automobile et de la moto.
              </p>
            </div>

            <nav aria-label="Navigation du pied de page">
              <h3 className="lp-footer-heading">Plateforme</h3>
              <ul className="lp-footer-links">
                <li>
                  <button onClick={() => goToSection('top')}>Accueil</button>
                </li>
                <li>
                  <button onClick={() => goToSection('services')}>Services</button>
                </li>
                <li>
                  <button onClick={() => goToSection('ifix')}>IFIX AI</button>
                </li>
                <li>
                  <button onClick={() => goToSection('tarifs')}>Tarifs</button>
                </li>
                <li>
                  <Link to="/login">Produits</Link>
                </li>
                <li>
                  <Link to="/about">À propos</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Liens professionnels">
              <h3 className="lp-footer-heading">Professionnels</h3>
              <ul className="lp-footer-links">
                <li>
                  <Link to="/mechanic/login">Mécaniciens</Link>
                </li>
                <li>
                  <Link to="/seller/login">Vendeurs de pièces</Link>
                </li>
                <li>
                  <Link to="/tuner/register">Préparateurs & Tuners</Link>
                </li>
                <li>
                  <Link to="/contact">Entreprises & Flottes</Link>
                </li>
              </ul>
            </nav>

            <div>
              <h3 className="lp-footer-heading">Langue</h3>
              <ul className="lp-footer-links">
                <li>
                  <button
                    onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                    aria-label={language === 'fr' ? 'Passer à l’arabe' : 'Passer au français'}
                  >
                    {language === 'fr' ? 'العربية' : 'Français'}
                  </button>
                </li>
                <li>
                  <Link to="/contact">Support & contact</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <span className="lp-footer-copy">© 2026 TomoBily. Tous droits réservés.</span>
            <div className="lp-footer-legal">
              <Link to="/terms" className="lp-footer-copy hover:text-[color:var(--lp-cyan)]">
                Conditions d’utilisation
              </Link>
              <Link to="/privacy" className="lp-footer-copy hover:text-[color:var(--lp-cyan)]">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
