import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button } from '../shared/components';
import { 
  Wrench, MapPin, Shield, Star, Clock, Users, Award, TrendingUp, 
  CheckCircle, Zap, Heart, Gift, Percent, Calendar, Phone, Mail, 
  Facebook, Instagram, Twitter, Youtube, ChevronRight, Play, ArrowRight, 
  Car, Settings, DollarSign, ThumbsUp, MessageCircle, FileText, 
  HelpCircle, BookOpen, Video, Image as ImageIcon, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-slide for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '10,000+', label: 'Interventions réalisées', icon: <CheckCircle className="w-6 h-6" /> },
    { value: '500+', label: 'Mécaniciens vérifiés', icon: <Users className="w-6 h-6" /> },
    { value: '4.9/5', label: 'Note moyenne', icon: <Star className="w-6 h-6" /> },
    { value: '30 min', label: 'Temps de réponse', icon: <Clock className="w-6 h-6" /> },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Mécaniciens Vérifiés',
      description: 'Tous nos mécaniciens sont certifiés et vérifiés pour votre tranquillité',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Prix Transparents',
      description: 'Proposez votre prix et comparez les offres en toute transparence',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Intervention Rapide',
      description: 'Mécaniciens disponibles 24/7 avec temps de réponse moyen de 30 minutes',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Garantie Qualité',
      description: 'Garantie sur toutes les interventions avec support client dédié',
    },
  ];

  const weeklyPromos = [
    {
      title: 'Pack Vidange Premium',
      discount: '-20%',
      description: 'Vidange + filtre à huile + diagnostic complet',
      originalPrice: '450 MAD',
      promoPrice: '360 MAD',
      validUntil: 'Dimanche',
      icon: '🛢️',
    },
    {
      title: 'Check-up Complet',
      discount: '-15%',
      description: 'Inspection 50 points de contrôle + rapport détaillé',
      originalPrice: '350 MAD',
      promoPrice: '297 MAD',
      validUntil: 'Vendredi',
      icon: '🔍',
    },
    {
      title: 'Pack Freins Sécurité',
      discount: '-25%',
      description: 'Remplacement plaquettes + disques + purge liquide',
      originalPrice: '1,200 MAD',
      promoPrice: '900 MAD',
      validUntil: 'Samedi',
      icon: '🛑',
    },
  ];

  const giftPlans = [
    {
      name: 'Bronze',
      price: 'Gratuit',
      color: 'from-amber-600 to-amber-700',
      icon: '🥉',
      benefits: ['Accès basique', '1 point/10 MAD', 'Support standard'],
    },
    {
      name: 'Silver',
      price: '99 MAD/mois',
      color: 'from-slate-400 to-slate-500',
      icon: '🥈',
      benefits: ['Diagnostic gratuit/mois', '10% réduction', '2x points', 'Support prioritaire'],
      popular: false,
    },
    {
      name: 'Gold',
      price: '199 MAD/mois',
      color: 'from-yellow-500 to-yellow-600',
      icon: '🥇',
      benefits: ['1 vidange offerte/mois', '15% réduction', '3x points', 'Mécanicien dédié'],
      popular: true,
    },
    {
      name: 'Platinum',
      price: '399 MAD/mois',
      color: 'from-purple-500 to-purple-600',
      icon: '💎',
      benefits: ['Entretien complet offert', '20% réduction', '5x points', 'VIP 24/7', 'Voiture de remplacement'],
    },
  ];

  const successStories = [
    {
      image: 'https://images.pexels.com/photos/3804425/pexels-photo-3804425.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Amine a trouvé sa BMW série 3',
      description: 'Grâce à mecaGO, Amine a fait inspecter sa BMW par un expert certifié. Résultat : voiture en parfait état achetée 15% moins cher que le prix du marché !',
      savings: '12,000 MAD économisés',
      rating: 5,
    },
    {
      image: 'https://images.pexels.com/photos/3762840/pexels-photo-3762840.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sara a évité une mauvaise affaire',
      description: 'Notre inspection pré-achat a révélé des problèmes cachés sur une voiture d\'occasion. Sara a évité une mauvaise affaire et trouvé mieux ailleurs.',
      savings: '25,000 MAD évités',
      rating: 5,
    },
    {
      image: 'https://images.pexels.com/photos/3804460/pexels-photo-3804460.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Karim a vendu sa voiture plus cher',
      description: 'Avec le passeport véhicule mecaGO, Karim a prouvé l\'entretien régulier de sa voiture et l\'a vendue 20% plus cher que le prix du marché.',
      savings: '8,000 MAD de plus',
      rating: 5,
    },
  ];

  const opportunities = [
    {
      icon: <Wrench className="w-6 h-6" />,
      title: 'Devenez Mécanicien Partenaire',
      description: 'Rejoignez notre réseau de 500+ mécaniciens vérifiés et développez votre activité',
      cta: 'Postuler maintenant',
      route: '/mechanic/login',
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: 'Vendez vos Pièces',
      description: 'Ouvrez votre boutique sur mecaGO et atteignez des milliers de clients',
      cta: 'Ouvrir une boutique',
      route: '/seller/login',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Spécialiste Tuning',
      description: 'Proposez vos préparations Stage 1-3 à une communauté de passionnés',
      cta: 'Rejoindre comme tuner',
      route: '/login',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Programme de Parrainage',
      description: 'Gagnez 50 MAD pour chaque ami invité qui effectue sa première intervention',
      cta: 'Inviter des amis',
      route: '/gift-plans',
    },
  ];

  const testimonials = [
    {
      name: 'Amine Khalid',
      role: 'Client Premium',
      avatar: '👨‍💼',
      rating: 5,
      jobs: 2500,
      text: 'Service exceptionnel ! J\'ai utilisé mecaGO plus de 2500 fois. Les mécaniciens sont professionnels et les prix sont très compétitifs.',
    },
    {
      name: 'Ahmed Benali',
      role: 'Mécanicien Expert',
      avatar: '👨‍🔧',
      rating: 5,
      jobs: 3000,
      text: 'En 15 ans de métier, c\'est la meilleure plateforme que j\'ai utilisée. Plus de 3000 interventions réalisées avec une note de 5 étoiles.',
    },
    {
      name: 'Youssef "Speed" El Mansouri',
      role: 'Tuner Spécialiste',
      avatar: '🏎️',
      rating: 5,
      jobs: 1500,
      text: 'Spécialiste Stage 1-3 avec 1500 préparations réussies. La plateforme m\'a permis de développer mon activité de tuning.',
    },
  ];

  const services = [
    { icon: '🛞', title: 'Pneus', description: 'Crevaison, changement, équilibrage' },
    { icon: '🛢️', title: 'Vidange', description: 'Huile moteur, filtre' },
    { icon: '🔍', title: 'Diagnostic', description: 'Scan électronique, erreurs' },
    { icon: '🔋', title: 'Batterie', description: 'Remplacement, test' },
    { icon: '🛑', title: 'Freins', description: 'Plaquettes, disques' },
    { icon: '❄️', title: 'Climatisation', description: 'Recharge, réparation' },
    { icon: '🏎️', title: 'Tuning', description: 'Préparation moteur' },
    { icon: '🔧', title: 'Accessoires', description: 'Pièces, accessoires' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">mecaGO</span>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">Services</a>
            <a href="#promos" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">Promos</a>
            <a href="#opportunities" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">Opportunités</a>
            <a href="#stories" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">Succès</a>
            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <Button size="sm" onClick={() => navigate('/login')}>Se connecter</Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4">
            <nav className="flex flex-col gap-4 px-4">
              <a href="#services" className="text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#promos" className="text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Promos</a>
              <a href="#opportunities" className="text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Opportunités</a>
              <a href="#stories" className="text-sm text-slate-600" onClick={() => setMobileMenuOpen(false)}>Succès</a>
              <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className="text-sm text-slate-600 text-left">
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>
              <Button size="sm" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Se connecter</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-3.5 h-3.5" /> Casablanca, Maroc
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Votre mécanicien vient chez vous
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Proposez votre prix. Choisissez votre mécanicien vérifié. Réparation à domicile à Casablanca.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <Button size="lg" onClick={() => navigate('/login')}>
                Demander une réparation →
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Je suis mécanicien
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-emerald-600 mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nos Services</h2>
            <p className="text-lg text-slate-600">8 services essentiels pour votre véhicule</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/new-request-enhanced')}>
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Promos Section */}
      <section id="promos" className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Promotions Hebdomadaires
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Offres de la Semaine</h2>
            <p className="text-lg text-slate-600">Économisez jusqu'à 25% sur nos services</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {weeklyPromos.map((promo, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{promo.icon}</div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {promo.discount}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{promo.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{promo.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-slate-400 line-through">{promo.originalPrice}</span>
                  <span className="text-2xl font-bold text-emerald-600">{promo.promoPrice}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Valable jusqu'à {promo.validUntil}</span>
                  <Button size="sm" onClick={() => navigate('/customer/new-request-enhanced')}>
                    Profiter →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Plans Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              Programme Fidélité
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nos Plans Gift</h2>
            <p className="text-lg text-slate-600">Choisissez le plan qui vous convient</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {giftPlans.map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border-2 ${plan.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200'} hover:shadow-lg transition-shadow`}>
                {plan.popular && (
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">
                    ⭐ Le plus populaire
                  </div>
                )}
                <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="text-2xl font-bold text-slate-900 mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {plan.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button fullWidth variant={plan.popular ? 'primary' : 'outline'} onClick={() => navigate('/gift-plans')}>
                  Choisir ce plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-16 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Opportunités</h2>
            <p className="text-lg text-slate-600">Rejoignez notre communauté et développez votre activité</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opportunity, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                    {opportunity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{opportunity.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{opportunity.description}</p>
                    <Button size="sm" onClick={() => navigate(opportunity.route)}>
                      {opportunity.cta} →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="stories" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Histoires de Succès
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ils ont trouvé la bonne voiture</h2>
            <p className="text-lg text-slate-600">Grâce à notre service d'inspection expert</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {story.savings}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(story.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{story.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ils nous font confiance</h2>
            <p className="text-lg text-slate-600">Découvrez les témoignages de notre communauté</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-slate-500 ml-2">{testimonial.jobs} jobs</span>
                </div>
                <p className="text-sm text-slate-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à essayer mecaGO ?</h2>
          <p className="text-lg opacity-90 mb-8">Rejoignez plus de 10,000 clients satisfaits</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
              Commencer maintenant →
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/gift-plans')}>
              Voir nos plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-white">mecaGO</span>
              </div>
              <p className="text-sm mb-4">La plateforme de référence pour la réparation automobile à domicile à Casablanca.</p>
              <div className="flex gap-3">
                <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/customer/new-request-enhanced')} className="hover:text-white transition-colors">Réparation auto</button></li>
                <li><button onClick={() => navigate('/customer/inspection/book')} className="hover:text-white transition-colors">Inspection pré-achat</button></li>
                <li><button onClick={() => navigate('/customer/new-request-enhanced')} className="hover:text-white transition-colors">Diagnostic</button></li>
                <li><button onClick={() => navigate('/tuner/speed-tuning-casa')} className="hover:text-white transition-colors">Tuning</button></li>
                <li><button onClick={() => navigate('/customer/maintenance')} className="hover:text-white transition-colors">Entretien régulier</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">À propos</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-white transition-colors">Carrières</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
                <li><button onClick={() => navigate('/press')} className="hover:text-white transition-colors">Presse</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/help')} className="hover:text-white transition-colors">Centre d'aide</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">FAQ</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Conditions d'utilisation</button></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Politique de confidentialité</button></li>
                <li><button onClick={() => navigate('/safety')} className="hover:text-white transition-colors">Sécurité</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 mecaGO. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
