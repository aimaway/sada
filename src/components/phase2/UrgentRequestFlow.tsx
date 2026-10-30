import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, AlertCircle, Zap, Camera } from 'lucide-react';

interface UrgentRequestProps {
  vehicleType: 'motorcycle' | 'scooter' | 'ebike';
}

export const UrgentRequestFlow: React.FC<UrgentRequestProps> = ({ vehicleType }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location] = useState({ lat: 33.5731, lng: -7.5898 });
  const [isPro, setIsPro] = useState(false);
  const [downtimeCost, setDowntimeCost] = useState('');

  const issueTypes = {
    motorcycle: [
      { id: 'puncture', label: 'Pneu crevé', icon: '🛞', urgent: true },
      { id: 'chain', label: 'Chaîne cassée', icon: '⛓️', urgent: true },
      { id: 'brakes', label: 'Freins', icon: '🔧', urgent: true },
      { id: 'battery', label: 'Batterie', icon: '🔋', urgent: false },
    ],
    scooter: [
      { id: 'puncture', label: 'Pneu crevé', icon: '🛞', urgent: true },
      { id: 'brakes', label: 'Freins', icon: '🔧', urgent: true },
      { id: 'battery', label: 'Batterie', icon: '🔋', urgent: true },
      { id: 'starter', label: 'Démarreur', icon: '⚡', urgent: false },
    ],
    ebike: [
      { id: 'puncture', label: 'Pneu crevé', icon: '🛞', urgent: true },
      { id: 'brakes', label: 'Freins', icon: '🔧', urgent: true },
      { id: 'battery', label: 'Batterie', icon: '🔋', urgent: true },
      { id: 'motor', label: 'Moteur', icon: '⚡', urgent: false },
    ],
  };

  const handleSubmit = () => {
    navigate('/customer/offers?urgent=true');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">⚡ Back on the Road Fast</h1>
            <p className="text-sm opacity-90">Intervention urgente pour {vehicleType}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Quel est le problème ?</h2>
            <div className="grid grid-cols-2 gap-3">
              {issueTypes[vehicleType].map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => { setIssueType(issue.id); setStep(2); }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    issueType === issue.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{issue.icon}</div>
                  <div className="font-medium text-slate-800">{issue.label}</div>
                  {issue.urgent && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <Zap className="w-3 h-3" />
                      <span>Urgent</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Décrivez le problème</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème en détail..."
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
              rows={4}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Photos (optionnel)</label>
              <button className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-500 transition-colors">
                <Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">Ajouter des photos</p>
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={() => setStep(3)} disabled={!description} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50">Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Votre localisation</h2>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Boulevard Mohammed V</p>
                  <p className="text-sm text-slate-500">Casablanca, Maroc</p>
                  <button className="mt-2 text-sm text-orange-600 font-medium">Changer la localisation</button>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={isPro} onChange={(e) => setIsPro(e.target.checked)} className="mt-1 w-5 h-5 text-blue-600 rounded" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Je suis chauffeur professionnel</p>
                  <p className="text-sm text-slate-600 mt-1">Taxi, VTC, livraison - Minimisez votre temps d'arrêt</p>
                </div>
              </label>
              {isPro && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Coût par heure d'arrêt (MAD)</label>
                    <input type="number" value={downtimeCost} onChange={(e) => setDowntimeCost(e.target.value)} placeholder="Ex: 50" className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <p className="text-xs text-slate-500 mt-1">💡 Les mécaniciens verront ce coût et prioriseront votre demande</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={() => setStep(4)} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600">Suivant</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Proposez votre prix</h2>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">Prix suggéré</span>
                <span className="text-lg font-bold text-slate-800">150 - 300 MAD</span>
              </div>
              <div className="relative">
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Votre prix" className="w-full p-4 pr-16 border-2 border-slate-200 rounded-xl text-2xl font-bold text-center focus:ring-2 focus:ring-orange-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">MAD</span>
              </div>
              {isPro && downtimeCost && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Coût d'arrêt estimé</p>
                      <p className="text-sm text-amber-700 mt-1">{Math.round(parseInt(downtimeCost) * 0.5)} MAD pour 30 min d'intervention</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Intervention rapide garantie</p>
                  <p className="text-sm text-orange-700 mt-1">Les mécaniciens à proximité recevront votre demande en priorité</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={handleSubmit} disabled={!price} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50">Envoyer la demande</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
