import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Wrench, Car, Settings, Plus, Star, Shield, Gift, TrendingUp } from 'lucide-react';

export const CustomerHomeEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const frequentServices = [
    { id: 'tire', icon: '🛞', label: 'Pneu', color: 'from-blue-500 to-blue-600', description: 'Crevaison, changement, équilibrage' },
    { id: 'oil', icon: '🛢️', label: 'Vidange', color: 'from-green-500 to-green-600', description: 'Huile moteur, filtre' },
    { id: 'diagnostic', icon: '🔍', label: 'Diagnostic', color: 'from-purple-500 to-purple-600', description: 'Scan électronique, erreurs' },
    { id: 'accessory', icon: '🔧', label: 'Accessoire', color: 'from-orange-500 to-orange-600', description: 'Pièces, accessoires' },
  ];

  const benefits = [
    { icon: <Shield className="w-5 h-5" />, title: 'Garantie 30 jours', desc: 'Tous nos travaux sont garantis' },
    { icon: <Gift className="w-5 h-5" />, title: 'Programme fidélité', desc: 'Gagnez des points à chaque service' },
    { icon: <Star className="w-5 h-5" />, title: 'Mécaniciens vérifiés', desc: 'Professionnels certifiés' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Prix transparent', desc: 'Pas de frais cachés' },
  ];

  const rewards = [
    { level: 'Bronze', points: '0-500', benefit: '5% réduction', icon: '🥉' },
    { level: 'Silver', points: '500-1500', benefit: '10% réduction + diagnostic gratuit', icon: '🥈' },
    { level: 'Gold', points: '1500-3000', benefit: '15% réduction + 1 vidange offerte', icon: '🥇' },
    { level: 'Platinum', points: '3000+', benefit: '20% réduction + services prioritaires', icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Bonjour 👋</h1>
            <p className="text-sm opacity-90">Que pouvons-nous faire pour vous ?</p>
          </div>
          <button onClick={() => navigate('/customer/profile')} className="p-2 bg-white/20 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Frequent Services - Quick Access */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">Services fréquents</h2>
          <div className="grid grid-cols-2 gap-3">
            {frequentServices.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/customer/new-request?service=${service.id}`)}
                className={`bg-gradient-to-br ${service.color} text-white rounded-2xl p-4 text-left shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="font-bold text-lg">{service.label}</h3>
                <p className="text-xs opacity-90 mt-1">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Vos avantages</h2>
          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{benefit.title}</h3>
                  <p className="text-xs text-slate-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Program */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-800">Programme Fidélité</h2>
          </div>
          <div className="space-y-2">
            {rewards.map((reward, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="text-2xl">{reward.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm">{reward.level}</h3>
                    <span className="text-xs text-slate-500">{reward.points} pts</span>
                  </div>
                  <p className="text-xs text-slate-600">{reward.benefit}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600">
            Voir mes points
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/customer/documents')} className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">📄</div>
            <p className="text-xs font-medium text-slate-700">Documents</p>
          </button>
          <button onClick={() => navigate('/customer/maintenance')} className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🔧</div>
            <p className="text-xs font-medium text-slate-700">Entretien</p>
          </button>
          <button onClick={() => navigate('/customer/shop')} className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🛒</div>
            <p className="text-xs font-medium text-slate-700">Boutique</p>
          </button>
        </div>
      </div>
    </div>
  );
};
