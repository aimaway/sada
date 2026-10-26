import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, CheckCircle2 } from 'lucide-react';

export const NewRequestEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service');
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preselectedService || '');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('car');

  const services = [
    {
      id: 'tire',
      icon: '🛞',
      title: 'Pneu',
      color: 'from-blue-500 to-blue-600',
      description: 'Crevaison, changement, équilibrage',
      priceRange: '100-800 MAD',
    },
    {
      id: 'oil',
      icon: '🛢️',
      title: 'Vidange',
      color: 'from-green-500 to-green-600',
      description: 'Huile moteur, filtre',
      priceRange: '200-600 MAD',
    },
    {
      id: 'diagnostic',
      icon: '🔍',
      title: 'Diagnostic',
      color: 'from-purple-500 to-purple-600',
      description: 'Scan électronique, erreurs',
      priceRange: '150-400 MAD',
    },
    {
      id: 'accessory',
      icon: '🔧',
      title: 'Accessoire',
      color: 'from-orange-500 to-orange-600',
      description: 'Pièces, accessoires',
      priceRange: '50-2000 MAD',
    },
    {
      id: 'battery',
      icon: '🔋',
      title: 'Batterie',
      color: 'from-red-500 to-red-600',
      description: 'Remplacement, test',
      priceRange: '400-1200 MAD',
    },
    {
      id: 'brakes',
      icon: '🛑',
      title: 'Freins',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Plaquettes, disques',
      priceRange: '300-1500 MAD',
    },
    {
      id: 'ac',
      icon: '❄️',
      title: 'Climatisation',
      color: 'from-cyan-500 to-cyan-600',
      description: 'Recharge, réparation',
      priceRange: '200-800 MAD',
    },
    {
      id: 'tuning',
      icon: '🏎️',
      title: 'Tuning',
      color: 'from-pink-500 to-pink-600',
      description: 'Préparation moteur',
      priceRange: '2000-20000 MAD',
    },
  ];

  const vehicleTypes = [
    { id: 'car', icon: '🚗', label: 'Voiture' },
    { id: 'motorcycle', icon: '🏍️', label: 'Moto' },
    { id: 'scooter', icon: '🛵', label: 'Scooter' },
    { id: 'van', icon: '🚐', label: 'Utilitaire' },
  ];

  const handleSubmit = () => {
    if (selectedService === 'tuning') {
      navigate('/customer/tuning-request');
    } else {
      navigate('/customer/offers');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Nouvelle demande</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Step 1: Vehicle Type & Service */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Type de véhicule</h2>
              <div className="grid grid-cols-4 gap-3">
                {vehicleTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setVehicleType(type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      vehicleType === type.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{type.icon}</div>
                    <p className="text-xs font-medium text-slate-700">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Service requis</h2>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                    className={`bg-gradient-to-br ${service.color} text-white rounded-2xl p-4 text-left shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="font-bold text-lg">{service.title}</h3>
                    <p className="text-xs opacity-90 mt-1">{service.description}</p>
                    <p className="text-xs opacity-75 mt-2">{service.priceRange}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Description & Photos */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Décrivez le problème</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez le problème en détail..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Photos (optionnel)</label>
              <button className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 transition-colors">
                <Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">Ajouter des photos</p>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!description}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Price */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Proposez votre prix</h2>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">Prix suggéré</span>
                  <span className="text-lg font-bold text-slate-800">
                    {services.find(s => s.id === selectedService)?.priceRange}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Votre prix"
                    className="w-full p-4 pr-16 border-2 border-slate-200 rounded-xl text-2xl font-bold text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">MAD</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Récapitulatif</p>
                  <div className="text-xs text-emerald-700 mt-2 space-y-1">
                    <p>• Véhicule: {vehicleTypes.find(v => v.id === vehicleType)?.label}</p>
                    <p>• Service: {services.find(s => s.id === selectedService)?.title}</p>
                    <p>• Description: {description.slice(0, 50)}...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!price}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                Envoyer la demande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
