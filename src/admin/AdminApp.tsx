import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar, StatusBadge } from '../shared/components';
import { ArrowLeft, LayoutDashboard, Users, FileCheck, Briefcase, AlertTriangle, Settings, ScrollText, TrendingUp, CheckCircle2, XCircle, Clock, Wallet, Search, Shield, Wrench } from 'lucide-react';

export function AdminLogin() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const handleLogin = () => {
    setUser({ id: 'admin1', phone: '', role: 'admin', full_name: 'Admin', status: 'active', language: 'fr', created_at: new Date().toISOString() });
    navigate('/admin/dashboard');
  };
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
        <Shield className="w-8 h-8 text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
      <Button fullWidth size="lg" onClick={handleLogin}>Connexion Admin</Button>
      <p className="text-xs text-slate-500 text-center mt-4">Dev mode: cliquez sur Connexion</p>
    </div>
  );
}

function AdminLayout({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  const { logout } = useApp();
  const navigate = useNavigate();
  const tabs = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'verification', icon: <FileCheck className="w-5 h-5" />, label: 'Vérification' },
    { id: 'requests', icon: <Briefcase className="w-5 h-5" />, label: 'Jobs' },
    { id: 'users', icon: <Users className="w-5 h-5" />, label: 'Users' },
    { id: 'disputes', icon: <AlertTriangle className="w-5 h-5" />, label: 'Litiges' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><Wrench className="w-4 h-4" /></div>
            <span className="font-bold">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => navigate(`/admin/${tab.id}`)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === tab.id ? 'bg-emerald-600' : 'text-slate-400 hover:bg-slate-800'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>
      <div className="h-full overflow-y-auto bg-slate-50"><div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div></div>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <AdminLayout activeTab="dashboard">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Demandes', value: '24', icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-500' },
          { label: 'Acceptation', value: '78%', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-500' },
          { label: 'Jobs terminés', value: '156', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-500' },
          { label: 'Mécaniciens', value: '18', icon: <Users className="w-5 h-5" />, color: 'bg-amber-500' },
          { label: 'Commission', value: '4,250 MAD', icon: <Wallet className="w-5 h-5" />, color: 'bg-rose-500' },
        ].map((kpi, i) => (
          <Card key={i} className="p-4">
            <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center text-white mb-3`}>{kpi.icon}</div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-slate-500">{kpi.label}</p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}

export function AdminVerification() {
  return (
    <AdminLayout activeTab="verification">
      <h1 className="text-2xl font-bold mb-6">File de vérification</h1>
      <Card className="p-8 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" /><p>Tous les mécaniciens sont vérifiés !</p></Card>
    </AdminLayout>
  );
}

export function AdminRequests() {
  return (
    <AdminLayout activeTab="requests">
      <h1 className="text-2xl font-bold mb-6">Demandes & Jobs</h1>
      <Card className="p-4"><p className="text-sm text-slate-500">Liste des jobs</p></Card>
    </AdminLayout>
  );
}

export function AdminUsers() {
  return (
    <AdminLayout activeTab="users">
      <h1 className="text-2xl font-bold mb-6">Utilisateurs</h1>
      <Card className="p-4"><p className="text-sm text-slate-500">Liste des utilisateurs</p></Card>
    </AdminLayout>
  );
}

export function AdminSettingsPage() {
  return (
    <AdminLayout activeTab="settings">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <Card className="p-4"><p className="text-sm text-slate-500">Configuration plateforme</p></Card>
    </AdminLayout>
  );
}

export function AdminDisputes() {
  return (
    <AdminLayout activeTab="disputes">
      <h1 className="text-2xl font-bold mb-6">Litiges</h1>
      <Card className="p-4"><p className="text-sm text-slate-500">Aucun litige en cours</p></Card>
    </AdminLayout>
  );
}
