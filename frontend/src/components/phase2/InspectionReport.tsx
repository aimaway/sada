import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Share2, Download, Car, Calendar, MapPin } from 'lucide-react';

// Mock data for demo
const mockInspectionReport = {
  id: 1,
  vehicle: {
    make: 'Dacia',
    model: 'Logan',
    year: 2018,
    mileage: 85000,
    vin: 'UU1LSDAQS58123456',
  },
  inspectionDate: '2024-03-15T10:00:00',
  inspector: {
    name: 'Karim Tazi',
    rating: 4.9,
    photo: '👨‍🔧',
  },
  verdict: 'negotiate',
  verdictExplanation: 'Le véhicule est en bon état général mais nécessite des réparations estimées à 8000 MAD. Nous recommandons de négocier le prix à la baisse.',
  repairCostEstimate: 8000,
  negotiationRange: {
    min: 55000,
    max: 62000,
  },
  checklist: {
    engine: {
      status: 'good',
      notes: 'Moteur en bon état, pas de fumée anormale, démarrage facile.',
      photos: [],
    },
    gearbox: {
      status: 'good',
      notes: 'Boîte de vitesses fluide, pas de craquement.',
      photos: [],
    },
    chassis: {
      status: 'fair',
      notes: 'Amortisseurs arrière à remplacer dans les 6 mois.',
      photos: ['chassis_1.jpg'],
    },
    electrics: {
      status: 'good',
      notes: 'Système électrique fonctionnel, batterie en bon état.',
      photos: [],
    },
    paint_accident: {
      status: 'fair',
      notes: 'Traces de peinture sur l\'aile avant droite, possible petite réparation.',
      photos: ['paint_1.jpg', 'paint_2.jpg'],
    },
    obd_scan: {
      status: 'good',
      notes: 'Pas de codes d\'erreur, tous les capteurs fonctionnent.',
      photos: [],
    },
  },
  photos: ['overall_1.jpg', 'overall_2.jpg', 'engine.jpg'],
};

export const InspectionReport: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'buy':
        return {
          icon: CheckCircle2,
          color: 'green',
          label: 'Acheter',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case 'negotiate':
        return {
          icon: AlertTriangle,
          color: 'orange',
          label: 'Négocier',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
        };
      case 'avoid':
        return {
          icon: XCircle,
          color: 'red',
          label: 'Éviter',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'gray',
          label: 'En attente',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'good':
        return { color: 'green', label: 'Bon état' };
      case 'fair':
        return { color: 'orange', label: 'Acceptable' };
      case 'poor':
        return { color: 'red', label: 'À réparer' };
      case 'critical':
        return { color: 'red', label: 'Critique' };
      default:
        return { color: 'gray', label: 'Non vérifié' };
    }
  };

  const verdictConfig = getVerdictConfig(mockInspectionReport.verdict);
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">📋 Rapport d'Inspection</h1>
            <p className="text-sm opacity-90">Rapport #{slug}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Verdict Card */}
        <div className={`${verdictConfig.bgColor} p-6 rounded-xl border-2 ${verdictConfig.borderColor}`}>
          <div className="flex items-start gap-4">
            <VerdictIcon className={`w-12 h-12 ${verdictConfig.textColor}`} />
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${verdictConfig.textColor} mb-2`}>
                Verdict : {verdictConfig.label}
              </h2>
              <p className={`text-sm ${verdictConfig.textColor}`}>
                {mockInspectionReport.verdictExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Véhicule inspecté</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-800">
                {mockInspectionReport.vehicle.make} {mockInspectionReport.vehicle.model} ({mockInspectionReport.vehicle.year})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {mockInspectionReport.vehicle.mileage.toLocaleString()} km
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                Inspecté le {new Date(mockInspectionReport.inspectionDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* Price Analysis */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Analyse des prix</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-slate-700">Coût des réparations estimé</span>
              <span className="font-bold text-red-600">
                {mockInspectionReport.repairCostEstimate.toLocaleString()} MAD
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-slate-700">Fourchette de négociation</span>
              <span className="font-bold text-green-600">
                {mockInspectionReport.negotiationRange.min.toLocaleString()} - {mockInspectionReport.negotiationRange.max.toLocaleString()} MAD
              </span>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Checklist d'inspection</h3>
          <div className="space-y-3">
            {Object.entries(mockInspectionReport.checklist).map(([key, item]) => {
              const statusConfig = getStatusConfig(item.status);
              return (
                <div key={key} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-800 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.notes}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspector Info */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Inspecteur</h3>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{mockInspectionReport.inspector.photo}</div>
            <div>
              <p className="font-medium text-slate-800">{mockInspectionReport.inspector.name}</p>
              <p className="text-sm text-slate-500">
                ⭐ {mockInspectionReport.inspector.rating} / 5.0
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
            <Download className="w-5 h-5" />
            Télécharger le PDF
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50">
            <Share2 className="w-5 h-5" />
            Partager le rapport
          </button>
        </div>
      </div>
    </div>
  );
};
