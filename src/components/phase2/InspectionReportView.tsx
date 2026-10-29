import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Share2, Download, Camera, FileText } from 'lucide-react';

const mockInspectionReport = {
  id: 1,
  publicSlug: 'insp-abc123xyz',
  vehicle: { make: 'Dacia', model: 'Logan', year: 2019, mileage: 85000 },
  inspectionDate: '2024-03-15T10:00:00',
  inspector: { name: 'Karim Tazi', rating: 4.9, jobs: 234 },
  checklist: {
    engine: { status: 'good', notes: 'Moteur en bon état' },
    gearbox: { status: 'good', notes: 'Boîte de vitesses fluide' },
    chassis: { status: 'fair', notes: 'Quelques traces de corrosion' },
    electrics: { status: 'good', notes: 'Système électrique fonctionnel' },
    paint_accident: { status: 'fair', notes: 'Retouche peinture sur aile avant droite' },
    obd_scan: { status: 'good', notes: 'Pas de codes erreur' },
  },
  repairCostEstimate: 250000,
  negotiationRange: { min: 5500000, max: 6200000 },
  verdict: 'negotiate',
  verdictExplanation: 'Le véhicule est en bon état général avec quelques points d\'attention mineurs.',
  photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
};

export const InspectionReportView: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'buy': return { icon: CheckCircle2, color: 'green', label: 'Acheter', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', description: 'Ce véhicule est en excellent état.' };
      case 'negotiate': return { icon: AlertTriangle, color: 'orange', label: 'Négocier', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700', description: 'Le véhicule est bon mais certains points nécessitent une négociation.' };
      case 'avoid': return { icon: XCircle, color: 'red', label: 'Éviter', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700', description: 'Des problèmes importants ont été détectés.' };
      default: return { icon: AlertTriangle, color: 'gray', label: 'Inconnu', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700', description: '' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'good': return { icon: CheckCircle2, color: 'green', label: 'Bon état' };
      case 'fair': return { icon: AlertTriangle, color: 'orange', label: 'Acceptable' };
      case 'poor': return { icon: XCircle, color: 'red', label: 'À réparer' };
      case 'critical': return { icon: XCircle, color: 'red', label: 'Critique' };
      default: return { icon: AlertTriangle, color: 'gray', label: 'Non vérifié' };
    }
  };

  const verdictConfig = getVerdictConfig(mockInspectionReport.verdict);
  const VerdictIcon = verdictConfig.icon;

  const handleShare = () => {
    const shareUrl = `https://tomobily.app/inspection-report/${mockInspectionReport.publicSlug}`;
    if (navigator.share) {
      navigator.share({ title: `Rapport d'inspection - ${mockInspectionReport.vehicle.make} ${mockInspectionReport.vehicle.model}`, text: `Rapport d'inspection complet`, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 bg-white/20 rounded-full"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 bg-white/20 rounded-full"><Download className="w-5 h-5" /></button>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-90 mb-1">Rapport d'inspection</p>
          <h1 className="text-2xl font-bold">{mockInspectionReport.vehicle.year} {mockInspectionReport.vehicle.make} {mockInspectionReport.vehicle.model}</h1>
          <p className="text-sm opacity-90 mt-1">{mockInspectionReport.vehicle.mileage.toLocaleString()} km • {new Date(mockInspectionReport.inspectionDate).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className={`${verdictConfig.bgColor} p-6 rounded-xl border-2 ${verdictConfig.borderColor}`}>
          <div className="flex items-start gap-4">
            <VerdictIcon className={`w-12 h-12 ${verdictConfig.textColor}`} />
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${verdictConfig.textColor} mb-2`}>Verdict : {verdictConfig.label}</h2>
              <p className={`text-sm ${verdictConfig.textColor}`}>{verdictConfig.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Inspecteur</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👨‍🔧</div>
            <div>
              <p className="font-medium text-slate-800">{mockInspectionReport.inspector.name}</p>
              <p className="text-sm text-slate-500">⭐ {mockInspectionReport.inspector.rating} • {mockInspectionReport.inspector.jobs} inspections</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Checklist d'inspection</h3>
          <div className="space-y-3">
            {Object.entries(mockInspectionReport.checklist).map(([key, item]) => {
              const statusConfig = getStatusConfig(item.status);
              const StatusIcon = statusConfig.icon;
              const labels: Record<string, string> = { engine: 'Moteur', gearbox: 'Boîte de vitesses', chassis: 'Châssis', electrics: 'Système électrique', paint_accident: 'Peinture & Accidents', obd_scan: 'Diagnostic OBD' };
              return (
                <div key={key} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <StatusIcon className={`w-5 h-5 text-${statusConfig.color}-600 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">{labels[key]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>{statusConfig.label}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Analyse des prix</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">Coût estimé des réparations</p>
              <p className="text-2xl font-bold text-slate-800">{(mockInspectionReport.repairCostEstimate / 100).toLocaleString()} MAD</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Fourchette de prix recommandée</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-green-600">{(mockInspectionReport.negotiationRange.min / 100).toLocaleString()} MAD</span>
                <span className="text-slate-400">-</span>
                <span className="text-xl font-bold text-green-600">{(mockInspectionReport.negotiationRange.max / 100).toLocaleString()} MAD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Photos ({mockInspectionReport.photos.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {mockInspectionReport.photos.map((photo, index) => (
              <div key={index} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center"><Camera className="w-8 h-8 text-slate-400" /></div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-2">Explication du verdict</h3>
          <p className="text-sm text-slate-700">{mockInspectionReport.verdictExplanation}</p>
        </div>

        <div className="space-y-3">
          <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"><Share2 className="w-5 h-5" />Partager le rapport</button>
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"><FileText className="w-5 h-5" />Télécharger PDF</button>
        </div>
      </div>
    </div>
  );
};
