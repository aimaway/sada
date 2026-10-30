import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Car, Camera, CheckCircle2, AlertTriangle, TrendingDown } from 'lucide-react';

export const PrePurchaseInspection: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    location: '',
  });
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionAddress, setInspectionAddress] = useState('');

  const handleSubmit = () => {
    navigate('/customer/inspections');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">🔍 Inspection Pré-Achat</h1>
            <p className="text-sm opacity-90">Évitez les mauvaises surprises</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Informations du véhicule</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Marque *</label>
                <input type="text" value={vehicleInfo.make} onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })} placeholder="Ex: Dacia" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Modèle *</label>
                <input type="text" value={vehicleInfo.model} onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })} placeholder="Ex: Logan" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Année *</label>
                  <input type="number" value={vehicleInfo.year} onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })} placeholder="2020" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Kilométrage</label>
                  <input type="number" value={vehicleInfo.mileage} onChange={(e) => setVehicleInfo({ ...vehicleInfo, mileage: e.target.value })} placeholder="50000" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">VIN (optionnel)</label>
                <input type="text" value={vehicleInfo.vin} onChange={(e) => setVehicleInfo({ ...vehicleInfo, vin: e.target.value })} placeholder="17 caractères" maxLength={17} className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Où se trouve le véhicule ? *</label>
                <input type="text" value={vehicleInfo.location} onChange={(e) => setVehicleInfo({ ...vehicleInfo, location: e.target.value })} placeholder="Adresse complète" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year || !vehicleInfo.location} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Planifier l'inspection</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Date et heure souhaitées *</label>
                <input type="datetime-local" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Adresse de l'inspection *</label>
                <input type="text" value={inspectionAddress} onChange={(e) => setInspectionAddress(e.target.value)} placeholder="Où doit se rendre l'inspecteur ?" className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Ce qui sera vérifié :</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /><span>Moteur, boîte de vitesses, embrayage</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /><span>Châssis, suspension, direction</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /><span>Système électrique, batterie</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /><span>Carrosserie, signes d'accident</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /><span>Diagnostic OBD (scan électronique)</span></li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Tarif inspection</span>
                <span className="text-2xl font-bold text-slate-800">350 MAD</span>
              </div>
              <p className="text-xs text-slate-500">Paiement après l'inspection, uniquement si vous êtes satisfait</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={() => setStep(3)} disabled={!inspectionDate || !inspectionAddress} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Récapitulatif</h2>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">{vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})</p>
                  <p className="text-sm text-slate-500">{vehicleInfo.mileage && `${parseInt(vehicleInfo.mileage).toLocaleString()} km`}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">{new Date(inspectionDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">{inspectionAddress}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Rapport complet inclus</p>
                  <p className="text-sm text-green-700 mt-1">Vous recevrez un rapport détaillé avec photos, estimation des réparations, fourchette de prix de négociation, et verdict (acheter / négocier / éviter)</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Retour</button>
              <button onClick={handleSubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Confirmer l'inspection</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
