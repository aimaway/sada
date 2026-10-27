import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bell, MessageCircle, Mail, Smartphone, Save, CheckCircle2,
  Package, CreditCard, Star, AlertCircle, Wrench, DollarSign
} from 'lucide-react';

export const MechanicNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    // Types de notifications
    newRequests: true,
    requestUpdates: true,
    messages: true,
    payments: true,
    payouts: true,
    reviews: true,
    promotions: false,
    systemUpdates: true,

    // Canaux
    push: true,
    email: true,
    sms: false,
    whatsapp: true,
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    from: '22:00',
    to: '08:00',
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = () => {
    alert('Préférences de notifications sauvegardées !');
    navigate('/mechanic/profile');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mechanic/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
              <p className="text-xs text-slate-500">Configurez vos préférences</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Notification Types */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Types de notifications
          </h3>
          <div className="space-y-3">
            {[
              { key: 'newRequests', label: 'Nouvelles demandes', desc: 'Quand un client vous envoie une demande', icon: <Package className="w-4 h-4" /> },
              { key: 'requestUpdates', label: 'Mises à jour des demandes', desc: 'Changements de statut des demandes', icon: <AlertCircle className="w-4 h-4" /> },
              { key: 'messages', label: 'Messages', desc: 'Messages des clients', icon: <MessageCircle className="w-4 h-4" /> },
              { key: 'payments', label: 'Paiements', desc: 'Confirmations de paiement des clients', icon: <CreditCard className="w-4 h-4" /> },
              { key: 'payouts', label: 'Retraits', desc: 'Confirmations de vos retraits', icon: <DollarSign className="w-4 h-4" /> },
              { key: 'reviews', label: 'Avis', desc: 'Nouveaux avis clients', icon: <Star className="w-4 h-4" /> },
              { key: 'promotions', label: 'Promotions', desc: 'Offres spéciales et bonus', icon: <Star className="w-4 h-4" /> },
              { key: 'systemUpdates', label: 'Mises à jour système', desc: 'Nouvelles fonctionnalités et maintenance', icon: <Wrench className="w-4 h-4" /> },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(item.key as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Canaux de notification
          </h3>
          <div className="space-y-3">
            {[
              { key: 'push', label: 'Push notifications', desc: 'Notifications sur votre appareil', icon: <Bell className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
              { key: 'email', label: 'Email', desc: 'Notifications par email', icon: <Mail className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
              { key: 'whatsapp', label: 'WhatsApp', desc: 'Notifications via WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
              { key: 'sms', label: 'SMS', desc: 'Notifications par SMS', icon: <Smartphone className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(item.key as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Heures de tranquillité
              </h3>
              <p className="text-xs text-slate-500 mt-1">Désactivez les notifications pendant ces heures</p>
            </div>
            <button
              onClick={() => setQuietHours({ ...quietHours, enabled: !quietHours.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                quietHours.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">De</label>
                <input
                  type="time"
                  value={quietHours.from}
                  onChange={(e) => setQuietHours({ ...quietHours, from: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">À</label>
                <input
                  type="time"
                  value={quietHours.to}
                  onChange={(e) => setQuietHours({ ...quietHours, to: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Notifications importantes</p>
              <p className="text-xs text-blue-700 mt-1">
                Les notifications critiques (nouvelles demandes, paiements) seront toujours envoyées, même pendant les heures de tranquillité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
