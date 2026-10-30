import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Send } from 'lucide-react';

export const DiagnosticRequest: React.FC = () => {
  const navigate = useNavigate();
  const [warningLight, setWarningLight] = useState<string[]>([]);
  const [when, setWhen] = useState('');
  const [obdScan, setObdScan] = useState(false);
  const [description, setDescription] = useState('');

  const warningLights = ['Moteur', 'ABS', 'Huile', 'Batterie', 'Airbag', 'Autre'];
  const whenOptions = ['Au démarrage', 'En roulant', 'En freinant', 'Au ralenti'];

  const handleSubmit = () => {
    if (warningLight.length === 0) return;
    
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
          <h1 className="text-lg font-semibold text-slate-900">Diagnostic</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Vous ne savez pas ce qui ne va pas ?
              </p>
              <p className="text-sm text-blue-700">
                Un mécanicien viendra diagnostiquer le problème sur place. Le diagnostic coûte entre 100 et 300 MAD.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Light */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Quel voyant est allumé ?
          </label>
          <div className="flex flex-wrap gap-2">
            {warningLights.map((light) => {
              const isSelected = warningLight.includes(light);
              return (
                <button
                  key={light}
                  onClick={() => {
                    if (isSelected) {
                      setWarningLight(warningLight.filter((l) => l !== light));
                    } else {
                      setWarningLight([...warningLight, light]);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {light}
                </button>
              );
            })}
          </div>
        </div>

        {/* When */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Quand le problème arrive-t-il ?
          </label>
          <div className="space-y-2">
            {whenOptions.map((option) => (
              <button
                key={option}
                onClick={() => setWhen(option)}
                className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                  when === option
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* OBD Scan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-900">
                Scan OBD souhaité
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Diagnostic électronique complet
              </p>
            </div>
            <button
              onClick={() => setObdScan(!obdScan)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                obdScan ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  obdScan ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Description supplémentaire (optionnel)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Le voyant moteur s'allume quand je démarre la voiture..."
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none text-slate-900 placeholder-slate-400"
            rows={4}
          />
        </div>

        {/* Tip */}
        <div className="bg-slate-100 rounded-2xl p-4">
          <p className="text-sm text-slate-700">
            💡 <strong>Astuce :</strong> Un enregistrement du bruit ou une photo du tableau de bord aide le mécanicien à estimer le problème avant l'intervention.
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={warningLight.length === 0}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Demander un diagnostic
        </button>

        {/* Flow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Comment ça marche ?</h3>
          <ol className="space-y-3">
            {[
              'Pré-diagnostic assisté avant l\'envoi',
              'Offres de diagnostic à prix fixe',
              'Rapport avec photos',
              'Devis de réparation proposé ensuite',
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
