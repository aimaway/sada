import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, EyeOff, Globe, Users, MapPin, Save, CheckCircle2, Info
} from 'lucide-react';

export const MechanicVisibility: React.FC = () => {
  const navigate = useNavigate();
  
  const [visibility, setVisibility] = useState({
    profilePublic: true,
    showPhone: false,
    showEmail: false,
    showAddress: true,
    showExactLocation: false,
    showInSearch: true,
    showOnMap: true,
    acceptDirectMessages: true,
    showRating: true,
    showReviews: true,
    showPortfolio: true,
  });

  const handleSave = () => {
    alert('Paramètres de visibilité mis à jour !');
    navigate('/mechanic/profile');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mechanic/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Visibilité du profil</h1>
              <p className="text-xs text-slate-500">Contrôlez ce qui est visible</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Profile Visibility */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Visibilité globale
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Profil public</p>
                <p className="text-xs text-slate-500">Tout le monde peut voir votre profil</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, profilePublic: !visibility.profilePublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.profilePublic ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.profilePublic ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Apparaître dans les recherches</p>
                <p className="text-xs text-slate-500">Les clients peuvent vous trouver via la recherche</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showInSearch: !visibility.showInSearch })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showInSearch ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showInSearch ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher sur la carte</p>
                <p className="text-xs text-slate-500">Votre position apparaît sur la carte</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showOnMap: !visibility.showOnMap })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showOnMap ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showOnMap ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Informations de contact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher le téléphone</p>
                <p className="text-xs text-slate-500">Visible uniquement après acceptation d'une demande</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showPhone: !visibility.showPhone })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showPhone ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showPhone ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher l'email</p>
                <p className="text-xs text-slate-500">Visible sur votre profil public</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showEmail: !visibility.showEmail })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showEmail ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showEmail ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Accepter les messages directs</p>
                <p className="text-xs text-slate-500">Les clients peuvent vous envoyer des messages</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, acceptDirectMessages: !visibility.acceptDirectMessages })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.acceptDirectMessages ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.acceptDirectMessages ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Localisation
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher l'adresse</p>
                <p className="text-xs text-slate-500">Ville et quartier (pas l'adresse exacte)</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showAddress: !visibility.showAddress })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showAddress ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showAddress ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher la position exacte</p>
                <p className="text-xs text-slate-500">Coordonnées GPS précises</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showExactLocation: !visibility.showExactLocation })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showExactLocation ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showExactLocation ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Performance et avis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher la note</p>
                <p className="text-xs text-slate-500">Votre note moyenne visible</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showRating: !visibility.showRating })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showRating ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showRating ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher les avis</p>
                <p className="text-xs text-slate-500">Commentaires des clients visibles</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showReviews: !visibility.showReviews })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showReviews ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showReviews ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Afficher le portfolio</p>
                <p className="text-xs text-slate-500">Photos de vos réalisations</p>
              </div>
              <button
                onClick={() => setVisibility({ ...visibility, showPortfolio: !visibility.showPortfolio })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  visibility.showPortfolio ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibility.showPortfolio ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Protection de la vie privée</p>
              <p className="text-xs text-blue-700 mt-1">
                Votre numéro de téléphone et votre adresse exacte ne sont jamais affichés publiquement. Ils ne sont partagés qu'après acceptation d'une demande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
