import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star, Crown, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

export const GiftPlans: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'mechanic' | 'seller'>('customer');

  const customerPlans = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: 0,
      color: 'from-amber-600 to-amber-700',
      icon: '🥉',
      benefits: [
        'Accès à tous les services',
        'Support client standard',
        '1 point par 10 MAD dépensés',
      ],
      current: true,
    },
    {
      id: 'silver',
      name: 'Silver',
      price: 99,
      color: 'from-slate-400 to-slate-500',
      icon: '🥈',
      benefits: [
        'Tout Bronze +',
        'Diagnostic gratuit 1x/mois',
        '10% réduction sur entretiens',
        'Support prioritaire',
        '2x points fidélité',
      ],
      current: false,
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 199,
      color: 'from-yellow-500 to-yellow-600',
      icon: '🥇',
      benefits: [
        'Tout Silver +',
        '1 vidange offerte/mois',
        '15% réduction sur tout',
        'Mécanicien dédié',
        '3x points fidélité',
        'Annulations gratuites',
      ],
      current: false,
      popular: true,
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: 399,
      color: 'from-purple-500 to-purple-600',
      icon: '💎',
      benefits: [
        'Tout Gold +',
        'Entretien complet offert/mois',
        '20% réduction sur tout',
        'Service VIP 24/7',
        '5x points fidélité',
        'Voiture de remplacement',
        'Garantie étendue 1 an',
      ],
      current: false,
    },
  ];

  const mechanicPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      color: 'from-slate-500 to-slate-600',
      icon: '🔧',
      benefits: [
        'Commission 10%',
        'Accès aux demandes',
        'Profil de base',
        'Support standard',
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
      ],
      current: false,
      popular: true,
    },
  ];

  const sellerPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      color: 'from-slate-500 to-slate-600',
      icon: '🏪',
      benefits: [
        'Jusqu\'à 50 produits',
        'Commission 5%',
        'Profil de base',
        'Support standard',
      ],
      current: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: 199,
      color: 'from-green-500 to-green-600',
      icon: '📈',
      benefits: [
        'Produits illimités',
        'Commission 3%',
        'Badge "Business"',
        'Visibilité accrue',
        'Statistiques avancées',
        'Support prioritaire',
      ],
      current: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 499,
      color: 'from-amber-500 to-amber-600',
      icon: '💎',
      benefits: [
        'Tout Business +',
        'Commission 2%',
        'Badge "Premium"',
        'Top visibilité',
        'Marketing dédié',
        'Account manager',
        'Formation gratuite',
      ],
      current: false,
      popular: true,
    },
  ];

  const plans = userType === 'customer' ? customerPlans : userType === 'mechanic' ? mechanicPlans : sellerPlans;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Plans & Abonnements</h1>
        </div>
        <p className="text-sm opacity-90">Choisissez le plan qui vous convient</p>
      </div>

      {/* User Type Selector */}
      <div className="bg-white px-4 py-3 border-b border-slate-200">
        <div className="flex gap-2">
          {[
            { id: 'customer', label: 'Client', icon: '👤' },
            { id: 'mechanic', label: 'Mécanicien', icon: '🔧' },
            { id: 'seller', label: 'Vendeur', icon: '🏪' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setUserType(type.id as any)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                userType === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border-2 overflow-hidden ${
              plan.popular ? 'border-purple-500' : plan.current ? 'border-emerald-500' : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <div className="bg-purple-500 text-white px-4 py-2 text-center text-sm font-medium">
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
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            Avantages de l'abonnement
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5" />
              <p className="text-sm text-slate-700">Économisez jusqu'à 20% sur tous les services</p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
              <p className="text-sm text-slate-700">Accès prioritaire aux mécaniciens disponibles</p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-purple-600 mt-0.5" />
              <p className="text-sm text-slate-700">Points fidélité multipliés</p>
            </div>
            <div className="flex items-start gap-2">
              <Crown className="w-4 h-4 text-purple-600 mt-0.5" />
              <p className="text-sm text-slate-700">Services exclusifs et offres spéciales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
