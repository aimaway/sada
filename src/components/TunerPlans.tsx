import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star, Crown, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../shared/context';

export const TunerPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const tunerPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      color: 'from-slate-500 to-slate-600',
      icon: '🏎️',
      benefits: [
        'Commission 10%',
        'Profil de base',
        'Support standard',
        '1 stage proposé',
        'Galerie limitée (10 photos)',
      ],
      current: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 249,
      color: 'from-red-500 to-orange-600',
      icon: '⭐',
      benefits: [
        'Commission 7%',
        'Badge "Pro Tuner"',
        'Visibilité accrue',
        'Support prioritaire',
        '3 stages proposés',
        'Galerie illimitée',
        'Vidéos autorisées',
        'Statistiques avancées',
      ],
      current: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 499,
      color: 'from-amber-500 to-red-600',
      icon: '🏆',
      benefits: [
        'Commission 5%',
        'Badge "Elite Tuner"',
        'Top visibilité',
        'Support VIP 24/7',
        'Tous stages proposés',
        'Galerie illimitée + vidéos HD',
        'Mise en avant communautaire',
        'Account manager dédié',
        'Formation continue',
        'Accès aux événements tuning',
        'Partenariats exclusifs',
      ],
      current: false,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Mes Abonnements</h1>
            <p className="text-sm opacity-90">Gérez votre plan tuner</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Current Plan Summary */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-red-600" />
              Plan actuel
            </h3>
            <span className="text-sm font-bold text-red-600">Basic</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Commission</span>
              <span className="font-medium text-slate-800">10%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Stages proposés</span>
              <span className="font-medium text-slate-800">1 / 5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Galerie</span>
              <span className="font-medium text-slate-800">2 / 10 photos</span>
            </div>
          </div>
        </div>

        {/* Plans List */}
        {tunerPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden ${
              plan.popular ? 'border-red-500' : plan.current ? 'border-emerald-500' : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
                ⭐ Le plus populaire
              </div>
            )}

            {plan.current && (
              <div className="bg-emerald-500 text-white px-4 py-2 text-center text-sm font-medium">
                ✓ Plan actuel
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-3xl`}>
                  {plan.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{plan.price}</span>
                    <span className="text-sm text-slate-500">MAD/mois</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {plan.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={plan.current}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  plan.current
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                }`}
              >
                {plan.current ? 'Plan actuel' : plan.price === 0 ? 'Commencer gratuitement' : 'S\'abonner'}
              </button>
            </div>
          </div>
        ))}

        {/* Benefits Summary */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-red-600" />
            Avantages des plans tuners
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-sm text-slate-700">Réduisez votre commission jusqu'à 5%</p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-sm text-slate-700">Proposez plus de stages de préparation</p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-sm text-slate-700">Mettez en valeur vos réalisations</p>
            </div>
            <div className="flex items-start gap-2">
              <Crown className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-sm text-slate-700">Accédez à la communauté tuning exclusive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
