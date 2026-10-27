import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MessageCircle, Mail, Smartphone } from 'lucide-react';

export const TunerNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    newRequests: true,
    requestUpdates: true,
    messages: true,
    payments: true,
    promotions: false,
    newsletter: false,
  });

  const [channels, setChannels] = useState({
    push: true,
    email: true,
    sms: false,
    whatsapp: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleChannelToggle = (key: keyof typeof channels) => {
    setChannels({ ...channels, [key]: !channels[key] });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
        </div>
        <p className="text-sm text-slate-600">Configurez vos préférences de notification</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Notification Types */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Types de notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Nouvelles demandes</p>
                <p className="text-xs text-slate-500">Quand un client demande vos services</p>
              </div>
              <button
                onClick={() => handleToggle('newRequests')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newRequests ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Mises à jour des demandes</p>
                <p className="text-xs text-slate-500">Statut des demandes en cours</p>
              </div>
              <button
                onClick={() => handleToggle('requestUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.requestUpdates ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.requestUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Messages</p>
                <p className="text-xs text-slate-500">Messages des clients</p>
              </div>
              <button
                onClick={() => handleToggle('messages')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.messages ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.messages ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Paiements</p>
                <p className="text-xs text-slate-500">Confirmations de paiement et rechargements</p>
              </div>
              <button
                onClick={() => handleToggle('payments')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.payments ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.payments ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Promotions</p>
                <p className="text-xs text-slate-500">Offres spéciales et réductions</p>
              </div>
              <button
                onClick={() => handleToggle('promotions')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.promotions ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.promotions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Newsletter</p>
                <p className="text-xs text-slate-500">Actualités et conseils tuning</p>
              </div>
              <button
                onClick={() => handleToggle('newsletter')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newsletter ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newsletter ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-red-600" />
            Canaux de notification
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Push notifications</p>
                  <p className="text-xs text-slate-500">Notifications sur votre appareil</p>
                </div>
              </div>
              <button
                onClick={() => handleChannelToggle('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  channels.push ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    channels.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Email</p>
                  <p className="text-xs text-slate-500">Notifications par email</p>
                </div>
              </div>
              <button
                onClick={() => handleChannelToggle('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  channels.email ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    channels.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">WhatsApp</p>
                  <p className="text-xs text-slate-500">Notifications via WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => handleChannelToggle('whatsapp')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  channels.whatsapp ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    channels.whatsapp ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">SMS</p>
                  <p className="text-xs text-slate-500">Notifications par SMS</p>
                </div>
              </div>
              <button
                onClick={() => handleChannelToggle('sms')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  channels.sms ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    channels.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Heures de tranquillité</h3>
          <p className="text-sm text-slate-600 mb-3">
            Désactivez les notifications pendant ces heures
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">De</label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">À</label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => {
            alert('Préférences sauvegardées !');
            navigate('/tuner/dashboard');
          }}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
        >
          Sauvegarder les préférences
        </button>
      </div>
    </div>
  );
};
