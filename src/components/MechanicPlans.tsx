import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star, Crown, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../shared/context';

export const MechanicPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const mechanicPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      color: 'from-slate-500 to-slate-600',
      icon: '🔧',
      benefits: [
        'Commission 10%',
        'Accès aux demandes basiques',
        'Profil de base',
        'Support standard',
        '3 services débloqués',
      ],
      current: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 149,
      color: 'from-blue-500 to-blue-600',
      icon: '⭐',
      benefits: [
        'Commission 8%',
        'Badge "Pro" vérifié',
        'Visibilité accrue',
        'Support prioritaire',
        'Statistiques avancées',
        '6 services débloqués',
        'Accès aux demandes urgentes',
      ],
      current: false,
    },
    {
      id: 'expert',
      name: 'Expert',
      price: 299,
      color: 'from-purple-500 to-purple-600',
      icon: '🏆',
      benefits: [
        'Commission 5%',
        'Badge "Expert" premium',
        'Top visibilité',
        'Support VIP 24/7',
        'Formation continue',
        'Outils marketing',
        'Tous services débloqués',
        'Accès aux demandes premium',
        'Priorité dans les résultats',
      ],
      current: false,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/mechanic/profile-enhanced')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Mes Abonnements</h1>
            <p className="text-sm opacity-90">Gérez votre plan mécanicien</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Current Plan Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              Plan actuel
            </h3>
            <span className="text-sm font-bold text-blue-600">Starter</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Commission</span>
              <span className="font-medium text-slate-800">10%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Services débloqués</span>
              <span className="font-medium text-slate-800">3 / 8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Visibilité</span>
              <span className="font-medium text-slate-800">Standard</span>
            </div>
          </div>
        </div>

        {/* Plans List */}
        {mechanicPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden ${
              plan.popular ? 'border-blue-500' : plan.current ? 'border-emerald-500' : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <div className="bg-blue-500 text-white px-4 py-2 text-center text-sm font-medium">
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600" />
            Avantages des plans professionnels
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-slate-700">Réduisez votre commission jusqu'à 5%</p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-slate-700">Débloquez plus de services et de demandes</p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-slate-700">Augmentez votre visibilité et vos revenus</p>
            </div>
            <div className="flex items-start gap-2">
              <Crown className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-slate-700">Accédez à des formations et outils exclusifs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
