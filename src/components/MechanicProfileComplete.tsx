import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { mockMechanicData } from '../data/mockDataGlobal';
import {
  ArrowLeft, User, Wrench, MapPin, Clock, CreditCard, Shield, Star,
  Bell, Eye, Settings, ChevronRight, Award, TrendingUp, CheckCircle2,
  AlertCircle, FileText, DollarSign, BarChart3, Calendar, MessageCircle,
  Mail, Camera
} from 'lucide-react';

export const MechanicProfileComplete: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const mechanicData = mockMechanicData;

  const menuSections = [
    {
      id: 'professional',
      title: 'Profil Professionnel',
      icon: <User className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600',
      items: [
        { id: 'info', label: 'Informations personnelles', route: '/mechanic/profile/info', icon: <User className="w-4 h-4" /> },
        { id: 'services', label: 'Services & Compétences', route: '/mechanic/profile/services', icon: <Wrench className="w-4 h-4" /> },
        { id: 'area', label: 'Zone de service & Horaires', route: '/mechanic/profile/area', icon: <MapPin className="w-4 h-4" /> },
        { id: 'pricing', label: 'Configuration des prix', route: '/mechanic/profile/pricing', icon: <DollarSign className="w-4 h-4" /> },
      ],
    },
    {
      id: 'verification',
      title: 'Vérification & Sécurité',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-emerald-100 text-emerald-600',
      items: [
        { id: 'verification', label: 'Documents de vérification', route: '/mechanic/profile/verification', icon: <FileText className="w-4 h-4" />, badge: '3/5' },
        { id: 'security', label: 'Sécurité du compte', route: '/mechanic/profile/security', icon: <Shield className="w-4 h-4" /> },
      ],
    },
    {
      id: 'performance',
      title: 'Performance & Statistiques',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600',
      items: [
        { id: 'stats', label: 'Statistiques', route: '/mechanic/profile/stats', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'reviews', label: 'Avis clients', route: '/mechanic/profile/reviews', icon: <Star className="w-4 h-4" />, badge: '4.9' },
        { id: 'performance', label: 'Métriques de performance', route: '/mechanic/profile/performance', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      id: 'financial',
      title: 'Finances & Paiements',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-amber-100 text-amber-600',
      items: [
        { id: 'wallet', label: 'Portefeuille', route: '/mechanic/wallet', icon: <CreditCard className="w-4 h-4" />, badge: `${(mechanicData.wallet.balance / 100).toFixed(0)} MAD` },
        { id: 'payouts', label: 'Configuration des paiements', route: '/mechanic/profile/payouts', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'earnings', label: 'Historique des gains', route: '/mechanic/earnings', icon: <TrendingUp className="w-4 h-4" /> },
      ],
    },
    {
      id: 'preferences',
      title: 'Préférences',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-slate-100 text-slate-600',
      items: [
        { id: 'notifications', label: 'Notifications', route: '/mechanic/profile/notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'visibility', label: 'Visibilité du profil', route: '/mechanic/profile/visibility', icon: <Eye className="w-4 h-4" /> },
        { id: 'plans', label: 'Plans & Abonnements', route: '/mechanic/plans', icon: <Award className="w-4 h-4" />, badge: mechanicData.currentPlan.name },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-teal-100 text-teal-600',
      items: [
        { id: 'help', label: 'Centre d\'aide', route: '/mechanic/profile/help', icon: <MessageCircle className="w-4 h-4" /> },
        { id: 'contact', label: 'Nous contacter', route: '/mechanic/profile/contact', icon: <Mail className="w-4 h-4" /> },
        { id: 'terms', label: 'Conditions & Confidentialité', route: '/mechanic/profile/terms', icon: <FileText className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/mechanic/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Mon Profil</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              👨‍🔧
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.full_name || 'Mécanicien'}</h2>
            <p className="text-sm opacity-90">{user?.phone}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Vérifié
              </span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-300" />
                {mechanicData.stats.averageRating}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{mechanicData.stats.totalJobs}</p>
            <p className="text-[10px] opacity-90">Jobs</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{mechanicData.stats.acceptanceRate}%</p>
            <p className="text-[10px] opacity-90">Acceptation</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{mechanicData.stats.responseTime}min</p>
            <p className="text-[10px] opacity-90">Réponse</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{(mechanicData.wallet.balance / 100).toFixed(0)}</p>
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

        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Plan {mechanicData.currentPlan.name}</h3>
            </div>
            <span className="text-sm font-bold text-blue-600">{mechanicData.currentPlan.price} MAD/mois</span>
          </div>
          <div className="space-y-1 mb-3">
            {mechanicData.currentPlan.features.slice(0, 3).map((feature, i) => (
              <p key={i} className="text-xs text-slate-700 flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                {feature}
              </p>
            ))}
          </div>
          <button
            onClick={() => navigate('/mechanic/plans')}
            className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            Gérer mon abonnement
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};
