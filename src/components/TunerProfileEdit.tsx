import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { ArrowLeft, Plus, Edit, Upload, CheckCircle2, Star, MapPin, Award, Shield } from 'lucide-react';
import { mockTunerData } from '../data/mockDataGlobal';

export const TunerProfileEdit: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'specialties' | 'certificates' | 'equipment'>('info');

  const [profile, setProfile] = useState({
    name: mockTunerData.profile.name,
    phone: '+212600000077',
    email: 'speed@tuningcasa.ma',
    description: mockTunerData.profile.description,
    address: 'Quartier Industriel, Casablanca',
    city: 'Casablanca',
    serviceRadius: 30,
    yearsExperience: mockTunerData.profile.yearsExperience,
    languages: ['Darija', 'Français', 'English'],
    profileImage: null,
    coverImage: null,
  });

  const [specialties, setSpecialties] = useState([
    'Stage 1',
    'Stage 2',
    'Stage 3',
    'Reprogrammation ECU',
    'Échappement sport',
    'Admission',
    'Suspension',
    'Freinage sport',
  ]);

  const [certificates, setCertificates] = useState(mockTunerData.profile.certifications.map((cert, i) => ({
    id: `cert-${i}`,
    name: cert,
    issuer: 'Organisation certifiante',
    date: '2023-01-15',
    verified: true,
  })));

  const [equipment, setEquipment] = useState([
    'Dyno',
    'ECU Tools',
    'Banc de puissance',
    'Oscilloscope',
    'Outil diagnostic',
  ]);

  const availableSpecialties = [
    'Stage 1',
    'Stage 2',
    'Stage 3',
    'Stage X',
    'Stage R',
    'Reprogrammation ECU',
    'Échappement sport',
    'Admission',
    'Suspension',
    'Freinage sport',
    'Turbo upgrade',
    'Intercooler',
    'Downpipe',
    'Boost controller',
    'Esthétique',
  ];

  const availableEquipment = [
    'Dyno',
    'ECU Tools',
    'Banc de puissance',
    'Oscilloscope',
    'Outil diagnostic',
    'Compresseur',
    'Pont élévateur',
    'Outillage spécialisé',
  ];

  const handleAddSpecialty = (specialty: string) => {
    if (!specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleAddEquipment = (item: string) => {
    if (!equipment.includes(item)) {
      setEquipment([...equipment, item]);
    }
  };

  const handleRemoveEquipment = (item: string) => {
    setEquipment(equipment.filter(e => e !== item));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Mon Profil</h1>
        </div>

        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                '🏎️'
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Upload className="w-4 h-4 text-red-600" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>{mockTunerData.profile.rating} ({mockTunerData.profile.totalReviews} avis)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-4 h-4" />
              <span>{profile.yearsExperience} ans d'expérience</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {mockTunerData.profile.certifications.map((cert, i) => (
            <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {[
            { id: 'info', label: 'Infos' },
            { id: 'specialties', label: 'Spécialités' },
            { id: 'certificates', label: 'Certificats' },
            { id: 'equipment', label: 'Équipement' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3">Informations personnelles</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600">Nom de la société</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Description</label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3">Localisation</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600">Adresse de l'atelier</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Ville</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Rayon de service (km)</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={profile.serviceRadius}
                      onChange={(e) => setProfile({ ...profile, serviceRadius: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold text-slate-800 w-16 text-center">{profile.serviceRadius} km</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3">Langues parlées</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Specialties Tab */}
        {activeTab === 'specialties' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Mes spécialités</h3>
                <span className="text-sm text-slate-500">{specialties.length} sélectionnées</span>
              </div>

              <div className="space-y-2 mb-4">
                {specialties.map((specialty, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-800">{specialty}</span>
                    <button
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Ajouter une spécialité</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddSpecialty(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="">Sélectionner une spécialité</option>
                  {availableSpecialties.filter(s => !specialties.includes(s)).map((specialty, i) => (
                    <option key={i} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Mes certificats</h3>
                <button className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{cert.name}</h4>
                        <p className="text-xs text-slate-500">{cert.issuer}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(cert.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {cert.verified ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Vérifié
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          En attente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Mon équipement</h3>
                <span className="text-sm text-slate-500">{equipment.length} équipements</span>
              </div>

              <div className="space-y-2 mb-4">
                {equipment.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-800">{item}</span>
                    <button
                      onClick={() => handleRemoveEquipment(item)}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Ajouter un équipement</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddEquipment(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="">Sélectionner un équipement</option>
                  {availableEquipment.filter(e => !equipment.includes(e)).map((item, i) => (
                    <option key={i} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Équipement vérifié</p>
                  <p className="text-xs text-red-700 mt-1">
                    Votre équipement sera vérifié par notre équipe pour garantir la qualité de vos services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <button
          onClick={() => {
            toast('Profil sauvegardé !');
            navigate('/tuner/dashboard');
          }}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
        >
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
};
