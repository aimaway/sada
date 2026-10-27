import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Car, MapPin, Heart, CreditCard, Clock, Bell, Settings, ChevronRight, Star, TrendingUp, Gift } from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  // Mock data - In production, this would come from the backend
  const activeRequests = [
    { id: 'req1', status: 'pending', icon: '🔋', title: 'Batterie', price: 250, timeAgo: '5 min' },
  ];

  const currentPlan = {
    name: 'Gold',
    price: 199,
    benefits: ['1 vidange offerte/mois', '15% réduction', 'Mécanicien dédié'],
  };

  const availablePromotions = [
    { id: 'promo1', title: '🎁 -20% sur votre prochaine vidange', expires: '31 Mars' },
    { id: 'promo2', title: '🔧 Diagnostic gratuit', expires: '15 Avril' },
  ];

  const garage = [
    { id: 'v1', make: 'Dacia', model: 'Logan', year: 2019, plate: '12345-A-1' },
    { id: 'v2', make: 'Peugeot', model: '208', year: 2021, plate: '67890-B-2' },
  ];

  const savedAddresses = [
    { id: 'addr1', label: 'Maison', address: 'Bd Zerktouni, Casablanca' },
    { id: 'addr2', label: 'Bureau', address: 'Ain Diab, Casablanca' },
  ];

  const recentOrders = [
    { id: 'order1', date: '2024-03-15', provider: 'Ahmed B.', service: 'Vidange', price: 350, status: 'completed' },
    { id: 'order2', date: '2024-03-10', provider: 'Karim T.', service: 'Freins', price: 480, status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Mon Espace</h1>
            <p className="text-sm opacity-90">Bonjour {user?.full_name || 'Client'} 👋</p>
          </div>
          <button onClick={() => navigate('/customer/profile')} className="p-2 bg-white/20 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs opacity-90">Jobs</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-xs opacity-90">Note moy.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">1,250</p>
            <p className="text-xs opacity-90">Points</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Demandes en cours</h2>
            <div className="space-y-2">
              {activeRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{req.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{req.title}</p>
                      <p className="text-sm text-slate-500">{req.price} MAD • {req.timeAgo}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      En attente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-800">Plan {currentPlan.name}</h3>
            </div>
            <span className="text-lg font-bold text-amber-600">{currentPlan.price} MAD/mois</span>
          </div>
          <div className="space-y-1 mb-3">
            {currentPlan.benefits.map((benefit, i) => (
              <p key={i} className="text-sm text-slate-700 flex items-center gap-2">
                <span className="text-amber-600">✓</span>
                {benefit}
              </p>
            ))}
          </div>
          <button
            onClick={() => navigate('/gift-plans')}
            className="w-full py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
          >
            Gérer mon abonnement
          </button>
        </div>

        {/* Available Promotions */}
        {availablePromotions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Promotions disponibles</h2>
            <div className="space-y-2">
              {availablePromotions.map((promo) => (
                <div key={promo.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{promo.title}</p>
                    <span className="text-xs text-slate-500">Expire {promo.expires}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">Accès rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/customer/new-request-enhanced')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">🔧</div>
              <p className="text-sm font-medium text-slate-800">Nouvelle demande</p>
            </button>
            <button
              onClick={() => navigate('/customer/documents-manage')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm font-medium text-slate-800">Documents</p>
            </button>
            <button
              onClick={() => navigate('/customer/wallet')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">💳</div>
              <p className="text-sm font-medium text-slate-800">Portefeuille</p>
            </button>
            <button
              onClick={() => navigate('/customer/notifications')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow relative"
            >
              <div className="text-2xl mb-2">🔔</div>
              <p className="text-sm font-medium text-slate-800">Notifications</p>
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Garage */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">Mon Garage</h2>
            <button onClick={() => navigate('/customer/vehicles')} className="text-sm text-emerald-600 font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            {garage.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <Car className="w-8 h-8 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-slate-500">{vehicle.plate}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Addresses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">Adresses enregistrées</h2>
            <button onClick={() => navigate('/customer/addresses')} className="text-sm text-emerald-600 font-medium">
              Gérer
            </button>
          </div>
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{addr.label}</p>
                    <p className="text-sm text-slate-500">{addr.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">Historique</h2>
            <button onClick={() => navigate('/customer/orders')} className="text-sm text-emerald-600 font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-800">{order.service}</p>
                    <p className="text-sm text-slate-500">Par {order.provider}</p>
                  </div>
                  <span className="text-lg font-bold text-slate-800">{order.price} MAD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {new Date(order.date).toLocaleDateString('fr-FR')}
                  </span>
                  <button
                    onClick={() => navigate('/customer/new-request-enhanced')}
                    className="text-xs text-emerald-600 font-medium"
                  >
                    Rebooker →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Providers */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">Découvrir</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/discover?tab=mechanics')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">🔧</div>
              <p className="text-xs font-medium text-slate-800">Mécaniciens</p>
            </button>
            <button
              onClick={() => navigate('/discover?tab=tuners')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">🏎️</div>
              <p className="text-xs font-medium text-slate-800">Tuners</p>
            </button>
            <button
              onClick={() => navigate('/discover?tab=sellers')}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">🏪</div>
              <p className="text-xs font-medium text-slate-800">Vendeurs</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
