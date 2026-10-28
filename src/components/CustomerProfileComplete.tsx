import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { mockClientData } from '../data/mockDataGlobal';
import {
  ArrowLeft, User, Car, MapPin, CreditCard, Bell, Shield, HelpCircle,
  FileText, LogOut, ChevronRight, Star, Award, Gift, Trash2, Globe,
  Moon, Sun, Smartphone, Mail, Phone, Camera, Edit2, CheckCircle2,
  AlertCircle, Clock, Package, Wrench, Heart, TrendingUp, Settings,
  Lock, Eye, EyeOff, Download, Share2, Bookmark
} from 'lucide-react';

export const CustomerProfileComplete: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, language, setLanguage } = useApp();
  const [activeSection, setActiveSection] = useState<string>('overview');

  const clientData = mockClientData;

  const menuSections = [
    {
      id: 'personal',
      title: 'Informations personnelles',
      icon: <User className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600',
      items: [
        { id: 'info', label: 'Profil', route: '/customer/profile/info', icon: <User className="w-4 h-4" /> },
        { id: 'security', label: 'Sécurité du compte', route: '/customer/profile/security', icon: <Lock className="w-4 h-4" /> },
      ],
    },
    {
      id: 'vehicles',
      title: 'Mes véhicules',
      icon: <Car className="w-5 h-5" />,
      color: 'bg-emerald-100 text-emerald-600',
      items: [
        { id: 'garage', label: 'Mon garage', route: '/customer/profile/vehicles', icon: <Car className="w-4 h-4" />, badge: clientData.vehicles.length.toString() },
        { id: 'maintenance', label: 'Historique maintenance', route: '/customer/profile/maintenance-history', icon: <Wrench className="w-4 h-4" /> },
      ],
    },
    {
      id: 'addresses',
      title: 'Adresses',
      icon: <MapPin className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600',
      items: [
        { id: 'addresses', label: 'Adresses enregistrées', route: '/customer/profile/addresses', icon: <MapPin className="w-4 h-4" />, badge: clientData.addresses.length.toString() },
      ],
    },
    {
      id: 'payment',
      title: 'Paiement & Portefeuille',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-amber-100 text-amber-600',
      items: [
        { id: 'wallet', label: 'Mon portefeuille', route: '/customer/wallet', icon: <CreditCard className="w-4 h-4" />, badge: `${(clientData.wallet.balance / 100).toFixed(0)} MAD` },
        { id: 'payment-methods', label: 'Méthodes de paiement', route: '/customer/profile/payment-methods', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'transactions', label: 'Historique transactions', route: '/customer/profile/transactions', icon: <TrendingUp className="w-4 h-4" /> },
      ],
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-red-100 text-red-600',
      items: [
        { id: 'documents', label: 'Mes documents', route: '/customer/documents-manage', icon: <FileText className="w-4 h-4" />, badge: clientData.documents.length.toString() },
        { id: 'reminders', label: 'Rappels', route: '/customer/reminders', icon: <Bell className="w-4 h-4" /> },
      ],
    },
    {
      id: 'history',
      title: 'Historique & Activité',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-600',
      items: [
        { id: 'orders', label: 'Mes commandes', route: '/customer/orders', icon: <Package className="w-4 h-4" />, badge: clientData.orders.length.toString() },
        { id: 'reviews', label: 'Mes avis', route: '/customer/profile/reviews', icon: <Star className="w-4 h-4" /> },
        { id: 'favorites', label: 'Favoris', route: '/customer/profile/favorites', icon: <Heart className="w-4 h-4" /> },
      ],
    },
    {
      id: 'preferences',
      title: 'Préférences',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-slate-100 text-slate-600',
      items: [
        { id: 'notifications', label: 'Notifications', route: '/customer/profile/notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'language', label: 'Langue', route: '/customer/profile/language', icon: <Globe className="w-4 h-4" />, badge: language === 'fr' ? 'FR' : 'AR' },
        { id: 'privacy', label: 'Confidentialité', route: '/customer/profile/privacy', icon: <Shield className="w-4 h-4" /> },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'bg-teal-100 text-teal-600',
      items: [
        { id: 'help', label: 'Centre d\'aide', route: '/customer/profile/help', icon: <HelpCircle className="w-4 h-4" /> },
        { id: 'contact', label: 'Nous contacter', route: '/customer/profile/contact', icon: <Mail className="w-4 h-4" /> },
        { id: 'terms', label: 'Conditions & Confidentialité', route: '/customer/profile/terms', icon: <FileText className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/customer/home')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Mon Profil</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.full_name || 'Client'}</h2>
            <p className="text-sm opacity-90">{user?.phone}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                Membre Gold
              </span>
              <span className="text-xs opacity-90">• {clientData.loyaltyPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{clientData.orders.length}</p>
            <p className="text-[10px] opacity-90">Commandes</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{clientData.vehicles.length}</p>
            <p className="text-[10px] opacity-90">Véhicules</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{clientData.documents.length}</p>
            <p className="text-[10px] opacity-90">Documents</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{(clientData.wallet.balance / 100).toFixed(0)}</p>
            <p className="text-[10px] opacity-90">MAD</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 py-6 space-y-4">
        {menuSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.color}`}>
                {section.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-700">{section.title}</h3>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {section.items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                    index < section.items.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="text-slate-600">{item.icon}</div>
                  <span className="flex-1 text-sm text-slate-800 text-start">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Subscription Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-slate-800">Plan {clientData.currentPlan.name}</h3>
            </div>
            <span className="text-sm font-bold text-amber-600">{clientData.currentPlan.price} MAD/mois</span>
          </div>
          <div className="space-y-1 mb-3">
            {clientData.currentPlan.features.slice(0, 2).map((benefit: string, i: number) => (
              <p key={i} className="text-xs text-slate-700 flex items-center gap-2">
                <span className="text-amber-600">✓</span>
                {benefit}
              </p>
            ))}
          </div>
          <button
            onClick={() => navigate('/gift-plans')}
            className="w-full py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600"
          >
            Gérer mon abonnement
          </button>
        </div>

        {/* Referral Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎁</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Parrainez un ami</p>
              <p className="text-xs opacity-90">Gagnez 50 MAD pour chaque ami invité</p>
            </div>
            <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium">
              Inviter
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>

        {/* Delete Account */}
        <button
          onClick={() => {
            if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
              alert('Compte supprimé (simulation)');
              navigate('/');
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-xs">Supprimer mon compte</span>
        </button>
      </div>
    </div>
  );
};
