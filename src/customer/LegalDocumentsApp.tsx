import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button } from '../shared/components';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, Calendar, Shield } from 'lucide-react';

export function LegalDocumentsScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  const documents = [
    { id: '1', icon: '🪪', title: 'Permis de conduire', status: 'valid', expiry: '2030-03-15', color: 'bg-blue-500' },
    { id: '2', icon: '🛡️', title: 'Assurance auto', status: 'expiring_soon', expiry: '2025-03-01', color: 'bg-emerald-500' },
    { id: '3', icon: '🔍', title: 'Contrôle technique', status: 'expiring_soon', expiry: '2025-04-10', color: 'bg-amber-500' },
    { id: '4', icon: '📄', title: 'Carte grise', status: 'valid', expiry: '2099-12-31', color: 'bg-purple-500' },
    { id: '5', icon: '🏷️', title: 'Vignette fiscale', status: 'expiring_soon', expiry: '2025-03-31', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/customer/home')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold flex-1">Documents & Juridique</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800">⚠️ 3 documents expirent bientôt</p>
        </div>
        {documents.map(doc => (
          <Card key={doc.id} className={`p-4 border-2 ${doc.status === 'expiring_soon' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${doc.color} rounded-xl flex items-center justify-center text-2xl`}>{doc.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{doc.title}</p>
                <p className="text-xs text-slate-500">Expire: {new Date(doc.expiry).toLocaleDateString('fr-FR')}</p>
              </div>
              {doc.status === 'expiring_soon' ? <Clock className="w-5 h-5 text-amber-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
