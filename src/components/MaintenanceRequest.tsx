import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Send, Wrench } from 'lucide-react';

export const MaintenanceRequest: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<string[]>([]);
  const [mileage, setMileage] = useState('');
  const [oilType, setOilType] = useState('');
  const [ownParts, setOwnParts] = useState(false);
  const [description, setDescription] = useState('');

  const serviceOptions = [
    { id: 'oil', label: 'Huile moteur', icon: '🛢️' },
    { id: 'oil_filter', label: 'Filtre à huile', icon: '🔧' },
    { id: 'air_filter', label: 'Filtre à air', icon: '💨' },
    { id: 'cabin_filter', label: 'Filtre habitacle', icon: '🌬️' },
    { id: 'brake_fluid', label: 'Liquide de frein', icon: '💧' },
  ];

  const oilTypes = ['Je ne sais pas', 'Synthétique', 'Semi-synthétique', 'Minérale'];

  const handleSubmit = () => {
    if (services.length === 0) return;
    
    console.log('Submitting maintenance request:', {
      services,
      mileage,
      oilType,
      ownParts,
      description,
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
          <h1 className="text-lg font-semibold text-slate-900">Vidange et entretien</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Info Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Wrench className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-900 mb-1">
                Entretien régulier
              </p>
              <p className="text-sm text-emerald-700">
                Prix indicatif : 250 à 600 MAD selon les prestations choisies.
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Quelles prestations souhaitez-vous ?
          </label>
          <div className="space-y-2">
            {serviceOptions.map((service) => {
              const isSelected = services.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    if (isSelected) {
                      setServices(services.filter((s) => s !== service.id));
                    } else {
                      setServices([...services, service.id]);
                    }
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-2xl">{service.icon}</span>
                  <span className="text-sm font-medium flex-1">{service.label}</span>
                  {isSelected && <CheckCircle className="w-5 h-5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mileage */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Kilométrage actuel
          </label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="ex. 85000"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Oil Type */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Type d'huile
          </label>
          <div className="space-y-2">
            {oilTypes.map((type) => (
              <button
                key={type}
                onClick={() => setOilType(type)}
                className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                  oilType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Own Parts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-900">
                Je fournis les pièces
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Vous achetez les pièces vous-même
              </p>
            </div>
            <button
              onClick={() => setOwnParts(!ownParts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                ownParts ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ownParts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="block text-sm font-medium text-slate-900 mb-3">
            Notes supplémentaires (optionnel)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Dernier entretien il y a 10 000 km..."
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none text-slate-900 placeholder-slate-400"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={services.length === 0}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Demander un entretien
        </button>

        {/* Flow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Comment ça marche ?</h3>
          <ol className="space-y-3">
            {[
              'Offres avec ou sans pièces',
              'Choix d\'un créneau',
              'Intervention à domicile ou au bureau',
              'L\'entretien est ajouté au passeport du véhicule',
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
