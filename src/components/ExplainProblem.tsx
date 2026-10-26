import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Mic, Send } from 'lucide-react';

export const ExplainProblem: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [hasPhotos, setHasPhotos] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) return;
    
    // In production, send to backend
    console.log('Submitting problem description:', {
      description,
      hasPhotos,
      hasVoice,
    });
    
    navigate('/customer/offers');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Expliquer mon problème</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Décrivez votre problème
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Ma voiture ne démarre plus ce matin. J'ai entendu un clic quand j'ai tourné la clé..."
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none text-slate-900 placeholder-slate-400"
            rows={6}
          />
          <p className="text-xs text-slate-500 mt-2">
            Plus vous donnez de détails, mieux les mécaniciens pourront vous aider
          </p>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Photos (optionnel)
          </label>
          <button
            onClick={() => setHasPhotos(!hasPhotos)}
            className={`w-full p-6 border-2 border-dashed rounded-xl transition-all ${
              hasPhotos
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <Camera className={`w-8 h-8 mx-auto mb-2 ${hasPhotos ? 'text-slate-900' : 'text-slate-400'}`} />
            <p className={`text-sm font-medium ${hasPhotos ? 'text-slate-900' : 'text-slate-600'}`}>
              {hasPhotos ? 'Photos ajoutées ✓' : 'Ajouter des photos'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Tableau de bord, moteur, pièce endommagée...
            </p>
          </button>
        </div>

        {/* Voice Note */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Note vocale (optionnel)
          </label>
          <button
            onClick={() => setHasVoice(!hasVoice)}
            className={`w-full p-6 border-2 border-dashed rounded-xl transition-all ${
              hasVoice
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <Mic className={`w-8 h-8 mx-auto mb-2 ${hasVoice ? 'text-slate-900' : 'text-slate-400'}`} />
            <p className={`text-sm font-medium ${hasVoice ? 'text-slate-900' : 'text-slate-600'}`}>
              {hasVoice ? 'Note vocale enregistrée ✓' : 'Enregistrer une note vocale'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Décrivez le problème en Darija, Arabe ou Français
            </p>
          </button>
        </div>

        {/* AI Suggestion */}
        {description.length > 50 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Suggestion de l'assistant
                </p>
                <p className="text-sm text-blue-700">
                  On dirait un problème de batterie. Voulez-vous continuer avec ce scénario ?
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate('/customer/new-request?scenario=batt')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Oui, continuer
                  </button>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Non, merci
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!description.trim()}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Envoyer ma demande
        </button>

        {/* Help Text */}
        <p className="text-center text-xs text-slate-500">
          Les mécaniciens proches recevront votre demande et vous enverront des offres
        </p>
      </div>
    </div>
  );
};
