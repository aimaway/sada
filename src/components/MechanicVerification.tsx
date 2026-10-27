import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, CheckCircle2, AlertCircle, Shield, Clock } from 'lucide-react';

export const MechanicVerification: React.FC = () => {
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState([
    {
      id: '1',
      type: 'id_card',
      name: 'Carte d\'identité nationale',
      status: 'verified',
      uploadedAt: '2024-01-15',
      fileUrl: '/mock/docs/cin.jpg',
    },
    {
      id: '2',
      type: 'workshop',
      name: 'Photos de l\'atelier',
      status: 'verified',
      uploadedAt: '2024-01-20',
      fileUrl: '/mock/docs/workshop.jpg',
    },
    {
      id: '3',
      type: 'certificate',
      name: 'Certification professionnelle',
      status: 'verified',
      uploadedAt: '2024-02-01',
      fileUrl: '/mock/docs/cert.jpg',
    },
    {
      id: '4',
      type: 'insurance',
      name: 'Assurance professionnelle',
      status: 'pending',
      uploadedAt: '2024-03-10',
      fileUrl: null,
    },
    {
      id: '5',
      type: 'reference',
      name: 'Lettres de recommandation',
      status: 'not_uploaded',
      uploadedAt: null,
      fileUrl: null,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Vérifié';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return 'Non uploadé';
    }
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const totalCount = documents.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/mechanic/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Documents de vérification</h1>
            <p className="text-xs text-slate-500">{verifiedCount}/{totalCount} documents vérifiés</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Verification Progress */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Progression de la vérification</h3>
            <span className="text-sm font-bold text-blue-600">{Math.round((verifiedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {verifiedCount === totalCount
              ? '✅ Tous les documents sont vérifiés !'
              : `${totalCount - verifiedCount} document(s) restant(s) à vérifier`}
          </p>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  doc.status === 'verified' ? 'bg-green-100' :
                  doc.status === 'pending' ? 'bg-amber-100' :
                  doc.status === 'rejected' ? 'bg-red-100' : 'bg-slate-100'
                }`}>
                  {getStatusIcon(doc.status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                    {doc.uploadedAt && (
                      <span className="text-xs text-slate-500">
                        Uploadé le {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {doc.status === 'not_uploaded' || doc.status === 'rejected' ? (
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  {doc.status === 'rejected' ? 'Ré-uploadé' : 'Uploader'}
                </button>
              ) : doc.status === 'pending' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700">
                    ⏳ Votre document est en cours de vérification. Cela prend généralement 24-48h.
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200">
                    Voir
                  </button>
                  <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200">
                    Remplacer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Exigences de vérification
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Carte d'identité valide (recto-verso)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Photos de l'atelier (minimum 3 photos)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Certification professionnelle ou diplôme</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Assurance professionnelle valide</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Lettres de recommandation (optionnel)</span>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Pourquoi se vérifier ?</p>
              <p className="text-xs text-blue-700 mt-1">
                Les mécaniciens vérifiés ont un badge spécial sur leur profil, ce qui augmente la confiance des clients et le nombre de demandes reçues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
