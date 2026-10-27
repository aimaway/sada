import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button } from '../shared/components';
import { ArrowLeft, Check } from 'lucide-react';

export function MechanicProfileSetup() {
  const { language, user, setUser, setMechanicProfile } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categories = [
    { id: '1', name: 'Batterie', icon: '🔋' },
    { id: '2', name: 'Vidange', icon: '🛢️' },
    { id: '3', name: 'Freins', icon: '🔧' },
    { id: '4', name: 'Pneus', icon: '🛞' },
  ];

  const handleComplete = () => {
    if (user) setUser({ ...user, full_name: name });
    setMechanicProfile({ id: 'm_new', user_id: user?.id || '', verification_status: 'pending', is_online: false });
    navigate('/mechanic/home');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/mechanic/login')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Inscription mécanicien</h1>
      </div>
      <div className="p-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Informations</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom complet" className="w-full px-4 py-3 border rounded-xl outline-none" />
            <Button fullWidth size="lg" onClick={() => setStep(2)} disabled={!name.trim()}>Suivant</Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Services proposés</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategories(prev => prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id])}
                  className={`p-4 rounded-2xl border-2 text-left ${selectedCategories.includes(cat.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <p className="font-medium text-sm">{cat.name}</p>
                </button>
              ))}
            </div>
            <Button fullWidth size="lg" onClick={() => setStep(3)} disabled={selectedCategories.length === 0}>Suivant</Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Vérification</h2>
            <p className="text-sm text-slate-500">Upload des documents (simulé en démo)</p>
            <Button fullWidth size="lg" onClick={handleComplete}>Soumettre</Button>
          </div>
        )}
      </div>
    </div>
  );
}
