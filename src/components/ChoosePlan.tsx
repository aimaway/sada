import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../shared/context';
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

// Mock plans data - In production, this would come from the backend
const plans = {
  'client-gold': {
    slug: 'client-gold',
    audience: 'client',
    name: 'Gold',
    price: 199,
    features: ['1 vidange offerte/mois', '15% réduction', 'Mécanicien dédié', '3x points fidélité'],
    status: 'active',
  },
  'mechanic-pro': {
    slug: 'mechanic-pro',
    audience: 'mechanic',
    name: 'Pro',
    price: 149,
    features: ['Commission 8%', 'Badge Pro', 'Visibilité accrue', 'Support prioritaire'],
    status: 'active',
  },
  'seller-business': {
    slug: 'seller-business',
    audience: 'seller',
    name: 'Business',
    price: 199,
    features: ['Produits illimités', 'Commission 3%', 'Badge Business', 'Statistiques avancées'],
    status: 'active',
  },
};

export const ChoosePlan: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useApp();
  
  const planSlug = searchParams.get('plan');
  const plan = planSlug ? plans[planSlug as keyof typeof plans] : null;

  useEffect(() => {
    // Track funnel event
    console.log('Plan clicked:', planSlug);
  }, [planSlug]);

  // Handle invalid plan
  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Plan non trouvé</h2>
          <p className="text-slate-600 mb-6">
            Le plan que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <button
            onClick={() => navigate('/gift-plans')}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
          >
            Voir tous les plans
          </button>
        </div>
      </div>
    );
  }

  // Handle provider trying to select client plan
  if (user && user.role !== plan.audience && user.role !== 'customer') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Plan incompatible</h2>
          <p className="text-slate-600 mb-6">
            Vous êtes connecté en tant que {user.role}. Ce plan est destiné aux {plan.audience}s.
          </p>
          <button
            onClick={() => navigate('/gift-plans')}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 mb-3"
          >
            Voir les plans {user.role}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handleActivate = () => {
    if (!user) {
      // Not logged in - redirect to login with plan context
      navigate(`/login?redirect=/choose-plan?plan=${plan.slug}`);
      return;
    }

    // Logged in - activate plan (mock)
    console.log('Activating plan:', plan.slug);
    
    // In production, this would call the backend API
    // For demo, we'll just show a success message
    alert(`Plan ${plan.name} activé avec succès ! (Simulation)`);
    
    // Track funnel event
    console.log('Plan activated:', plan.slug);
    
    // Redirect to appropriate portal
    if (plan.audience === 'client') {
      navigate('/customer/portal');
    } else if (plan.audience === 'mechanic') {
      navigate('/mechanic/portal');
    } else if (plan.audience === 'seller') {
      navigate('/seller/portal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            {plan.audience === 'client' && '👤'}
            {plan.audience === 'mechanic' && '🔧'}
            {plan.audience === 'seller' && '🏪'}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Plan {plan.name}</h2>
          <p className="text-3xl font-bold text-emerald-600">
            {plan.price} <span className="text-lg text-slate-500">MAD/mois</span>
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-600 mb-1">Connecté en tant que</p>
            <p className="font-medium text-slate-800">{user.full_name}</p>
            <p className="text-xs text-slate-500">{user.phone}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleActivate}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
          >
            {user ? 'Activer ce plan' : 'Se connecter et activer'}
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/gift-plans')}
            className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50"
          >
            Voir tous les plans
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-500 text-center mt-6">
          En activant ce plan, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
};
