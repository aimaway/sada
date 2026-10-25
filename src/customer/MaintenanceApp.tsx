import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button } from '../shared/components';
import { ArrowLeft } from 'lucide-react';

export function MaintenanceDashboard() {
  const { language } = useApp();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Entretien Auto</h1>
      </div>
      <div className="p-4 space-y-4">
        <Card className="p-4"><p className="font-semibold mb-2">✅ Check-list du jour</p><p className="text-sm text-slate-500">Vérifiez votre voiture en 2 min</p></Card>
        <Card className="p-4"><p className="font-semibold mb-2">🔔 Rappels</p><p className="text-sm text-slate-500">3 documents expirent bientôt</p></Card>
        <Card className="p-4"><p className="font-semibold mb-2">📊 Statistiques</p><p className="text-sm text-slate-500">3,040 MAD dépensés • 5 interventions</p></Card>
      </div>
    </div>
  );
}

export function ShopScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/customer/home')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Boutique Auto</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Catalogue de produits auto</p></div>
    </div>
  );
}

export function MaintenanceLogScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Carnet d'entretien</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Historique des interventions</p></div>
    </div>
  );
}

export function RemindersScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Rappels</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Vos rappels d'entretien</p></div>
    </div>
  );
}
