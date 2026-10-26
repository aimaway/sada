import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Eye, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';

interface Document {
  id: string;
  type: string;
  title: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  fileUrl?: string;
}

export const DocumentsManager: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'permis',
      title: 'Permis de conduire',
      number: 'B-123456',
      issueDate: '2020-03-15',
      expiryDate: '2030-03-15',
      status: 'valid',
    },
    {
      id: '2',
      type: 'assurance',
      title: 'Assurance auto',
      number: 'AXA-2024-789',
      issueDate: '2024-03-01',
      expiryDate: '2025-03-01',
      status: 'expiring',
    },
    {
      id: '3',
      type: 'carte_grise',
      title: 'Carte grise',
      number: '12345-A-1',
      issueDate: '2019-06-20',
      expiryDate: '2099-12-31',
      status: 'valid',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<Document | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-700 border-green-200';
      case 'expiring': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle2 className="w-5 h-5" />;
      case 'expiring': return <AlertTriangle className="w-5 h-5" />;
      case 'expired': return <AlertTriangle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Mes Documents</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Expiring Soon Alert */}
        {documents.some(d => d.status === 'expiring') && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 text-sm">Documents à renouveler</h3>
                <p className="text-xs text-amber-700 mt-1">
                  {documents.filter(d => d.status === 'expiring').length} document(s) expire(nt) bientôt
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc) => {
            const daysLeft = getDaysUntilExpiry(doc.expiryDate);
            
            return (
              <div key={doc.id} className={`bg-white p-4 rounded-2xl border-2 ${getStatusColor(doc.status)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      doc.status === 'valid' ? 'bg-green-100' : doc.status === 'expiring' ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      {getStatusIcon(doc.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{doc.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">N° {doc.number}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span>Délivré le {new Date(doc.issueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span>Expire le {new Date(doc.expiryDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {doc.status === 'expiring' && (
                    <div className="bg-amber-100 rounded-lg px-3 py-2 mt-2">
                      <p className="text-xs font-medium text-amber-800">
                        ⏰ Expire dans {daysLeft} jours
                      </p>
                    </div>
                  )}
                  {doc.status === 'expired' && (
                    <div className="bg-red-100 rounded-lg px-3 py-2 mt-2">
                      <p className="text-xs font-medium text-red-800">
                        ❌ Expiré depuis {Math.abs(daysLeft)} jours
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setShowViewModal(doc)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() => setEditingDoc(doc)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {documents.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500">Aucun document ajouté</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Ajouter un document
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingDoc) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingDoc ? 'Modifier le document' : 'Ajouter un document'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDoc(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Type de document</label>
                  <select
                    defaultValue={editingDoc?.type}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="permis">Permis de conduire</option>
                    <option value="assurance">Assurance auto</option>
                    <option value="carte_grise">Carte grise</option>
                    <option value="controle_technique">Contrôle technique</option>
                    <option value="vignette">Vignette fiscale</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Numéro du document</label>
                  <input
                    type="text"
                    defaultValue={editingDoc?.number}
                    placeholder="Ex: B-123456"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date de délivrance</label>
                  <input
                    type="date"
                    defaultValue={editingDoc?.issueDate}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date d'expiration</label>
                  <input
                    type="date"
                    defaultValue={editingDoc?.expiryDate}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Photo du document</label>
                  <button className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 transition-colors">
                    <p className="text-sm text-slate-500">Cliquez pour ajouter une photo</p>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDoc(null);
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                >
                  {editingDoc ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">{showViewModal.title}</h2>
                <button
                  onClick={() => setShowViewModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                    <p className="text-slate-400">Aperçu du document</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Numéro</span>
                      <span className="font-medium text-slate-800">{showViewModal.number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Délivré le</span>
                      <span className="font-medium text-slate-800">
                        {new Date(showViewModal.issueDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Expire le</span>
                      <span className="font-medium text-slate-800">
                        {new Date(showViewModal.expiryDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Statut</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showViewModal.status)}`}>
                        {showViewModal.status === 'valid' && 'Valide'}
                        {showViewModal.status === 'expiring' && 'Expire bientôt'}
                        {showViewModal.status === 'expired' && 'Expiré'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowViewModal(null)}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
