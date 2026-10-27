import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockClientData } from '../data/mockDataGlobal';
import {
  ArrowLeft, Plus, Edit2, Trash2, Car, Calendar, Gauge, CheckCircle2,
  AlertCircle, X, Save, Wrench, FileText
} from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  mileage: number;
  lastService: string;
}

export const CustomerVehicles: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockClientData.vehicles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    mileage: '',
  });

  const handleAdd = () => {
    const newVehicle: Vehicle = {
      id: `VEH-${Date.now()}`,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      plate: formData.plate,
      mileage: parseInt(formData.mileage) || 0,
      lastService: new Date().toISOString().split('T')[0],
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddModal(false);
    setFormData({ make: '', model: '', year: '', plate: '', mileage: '' });
  };

  const handleEdit = () => {
    if (!editingVehicle) return;
    setVehicles(vehicles.map(v => v.id === editingVehicle.id ? {
      ...v,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      plate: formData.plate,
      mileage: parseInt(formData.mileage),
    } : v));
    setEditingVehicle(null);
    setFormData({ make: '', model: '', year: '', plate: '', mileage: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      plate: vehicle.plate,
      mileage: vehicle.mileage.toString(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/customer/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Mon Garage</h1>
              <p className="text-xs text-slate-500">{vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Vehicles List */}
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                🚗
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Plaque : {vehicle.plate}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(vehicle)}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <Edit2 className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <Gauge className="w-3 h-3" />
                  <span>Kilométrage</span>
                </div>
                <p className="text-sm font-medium text-slate-800">
                  {vehicle.mileage.toLocaleString()} km
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <Wrench className="w-3 h-3" />
                  <span>Dernier service</span>
                </div>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(vehicle.lastService).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <FileText className="w-3 h-3" />
                  <span>Documents</span>
                </div>
                <p className="text-sm font-medium text-emerald-600">
                  3 fichiers
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/customer/new-request-enhanced?vehicle=${vehicle.id}`)}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
              >
                Demander un service
              </button>
              <button
                onClick={() => navigate(`/customer/profile/maintenance-history?vehicle=${vehicle.id}`)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200"
              >
                Historique
              </button>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Aucun véhicule ajouté</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Ajouter votre premier véhicule
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                    setFormData({ make: '', model: '', year: '', plate: '', mileage: '' });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Marque *</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="Ex: Dacia"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Modèle *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ex: Logan"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Année *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2020"
                      min="1900"
                      max="2030"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Kilométrage</label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                      placeholder="85000"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Plaque d'immatriculation *</label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                    placeholder="12345-A-1"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Format marocain : 12345-A-1</p>
                </div>

                <button
                  onClick={editingVehicle ? handleEdit : handleAdd}
                  disabled={!formData.make || !formData.model || !formData.year || !formData.plate}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingVehicle ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
