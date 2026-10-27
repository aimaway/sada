import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import {
  ArrowLeft, Lock, Eye, EyeOff, Shield, Smartphone, Mail, Save,
  CheckCircle2, AlertCircle, Key, Fingerprint
} from 'lucide-react';

export const CustomerSecurity: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwords.new.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    alert('Mot de passe modifié avec succès !');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Sécurité du compte</h1>
            <p className="text-xs text-slate-500">Protégez votre compte</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Account Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Informations du compte
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Nom</span>
              <span className="text-sm font-medium text-slate-800">{user?.full_name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Téléphone</span>
              <span className="text-sm font-medium text-slate-800">{user?.phone}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600">Statut</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                ✓ Vérifié
              </span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-600" />
            Changer le mot de passe
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Minimum 8 caractères</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Confirmer le nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={!passwords.current || !passwords.new || !passwords.confirm}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Changer le mot de passe
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              Authentification à deux facteurs
            </h3>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-slate-600">
            Ajoutez une couche de sécurité supplémentaire avec un code de vérification par SMS
          </p>
          {twoFactorEnabled && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-xs text-emerald-700">Authentification à deux facteurs activée</p>
              </div>
            </div>
          )}
        </div>

        {/* Biometric Authentication */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-emerald-600" />
              Authentification biométrique
            </h3>
            <button
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                biometricEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-slate-600">
            Utilisez votre empreinte digitale ou la reconnaissance faciale pour vous connecter
          </p>
          {biometricEnabled && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-xs text-emerald-700">Authentification biométrique activée</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-2">Conseils de sécurité</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Utilisez un mot de passe unique et complexe</li>
                <li>• Activez l'authentification à deux facteurs</li>
                <li>• Ne partagez jamais vos identifiants</li>
                <li>• Déconnectez-vous sur les appareils partagés</li>
                <li>• Vérifiez régulièrement l'activité de votre compte</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            Sessions actives
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Cet appareil</p>
                  <p className="text-xs text-slate-500">Chrome • Casablanca, Maroc</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Actif
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-800">iPhone 13</p>
                  <p className="text-xs text-slate-500">Safari • Il y a 2 jours</p>
                </div>
              </div>
              <button className="text-xs text-red-600 font-medium hover:text-red-700">
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
