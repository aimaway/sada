import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Save, CheckCircle2, TrendingUp } from 'lucide-react';

export const MechanicPricing: React.FC = () => {
  const navigate = useNavigate();
  
  const [pricing, setPricing] = useState({
    baseRate: 150,
    hourlyRate: 200,
    emergencySurcharge: 50,
    weekendSurcharge: 30,
    nightSurcharge: 40,
    minimumCharge: 100,
    travelFee: 20,
    travelFeePerKm: 5,
  });

  const [servicePrices, setServicePrices] = useState([
    { id: '1', name: 'Vidange standard', price: 250, duration: 60 },
    { id: '2', name: 'Changement de batterie', price: 350, duration: 45 },
    { id: '3', name: 'Diagnostic complet', price: 200, duration: 90 },
    { id: '4', name: 'Remplacement plaquettes de frein', price: 400, duration: 120 },
    { id: '5', name: 'Réparation crevaison', price: 150, duration: 30 },
  ]);

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      name: 'Nouveau service',
      price: 0,
      duration: 60,
    };
    setServicePrices([...servicePrices, newService]);
  };

  const handleUpdateService = (id: string, field: string, value: any) => {
    setServicePrices(servicePrices.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleDeleteService = (id: string) => {
    setServicePrices(servicePrices.filter(s => s.id !== id));
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
              <h1 className="text-xl font-bold text-slate-800">Configuration des prix</h1>
              <p className="text-xs text-slate-500">Définissez vos tarifs</p>
            </div>
          </div>
          <button
            onClick={() => {
              alert('Prix mis à jour !');
              navigate('/mechanic/profile');
            }}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Base Rates */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Tarifs de base
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Tarif de base (MAD)
              </label>
              <input
                type="number"
                value={pricing.baseRate}
                onChange={(e) => setPricing({ ...pricing, baseRate: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Tarif minimum pour toute intervention</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Tarif horaire (MAD/heure)
              </label>
              <input
                type="number"
                value={pricing.hourlyRate}
                onChange={(e) => setPricing({ ...pricing, hourlyRate: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Charge minimum (MAD)
              </label>
              <input
                type="number"
                value={pricing.minimumCharge}
                onChange={(e) => setPricing({ ...pricing, minimumCharge: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Surcharges */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Suppléments
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Supplément urgence (MAD)
              </label>
              <input
                type="number"
                value={pricing.emergencySurcharge}
                onChange={(e) => setPricing({ ...pricing, emergencySurcharge: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Pour les interventions urgentes</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Supplément week-end (%)
              </label>
              <input
                type="number"
                value={pricing.weekendSurcharge}
                onChange={(e) => setPricing({ ...pricing, weekendSurcharge: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Supplément nuit (%)
              </label>
              <input
                type="number"
                value={pricing.nightSurcharge}
                onChange={(e) => setPricing({ ...pricing, nightSurcharge: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Travel Fees */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Frais de déplacement</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Frais de déplacement de base (MAD)
              </label>
              <input
                type="number"
                value={pricing.travelFee}
                onChange={(e) => setPricing({ ...pricing, travelFee: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Frais par kilomètre (MAD/km)
              </label>
              <input
                type="number"
                value={pricing.travelFeePerKm}
                onChange={(e) => setPricing({ ...pricing, travelFeePerKm: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Service Prices */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Prix par service</h3>
            <button
              onClick={handleAddService}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              + Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {servicePrices.map((service) => (
              <div key={service.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleUpdateService(service.id, 'name', e.target.value)}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Prix (MAD)</label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => handleUpdateService(service.id, 'price', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Durée (min)</label>
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) => handleUpdateService(service.id, 'duration', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Conseil</p>
              <p className="text-xs text-blue-700 mt-1">
                Des prix compétitifs augmentent vos chances d'être choisi, mais assurez-vous de couvrir vos coûts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
