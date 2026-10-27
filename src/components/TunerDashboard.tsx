import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Award, Shield, Share2, Camera, Video, MessageCircle, Phone, Heart, Flag, ChevronRight, DollarSign, TrendingUp, Eye, Settings, Image, Package } from 'lucide-react';
import { mockTunerData } from '../data/mockDataGlobal';

export const TunerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'gallery' | 'wallet' | 'settings'>('overview');
  const tuner = mockTunerData;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('settings')} className="p-2 bg-white/20 rounded-full">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-6xl">{tuner.profile.logo}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{tuner.profile.name}</h1>
              {tuner.profile.verified && <Shield className="w-5 h-5 text-white" />}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>{tuner.profile.rating} ({tuner.profile.totalReviews} avis)</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
              <Award className="w-4 h-4" />
              <span>{tuner.profile.yearsExperience} ans d'expérience</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{tuner.profile.totalJobs}</p>
            <p className="text-xs opacity-90">Préparations</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{tuner.stages.length}</p>
            <p className="text-xs opacity-90">Stages</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{tuner.profile.rating}</p>
            <p className="text-xs opacity-90">Note</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Aperçu', icon: <Eye className="w-4 h-4" /> },
            { id: 'orders', label: 'Commandes', icon: <Package className="w-4 h-4" /> },
            { id: 'gallery', label: 'Galerie', icon: <Image className="w-4 h-4" /> },
            { id: 'wallet', label: 'Portefeuille', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'settings', label: 'Paramètres', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1 whitespace-nowrap px-2 ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Plan {tuner.currentPlan.name}
                </h3>
                <span className="text-sm font-bold text-amber-600">{tuner.currentPlan.price} MAD/mois</span>
              </div>
              <div className="space-y-2 mb-3">
                {tuner.currentPlan.features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-amber-600">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/tuner/plans')}
                className="w-full py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
              >
                Gérer mon abonnement
              </button>
            </div>

            {/* Stages */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Stages proposés</h3>
              <div className="space-y-3">
                {tuner.stages.map((stage) => (
                  <div key={stage.level} className={`bg-white p-4 rounded-2xl border-2 ${stage.popular ? 'border-red-500' : 'border-slate-200'}`}>
                    {stage.popular && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                        ⭐ Populaire
                      </div>
                    )}
                    <h4 className="text-lg font-bold text-slate-800 mb-2">{stage.name}</h4>
                    <p className="text-sm text-slate-600 mb-3">{stage.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-sm text-slate-600">{stage.priceRange}</span>
                      <span className="text-xs text-slate-500">{stage.features.length} services</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Commandes récentes</h3>
                <button onClick={() => setActiveTab('orders')} className="text-sm text-red-600 font-medium">
                  Voir tout →
                </button>
              </div>
              <div className="space-y-2">
                {tuner.orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-800">{order.client}</p>
                        <p className="text-xs text-slate-500">{order.vehicle} • {order.stage}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-800">{order.price} MAD</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-800">{order.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Preview */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Demandes à proximité</h3>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-br from-red-100 to-orange-100 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Carte des demandes</p>
                    <p className="text-xs text-slate-500 mt-1">3 demandes dans votre zone</p>
                  </div>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => navigate('/tuner/requests-map')}
                    className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
                  >
                    Voir la carte complète
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 mb-3">Historique des commandes</h3>
            {tuner.orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-800">{order.client}</p>
                    <p className="text-xs text-slate-500">{order.vehicle} • {order.stage}</p>
                  </div>
                  <span className="text-lg font-bold text-slate-800">{order.price} MAD</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-slate-800">{order.rating}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {order.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Galerie avant/après</h3>
              <button
                onClick={() => navigate('/tuner/gallery-upload')}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                + Ajouter
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {tuner.gallery.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="aspect-square bg-slate-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-slate-800">{item.vehicle}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                      {item.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Videos */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Vidéos</h3>
              <div className="space-y-2">
                {tuner.videos.map((video) => (
                  <div key={video.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                    <Video className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{video.title}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-2xl p-6">
              <p className="text-sm opacity-90 mb-1">Solde disponible</p>
              <p className="text-4xl font-bold">{(tuner.wallet.balance / 100).toFixed(0)} <span className="text-lg font-normal opacity-80">MAD</span></p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min(100, (tuner.wallet.balance / (tuner.wallet.minBalance * 4)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs opacity-80">Min: {(tuner.wallet.minBalance / 100).toFixed(0)} MAD</span>
              </div>
            </div>

            {/* Recharge Button */}
            <button
              onClick={() => navigate('/tuner/wallet-recharge')}
              className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
            >
              + Recharger le portefeuille
            </button>

            {/* Transactions */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Transactions récentes</h3>
              <div className="space-y-2">
                {tuner.wallet.transactions.map((tx) => (
                  <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {tx.type === 'credit' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{tx.description}</p>
                          <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{(tx.amount / 100).toFixed(0)} MAD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => navigate('/tuner/profile-edit')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">Modifier le profil</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/tuner/services')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">Gérer les stages</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/tuner/notifications')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">Notifications</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/tuner/payment-methods')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">Méthodes de paiement</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/tuner/plans')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">Plans & Abonnements</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <button
              onClick={() => {
                // Logout
                navigate('/');
              }}
              className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
