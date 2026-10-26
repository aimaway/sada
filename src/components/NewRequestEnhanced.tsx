import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, CheckCircle2, TrendingUp } from 'lucide-react';
import { IntentTiles } from './IntentTiles';

export const NewRequestEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service');
  const intent = searchParams.get('intent');
  const preselectedFamily = searchParams.get('family');
  
  const [step, setStep] = useState(intent ? 1 : 1);
  const [selectedService, setSelectedService] = useState(preselectedService || '');
  const [selectedFamily, setSelectedFamily] = useState<string | null>(preselectedFamily);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('car');

  // 15 Scénarios détaillés organisés par familles
  const serviceFamilies = [
    {
      id: 'urgent',
      name: 'Urgence',
      icon: '🚨',
      color: 'from-red-500 to-red-600',
      scenarios: [
        { id: 'battery', icon: '🔋', title: 'Batterie', description: 'Voiture ne démarre pas', priceRange: '400-1200 MAD', count: 245 },
        { id: 'tire', icon: '🛞', title: 'Pneu crevé', description: 'Crevaison, changement', priceRange: '100-800 MAD', count: 189 },
        { id: 'brakes', icon: '🛑', title: 'Freins', description: 'Problème de freinage', priceRange: '300-1500 MAD', count: 156 },
        { id: 'ac', icon: '❄️', title: 'Climatisation', description: 'Panne de clim', priceRange: '200-800 MAD', count: 98 },
        { id: 'sos', icon: '🆘', title: 'SOS Mécanique', description: 'Panne grave', priceRange: '500-3000 MAD', count: 67 },
      ],
    },
    {
      id: 'maintenance',
      name: 'Entretien',
      icon: '🔧',
      color: 'from-green-500 to-green-600',
      scenarios: [
        { id: 'oil', icon: '🛢️', title: 'Vidange', description: 'Huile moteur + filtre', priceRange: '200-600 MAD', count: 534 },
        { id: 'filters', icon: '🔍', title: 'Filtres', description: 'Air, huile, habitacle', priceRange: '100-400 MAD', count: 287 },
        { id: 'spark', icon: '⚡', title: 'Bougies', description: 'Remplacement bougies', priceRange: '150-500 MAD', count: 145 },
        { id: 'timing', icon: '⏰', title: 'Distribution', description: 'Courroie/chaîne', priceRange: '1500-4000 MAD', count: 78 },
      ],
    },
    {
      id: 'diagnostic',
      name: 'Diagnostic',
      icon: '🔬',
      color: 'from-purple-500 to-purple-600',
      scenarios: [
        { id: 'obd', icon: '💻', title: 'Scan OBD', description: 'Diagnostic électronique', priceRange: '150-400 MAD', count: 412 },
        { id: 'warning', icon: '⚠️', title: 'Voyant allumé', description: 'Diagnostic voyant', priceRange: '100-300 MAD', count: 298 },
        { id: 'noise', icon: '🔊', title: 'Bruit anormal', description: 'Diagnostic sonore', priceRange: '150-500 MAD', count: 167 },
      ],
    },
    {
      id: 'repair',
      name: 'Réparation',
      icon: '🛠️',
      color: 'from-blue-500 to-blue-600',
      scenarios: [
        { id: 'engine', icon: '⚙️', title: 'Moteur', description: 'Réparation moteur', priceRange: '2000-8000 MAD', count: 89 },
        { id: 'gearbox', icon: '🔄', title: 'Boîte de vitesses', description: 'Réparation boîte', priceRange: '1500-5000 MAD', count: 56 },
        { id: 'suspension', icon: '📐', title: 'Suspension', description: 'Amortisseurs, ressorts', priceRange: '800-2500 MAD', count: 134 },
        { id: 'electrical', icon: '🔌', title: 'Électricité', description: 'Système électrique', priceRange: '300-1500 MAD', count: 201 },
      ],
    },
    {
      id: 'parts',
      name: 'Pièces & Accessoires',
      icon: '📦',
      color: 'from-orange-500 to-orange-600',
      scenarios: [
        { id: 'parts', icon: '🔩', title: 'Pièces détachées', description: 'Commande de pièces', priceRange: '50-5000 MAD', count: 678 },
        { id: 'accessory', icon: '🎁', title: 'Accessoires', description: 'Accessoires auto', priceRange: '50-2000 MAD', count: 445 },
      ],
    },
  ];

  const vehicleTypes = [
    { id: 'car', icon: '🚗', label: 'Voiture' },
    { id: 'motorcycle', icon: '🏍️', label: 'Moto' },
    { id: 'scooter', icon: '🛵', label: 'Scooter' },
    { id: 'van', icon: '🚐', label: 'Utilitaire' },
  ];

  // Get all scenarios for search
  const allScenarios = serviceFamilies.flatMap(family => 
    family.scenarios.map(scenario => ({ ...scenario, familyId: family.id, familyName: family.name }))
  );

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
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
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

        {/* Step 1: Intent Tiles + Family Selection + Scenarios */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Intent Tiles - Phase A */}
            <IntentTiles />

            {/* Vehicle Type */}
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

            {/* Service Families */}
            {!selectedFamily && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3">Catégorie de service</h2>
                <div className="grid grid-cols-2 gap-3">
                  {serviceFamilies.map((family) => (
                    <button
                      key={family.id}
                      onClick={() => setSelectedFamily(family.id)}
                      className={`bg-gradient-to-br ${family.color} text-white rounded-2xl p-4 text-left shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                    >
                      <div className="text-3xl mb-2">{family.icon}</div>
                      <h3 className="font-bold text-lg">{family.name}</h3>
                      <p className="text-xs opacity-90 mt-1">
                        {family.scenarios.length} services
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scenarios for Selected Family */}
            {selectedFamily && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-slate-800">
                    {serviceFamilies.find(f => f.id === selectedFamily)?.name}
                  </h2>
                  <button
                    onClick={() => setSelectedFamily(null)}
                    className="text-sm text-emerald-600 font-medium"
                  >
                    ← Autres catégories
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {serviceFamilies
                    .find(f => f.id === selectedFamily)
                    ?.scenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => {
                          setSelectedService(scenario.id);
                          setStep(2);
                        }}
                        className="bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-emerald-500 transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-3xl">{scenario.icon}</div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <TrendingUp className="w-3 h-3" />
                            <span>{scenario.count}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{scenario.title}</h3>
                        <p className="text-xs text-slate-600 mb-2">{scenario.description}</p>
                        <p className="text-xs font-medium text-emerald-600">{scenario.priceRange}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}
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
                onClick={() => {
                  if (selectedFamily) {
                    setStep(1);
                  } else {
                    setSelectedFamily(null);
                    setStep(1);
                  }
                }}
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
                    {allScenarios.find(s => s.id === selectedService)?.priceRange}
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
                    <p>• Service: {allScenarios.find(s => s.id === selectedService)?.title}</p>
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
