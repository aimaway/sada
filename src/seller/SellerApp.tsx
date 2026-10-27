import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar, StatusBadge } from '../shared/components';
import { ArrowLeft, Package, ShoppingBag, Truck, Users, Settings, TrendingUp, Plus, Edit, Eye, CheckCircle2, Clock, XCircle, Star, Shield, BarChart3, DollarSign, Store } from 'lucide-react';

export function SellerLogin() {
  const { language, setUser } = useApp();
  const navigate = useNavigate();
  const handleLogin = () => {
    setUser({ id: 'u_s1', phone: '+212600000100', role: 'seller', full_name: 'AutoPièces Maroc', status: 'active', language: 'fr', created_at: new Date().toISOString() });
    navigate('/seller/dashboard');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Espace Vendeur</h1>
          <p className="text-sm text-slate-500">Gérez votre boutique et vos partenariats</p>
        </div>
        <Button fullWidth size="lg" onClick={handleLogin}>Se connecter</Button>
        <p className="text-xs text-slate-400 text-center mt-4">🎮 Mode démo : cliquez sur "Se connecter"</p>
      </Card>
    </div>
  );
}

export function SellerDashboard() {
  const { language } = useApp();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold flex-1">AutoPièces Maroc</h1>
        <button onClick={() => navigate('/seller/settings')} className="p-2 rounded-xl bg-slate-100"><Settings className="w-5 h-5" /></button>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <p className="text-2xl font-bold">4,250</p><p className="text-xs opacity-80">MAD aujourd'hui</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-2xl font-bold">1,250</p><p className="text-xs opacity-80">Ventes totales</p>
          </Card>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <Package className="w-5 h-5" />, label: 'Produits', route: '/seller/products' },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Commandes', route: '/seller/orders' },
            { icon: <Users className="w-5 h-5" />, label: 'Partenaires', route: '/seller/partnerships' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Stats', route: '/seller/dashboard' },
          ].map((a, i) => (
            <button key={i} onClick={() => navigate(a.route)} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 border">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">{a.icon}</div>
              <span className="text-[10px] font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex justify-around">
        {[
          { icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', route: '/seller/dashboard', active: true },
          { icon: <Package className="w-5 h-5" />, label: 'Produits', route: '/seller/products' },
          { icon: <ShoppingBag className="w-5 h-5" />, label: 'Commandes', route: '/seller/orders' },
          { icon: <Users className="w-5 h-5" />, label: 'Partenaires', route: '/seller/partnerships' },
        ].map((tab, i) => (
          <button key={i} onClick={() => navigate(tab.route)} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${tab.active ? 'text-emerald-600' : 'text-slate-400'}`}>
            {tab.icon}<span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function SellerProducts() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/seller/dashboard')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold flex-1">Mes Produits</h1>
        <Button size="sm"><Plus className="w-4 h-4 me-1" /> Ajouter</Button>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Gestion des produits</p></div>
    </div>
  );
}

export function SellerOrders() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/seller/dashboard')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Commandes</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Gestion des commandes</p></div>
    </div>
  );
}

export function SellerPartnerships() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/seller/dashboard')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold flex-1">Partenaires</h1>
        <Button size="sm"><Plus className="w-4 h-4 me-1" /> Inviter</Button>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Mécaniciens partenaires</p></div>
    </div>
  );
}

export function SellerSettings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/seller/dashboard')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Paramètres</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Paramètres de la boutique</p></div>
    </div>
  );
}
