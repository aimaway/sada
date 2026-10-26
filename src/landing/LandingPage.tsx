import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button } from '../shared/components';
import { Wrench, MapPin, Shield, Star, Clock, Users, Award, TrendingUp, CheckCircle, Zap, Heart } from 'lucide-react';
import { PremiumAccounts } from '../components/PremiumAccounts';

export default function LandingPage() {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();

  const stats = [
    { value: '10,000+', label: 'Interventions réalisées', icon: <CheckCircle className="w-6 h-6" /> },
    { value: '500+', label: 'Mécaniciens vérifiés', icon: <Users className="w-6 h-6" /> },
    { value: '4.9/5', label: 'Note moyenne', icon: <Star className="w-6 h-6" /> },
    { value: '30 min', label: 'Temps de réponse moyen', icon: <Clock className="w-6 h-6" /> },
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

  const testimonials = [
    {
      name: 'Amine Khalid',
      role: 'Client Premium',
      avatar: '👨‍💼',
      rating: 5,
      jobs: 2500,
      text: 'Service exceptionnel ! J\'ai utilisé MécaCasablanca plus de 2500 fois. Les mécaniciens sont professionnels et les prix sont très compétitifs.',
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
    {
      name: 'Karim Tazi',
      role: 'Vendeur Établi',
      avatar: '🏪',
      rating: 5,
      jobs: 2000,
      text: 'AutoPièces Maroc a réalisé plus de 2000 ventes via la plateforme. Les partenariats avec les mécaniciens sont excellents.',
    },
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
            <span className="font-bold text-lg text-slate-800">MécaCasablanca</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 rounded-lg">
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <Button size="sm" onClick={() => navigate('/login')}>Se connecter</Button>
          </div>
        </div>
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
              <Button size="lg" onClick={() => navigate('/customer/login')}>
                Pour les clients →
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/mechanic/login')}>
                Pour les mécaniciens
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pourquoi choisir MécaCasablanca ?</h2>
            <p className="text-lg text-slate-600">La plateforme de référence pour la réparation automobile à domicile</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-emerald-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Demo Section */}
      <section className="py-12 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4">🎮 Mode Démo</span>
            <h2 className="text-2xl font-bold text-white mb-2">Tester l'application</h2>
            <p className="text-slate-400 text-sm">Connectez-vous avec l'un de nos comptes de démonstration</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { emoji: '👤', title: 'Client', desc: 'Nouveau ou existant', color: 'bg-emerald-600', route: '/customer/login' },
              { emoji: '🔧', title: 'Mécanicien', desc: 'Approuvé ou nouveau', color: 'bg-blue-600', route: '/mechanic/login' },
              { emoji: '🏪', title: 'Vendeur', desc: 'Boutique & partenariats', color: 'bg-purple-600', route: '/seller/login' },
              { emoji: '🛡️', title: 'Admin', desc: 'Panneau admin', color: 'bg-slate-600', route: '/admin/login' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-700/50 rounded-2xl p-5 border border-slate-600 hover:border-emerald-500 transition-colors">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                <button onClick={() => navigate(item.route)} className={`w-full ${item.color} text-white rounded-xl py-2 text-sm font-medium hover:opacity-90 transition-opacity`}>
                  Connexion
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Accounts Section */}
      <PremiumAccounts />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-white">MécaCasablanca</span>
              </div>
              <p className="text-sm">La plateforme de référence pour la réparation automobile à domicile à Casablanca.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Réparation auto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Entretien véhicule</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Diagnostic</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuning</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 MécaCasablanca. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
