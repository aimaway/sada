import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { mockTunerData } from '../data/mockDataGlobal';

export const TunerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simulate login - in production, call backend API
    const tuner = mockTunerData.profile;
    
    setUser({
      id: tuner.id,
      phone: phone || '+212600000077',
      role: 'tuner',
      full_name: tuner.name,
      status: 'active',
      language: 'fr',
      created_at: new Date().toISOString(),
    });

    navigate('/tuner/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏎️</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Espace Tuner</h1>
            <p className="text-sm text-slate-600">Connectez-vous à votre compte</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Se connecter
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate('/tuner/register')}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pas encore de compte ? <span className="font-semibold">S'inscrire</span>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700">
              <strong>Démo :</strong> Cliquez sur "Se connecter" sans remplir les champs pour accéder au dashboard avec les données de démonstration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
