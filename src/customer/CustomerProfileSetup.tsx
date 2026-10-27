import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button } from '../shared/components';
import { ArrowLeft, Plus, Trash2, Car, Check } from 'lucide-react';

export function CustomerProfileSetup() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleComplete = () => {
    if (user && name.trim()) {
      setUser({ ...user, full_name: name });
    }
    navigate('/customer/home');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-xl font-bold mb-4">Compléter votre profil</h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nom complet</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" />
        </div>
        <Button fullWidth size="lg" onClick={handleComplete} disabled={!name.trim()}>Commencer</Button>
      </div>
    </div>
  );
}
