import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { ArrowLeft, Smartphone, Download, CheckCircle } from 'lucide-react';

export const RoleSelectionLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setMechanicProfile } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showAppDownload, setShowAppDownload] = useState(false);

  const roles = [
    {
      id: 'customer',
      title: 'Client',
      description: 'Demander une réparation, suivre votre intervention',
      icon: '👤',
      color: 'from-emerald-500 to-teal-600',
      route: '/customer/login',
    },
    {
      id: 'mechanic',
      title: 'Mécanicien',
      description: 'Recevoir des demandes, gérer vos interventions',
      icon: '🔧',
      color: 'from-blue-500 to-indigo-600',
      route: '/mechanic/login',
    },
    {
      id: 'seller',
      title: 'Vendeur',
      description: 'Gérer votre boutique et vos produits',
      icon: '🏪',
      color: 'from-purple-500 to-pink-600',
      route: '/seller/login',
    },
    {
      id: 'tuner',
      title: 'Tuner',
      description: 'Préparations moteur Stage 1-3',
      icon: '🏎️',
      color: 'from-red-500 to-orange-600',
      route: '/tuner/login',
    },
    {
      id: 'admin',
      title: 'Administrateur',
      description: 'Gérer la plateforme',
      icon: '🛡️',
      color: 'from-slate-600 to-slate-700',
      route: '/admin/login',
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Si c'est un client, montrer le message de téléchargement d'app
    if (roleId === 'customer') {
      setShowAppDownload(true);
    } else {
      // Pour les autres rôles, redirection directe
      const role = roles.find(r => r.id === roleId);
      if (role) {
        navigate(role.route);
      }
    }
  };

  const handleContinueWeb = () => {
    const role = roles.find(r => r.id === selectedRole);
    if (role) {
      navigate(role.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </button>
          <div className="text-sm text-slate-500">
            Étape 1: Choisir votre rôle
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!showAppDownload ? (
          <>
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Bienvenue sur MécaCasablanca
              </h1>
              <p className="text-lg text-slate-600">
                Choisissez comment vous souhaitez utiliser la plateforme
              </p>
            </div>

            {/* Role Selection Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border-2 ${
                    selectedRole === role.id ? 'border-emerald-500' : 'border-transparent'
                  } hover:scale-105`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                  <p className="text-sm text-slate-600">{role.description}</p>
                </button>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Pourquoi choisir votre rôle ?</h3>
                  <p className="text-sm text-slate-700 mb-3">
                    Chaque rôle a accès à des fonctionnalités spécifiques :
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>✓ <strong>Client :</strong> Demander des réparations, suivre les interventions, gérer vos documents</li>
                    <li>✓ <strong>Mécanicien :</strong> Recevoir des demandes, gérer votre profil, voir vos gains</li>
                    <li>✓ <strong>Vendeur :</strong> Gérer votre boutique, produits, partenariats</li>
                    <li>✓ <strong>Tuner :</strong> Proposer des préparations Stage 1-3</li>
                    <li>✓ <strong>Admin :</strong> Gérer la plateforme et les utilisateurs</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* App Download Message for Customers */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6">
                📱
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Téléchargez l'application MécaCasablanca
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Pour une meilleure expérience, nous vous recommandons d'utiliser notre application mobile. 
                Vous pourrez suivre vos interventions en temps réel et recevoir des notifications instantanées.
              </p>
            </div>

            {/* Download Buttons */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <a
                href="https://apps.apple.com/app/mecago"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white rounded-2xl p-6 hover:bg-slate-800 transition-colors flex items-center gap-4"
              >
                <div className="text-4xl">🍎</div>
                <div>
                  <p className="text-xs text-slate-400">Télécharger sur</p>
                  <p className="text-xl font-bold">App Store</p>
                  <p className="text-xs text-slate-400 mt-1">Bientôt disponible</p>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.mecago"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white rounded-2xl p-6 hover:bg-slate-800 transition-colors flex items-center gap-4"
              >
                <div className="text-4xl">🤖</div>
                <div>
                  <p className="text-xs text-slate-400">Disponible sur</p>
                  <p className="text-xl font-bold">Google Play</p>
                  <p className="text-xs text-slate-400 mt-1">Bientôt disponible</p>
                </div>
              </a>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 max-w-2xl mx-auto">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Avantages de l'application mobile
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                    🔔
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Notifications en temps réel</p>
                    <p className="text-xs text-slate-600">Suivez vos interventions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Géolocalisation</p>
                    <p className="text-xs text-slate-600">Trouvez des mécaniciens proches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                    💳
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Paiement mobile</p>
                    <p className="text-xs text-slate-600">Orange Money, inwi Money</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                    📸
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Photos intégrées</p>
                    <p className="text-xs text-slate-600">Prenez des photos directement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue on Web */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-sm text-slate-600 mb-4">
                Vous pouvez également continuer sur la version web
              </p>
              <button
                onClick={handleContinueWeb}
                className="text-emerald-600 font-medium hover:text-emerald-700 underline"
              >
                Continuer sur le web →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
