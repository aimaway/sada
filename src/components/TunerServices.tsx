import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { mockTunerData } from '../data/mockDataGlobal';

export const TunerServices: React.FC = () => {
  const navigate = useNavigate();
  const [stages, setStages] = useState(mockTunerData.stages);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);

  const [newStage, setNewStage] = useState({
    level: '',
    name: '',
    description: '',
    features: [] as string[],
    priceRange: '',
    popular: false,
  });

  const availableFeatures = [
    'Reprogrammation ECU',
    'Filtre à air sport',
    'Échappement sport',
    'Downpipe sport',
    'Intercooler upgrade',
    'Injecteurs haute performance',
    'Turbo upgrade',
    'Fuel pump haute performance',
    'Freins upgrade',
    'Suspension sport',
    'Boîte renforcée',
    'Embrayage sport',
  ];

  const handleAddFeature = (feature: string) => {
    if (!newStage.features.includes(feature)) {
      setNewStage({ ...newStage, features: [...newStage.features, feature] });
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setNewStage({ ...newStage, features: newStage.features.filter(f => f !== feature) });
  };

  const handleSaveStage = () => {
    if (editingStage) {
      setStages(stages.map(s => s.level === editingStage.level ? { ...newStage, level: parseInt(newStage.level) } : s));
    } else {
      setStages([...stages, { ...newStage, level: parseInt(newStage.level) }]);
    }
    setShowAddModal(false);
    setEditingStage(null);
    setNewStage({ level: '', name: '', description: '', features: [], priceRange: '', popular: false });
  };

  const handleEditStage = (stage: any) => {
    setEditingStage(stage);
    setNewStage({
      level: stage.level.toString(),
      name: stage.name,
      description: stage.description,
      features: stage.features,
      priceRange: stage.priceRange,
      popular: stage.popular,
    });
    setShowAddModal(true);
  };

  const handleDeleteStage = (level: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stage ?')) {
      setStages(stages.filter(s => s.level !== level));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Gérer mes stages</h1>
        </div>
        <p className="text-sm text-slate-600">Configurez les stages de préparation que vous proposez</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Add Button */}
        <button
          onClick={() => {
            setEditingStage(null);
            setNewStage({ level: '', name: '', description: '', features: [], priceRange: '', popular: false });
            setShowAddModal(true);
          }}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter un nouveau stage
        </button>

        {/* Stages List */}
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.level} className={`bg-white p-4 rounded-2xl border-2 ${stage.popular ? 'border-red-500' : 'border-slate-200'}`}>
              {stage.popular && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                  ⭐ Populaire
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{stage.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{stage.description}</p>
                  
                  <div className="space-y-2 mb-3">
                    {stage.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">{stage.priceRange}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStage(stage)}
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteStage(stage.level)}
                        className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stages.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500 mb-4">Aucun stage configuré</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
            >
              Ajouter votre premier stage
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingStage ? 'Modifier le stage' : 'Ajouter un stage'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStage(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Niveau du stage</label>
                  <select
                    value={newStage.level}
                    onChange={(e) => setNewStage({ ...newStage, level: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    disabled={!!editingStage}
                  >
                    <option value="">Sélectionner un niveau</option>
                    <option value="1">Stage 1</option>
                    <option value="2">Stage 2</option>
                    <option value="3">Stage 3</option>
                    <option value="4">Stage X</option>
                    <option value="5">Stage R</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Nom du stage</label>
                  <input
                    type="text"
                    value={newStage.name}
                    onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                    placeholder="Ex: Stage 1 - Optimisation de base"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                  <textarea
                    value={newStage.description}
                    onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                    placeholder="Décrivez ce que comprend ce stage..."
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Fourchette de prix</label>
                  <input
                    type="text"
                    value={newStage.priceRange}
                    onChange={(e) => setNewStage({ ...newStage, priceRange: e.target.value })}
                    placeholder="Ex: 2000-4000 MAD"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Services inclus</label>
                  <div className="space-y-2 mb-3">
                    {newStage.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-800">{feature}</span>
                        <button
                          onClick={() => handleRemoveFeature(feature)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddFeature(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="">Ajouter un service</option>
                    {availableFeatures.filter(f => !newStage.features.includes(f)).map((feature, i) => (
                      <option key={i} value={feature}>{feature}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Marquer comme populaire</p>
                    <p className="text-xs text-slate-600">Ce stage sera mis en avant</p>
                  </div>
                  <button
                    onClick={() => setNewStage({ ...newStage, popular: !newStage.popular })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      newStage.popular ? 'bg-red-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        newStage.popular ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleSaveStage}
                  disabled={!newStage.level || !newStage.name || !newStage.description || !newStage.priceRange || newStage.features.length === 0}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingStage ? 'Modifier' : 'Ajouter'} le stage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
