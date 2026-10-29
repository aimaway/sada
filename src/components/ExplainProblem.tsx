import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Mic, Send } from 'lucide-react';
import { useApp, resolveDemoIdentity } from '../shared/context';
import { createRequest, categoryFromDescription } from '../ifix/ifixStore';
import { mockVehicles } from '../shared/unifiedMockData';
import { IfixMascot } from '../ifix/IfixMascot';

export const ExplainProblem: React.FC = () => {
  const navigate = useNavigate();
  const app = useApp();
  const user = resolveDemoIdentity(app.user);
  const [description, setDescription] = useState('');
  const [hasPhotos, setHasPhotos] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [vehicleId, setVehicleId] = useState<string>(
    mockVehicles.find((v) => v.owner_id === user?.id)?.id ?? ''
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!description.trim() || busy) return;
    setBusy(true);
    setError(null);

    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    const vehicleSummary = vehicle
      ? `${vehicle.make} ${vehicle.model} (${vehicle.year}) — ${vehicle.mileage.toLocaleString('fr-MA')} km`
      : 'Véhicule non précisé';

    // Persist through the marketplace store (dev-phase mirror of the REST API).
    const res = createRequest({
      customer_id: user?.id ?? 'u_c1',
      customer_name: user?.full_name ?? 'Client TomoBily',
      vehicle_summary: vehicleSummary,
      category_id: categoryFromDescription(description),
      description,
      urgency: 'normal',
      preferred_time: 'Dès que possible',
      location: 'Casablanca',
      service_mode: 'at_garage',
      budget: null,
      ai_session_id: null,
      source: 'customer',
    });

    if (!res.ok || !res.request) {
      setBusy(false);
      setError(res.error ?? "Impossible d'envoyer la demande. Réessayez.");
      return;
    }
    setBusy(false);
    navigate(`/customer/offers?requestId=${res.request.id}`);
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
        {/* Vehicle selection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Véhicule concerné
          </label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-slate-900 bg-white"
          >
            <option value="">— Choisir un véhicule (optionnel) —</option>
            {mockVehicles
              .filter((v) => v.owner_id === (user?.id ?? 'u_c1'))
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.year}) — {v.plate}
                </option>
              ))}
          </select>
        </div>

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
              {hasPhotos ? 'Photos ajoutées ✓ (démonstration — non téléversées)' : 'Ajouter des photos'}
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
              {hasVoice ? 'Note vocale enregistrée ✓ (démonstration — non envoyée)' : 'Enregistrer une note vocale'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Décrivez le problème en Darija, Arabe ou Français
            </p>
          </button>
        </div>

        {/* Optional IFIX AI guidance — never required to submit */}
        {description.length > 50 && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <IfixMascot state="thinking" size={40} />
              <div>
                <p className="text-sm font-medium text-teal-900 mb-1">
                  Besoin d'aide pour comprendre ce symptôme ?
                </p>
                <p className="text-xs text-teal-700 mb-2">
                  IFIX AI peut vous orienter gratuitement (optionnel — votre demande ci-dessus reste directe).
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/customer/ifix')}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Parler à IFIX AI
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-white text-teal-700 border border-teal-300 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
                  >
                    Non, envoyer directement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!description.trim() || busy}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {busy ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>

        {/* Help Text */}
        <p className="text-center text-xs text-slate-500">
          Les professionnels éligibles recevront votre demande et vous enverront des offres
        </p>
      </div>
    </div>
  );
};
