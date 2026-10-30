import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { mockClientData } from '../data/mockDataGlobal';
import {
  ArrowLeft, Plus, Edit2, Trash2, MapPin, Home, Briefcase, Star,
  X, Save, Navigation, CheckCircle2
} from 'lucide-react';

interface Address {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export const CustomerAddresses: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(mockClientData.addresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    address: '',
    isDefault: false,
  });

  const handleAdd = () => {
    const newAddress: Address = {
      id: `ADDR-${Date.now()}`,
      label: formData.label,
      address: formData.address,
      lat: 33.5731 + (Math.random() - 0.5) * 0.1,
      lng: -7.5898 + (Math.random() - 0.5) * 0.1,
      isDefault: formData.isDefault || addresses.length === 0,
    };
    setAddresses([...addresses, newAddress]);
    setShowAddModal(false);
    setFormData({ label: '', address: '', isDefault: false });
  };

  const handleEdit = () => {
    if (!editingAddress) return;
    setAddresses(addresses.map(a => a.id === editingAddress.id ? {
      ...a,
      label: formData.label,
      address: formData.address,
      isDefault: formData.isDefault,
    } : a));
    setEditingAddress(null);
    setFormData({ label: '', address: '', isDefault: false });
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      address: address.address,
      isDefault: address.isDefault,
    });
  };

  const getAddressIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('maison') || lower.includes('home')) return <Home className="w-5 h-5 text-blue-600" />;
    if (lower.includes('bureau') || lower.includes('work')) return <Briefcase className="w-5 h-5 text-purple-600" />;
    return <MapPin className="w-5 h-5 text-emerald-600" />;
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
              <h1 className="text-xl font-bold text-slate-800">Mes Adresses</h1>
              <p className="text-xs text-slate-500">{addresses.length} adresse{addresses.length > 1 ? 's' : ''} enregistrée{addresses.length > 1 ? 's' : ''}</p>
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
        {/* Addresses List */}
        {addresses.map((address) => (
          <div key={address.id} className={`bg-white rounded-2xl p-4 border-2 ${address.isDefault ? 'border-emerald-500' : 'border-slate-200'}`}>
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                {getAddressIcon(address.label)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{address.label}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Par défaut
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{address.address}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(address)}
                  className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <Edit2 className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Définir comme adresse par défaut
              </button>
            )}
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Aucune adresse enregistrée</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Ajouter votre première adresse
            </button>
          </div>
        )}

        {/* Map Preview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" />
            Carte de vos adresses
          </h3>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">{addresses.length} adresse{addresses.length > 1 ? 's' : ''} sur la carte</p>
              <p className="text-xs text-slate-500 mt-1">(Intégration Google Maps à venir)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingAddress) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAddress(null);
                    setFormData({ label: '', address: '', isDefault: false });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Libellé *</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Ex: Maison, Bureau, etc."
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Adresse complète *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ex: Bd Zerktouni, Casablanca"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Simulate geolocation
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setFormData({
                              ...formData,
                              address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
                            });
                          },
                          () => {
                            toast('Impossible d\'obtenir votre position');
                          }
                        );
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Utiliser ma position actuelle
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Adresse par défaut</p>
                    <p className="text-xs text-slate-500">Utilisée pour les nouvelles demandes</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isDefault ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isDefault ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={editingAddress ? handleEdit : handleAdd}
                  disabled={!formData.label || !formData.address}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingAddress ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
