import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Award, Star, Shield, Edit, Upload, CheckCircle2 } from 'lucide-react';

export const MechanicProfileEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'certificates' | 'products' | 'plans'>('info');

  const [profile, setProfile] = useState({
    name: 'Ahmed Benali',
    phone: '+212600000001',
    experience: 8,
    rating: 4.8,
    totalJobs: 234,
    specialties: ['Toyota', 'Dacia', 'Renault'],
    skills: ['Diagnostic électronique', 'Système de freinage', 'Climatisation'],
    certificates: [
      { id: '1', name: 'Certification Toyota', issuer: 'Toyota Maroc', date: '2020-05-15', verified: true },
      { id: '2', name: 'Formation Bosch', issuer: 'Bosch Car Service', date: '2019-08-20', verified: true },
    ],
    badges: ['verified', 'top_rated', 'fast_response'],
    profileImage: null,
  });

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCertificate, setNewCertificate] = useState({ name: '', issuer: '', date: '' });

  const availableSkills = [
    'Diagnostic électronique',
    'Système de freinage',
    'Climatisation',
    'Système électrique',
    'Transmission',
    'Suspension',
    'Direction',
    'Échappement',
    'Injection diesel',
    'Hybride/Électrique',
  ];

  const badgesList = [
    { id: 'verified', label: 'Vérifié', icon: '✓', color: 'bg-green-500' },
    { id: 'top_rated', label: 'Top Rated', icon: '⭐', color: 'bg-amber-500' },
    { id: 'fast_response', label: 'Réponse rapide', icon: '⚡', color: 'bg-blue-500' },
    { id: 'eco_friendly', label: 'Éco-responsable', icon: '🌱', color: 'bg-green-600' },
    { id: 'emergency', label: 'Urgences 24/7', icon: '🚨', color: 'bg-red-500' },
  ];

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleAddCertificate = () => {
    if (newCertificate.name && newCertificate.issuer && newCertificate.date) {
      setProfile({
        ...profile,
        certificates: [
          ...profile.certificates,
          {
            id: Date.now().toString(),
            name: newCertificate.name,
            issuer: newCertificate.issuer,
            date: newCertificate.date,
            verified: false,
          },
        ],
      });
      setNewCertificate({ name: '', issuer: '', date: '' });
      setShowAddCertificate(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header with Profile Image */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Mon Profil</h1>
        </div>

        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                '👨‍🔧'
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Upload className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>{profile.rating} ({profile.totalJobs} jobs)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-4 h-4" />
              <span>{profile.experience} ans d'expérience</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.badges.map((badgeId) => {
            const badge = badgesList.find(b => b.id === badgeId);
            if (!badge) return null;
            return (
              <span key={badgeId} className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                {badge.icon} {badge.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {[
            { id: 'info', label: 'Infos' },
            { id: 'skills', label: 'Compétences' },
            { id: 'certificates', label: 'Certificats' },
            { id: 'products', label: 'Produits' },
            { id: 'plans', label: 'Plans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
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
                  <label className="text-sm text-slate-600">Nom complet</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Années d'expérience</label>
                  <input
                    type="number"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) })}
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3">Spécialités</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Mes compétences</h3>
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-2">
                {profile.skills.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-800">{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {showAddSkill && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3">Ajouter une compétence</h3>
                <div className="space-y-3">
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner une compétence</option>
                    {availableSkills.filter(s => !profile.skills.includes(s)).map((skill, i) => (
                      <option key={i} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddSkill(false)}
                      className="flex-1 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddSkill}
                      disabled={!newSkill}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Mes certificats</h3>
                <button
                  onClick={() => setShowAddCertificate(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-3">
                {profile.certificates.map((cert) => (
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

            {showAddCertificate && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3">Ajouter un certificat</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nom du certificat"
                    value={newCertificate.name}
                    onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Organisme émetteur"
                    value={newCertificate.issuer}
                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="date"
                    value={newCertificate.date}
                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">Photo du certificat</p>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddCertificate(false)}
                      className="flex-1 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddCertificate}
                      disabled={!newCertificate.name || !newCertificate.issuer || !newCertificate.date}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Mes produits</h3>
                <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
                <p className="text-xs text-blue-700">
                  💡 Les prix affichés ici sont vos prix d'achat. Les clients verront vos prix de vente avec votre marge.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: '1', name: 'Huile Total 5W-30', buyPrice: 210, sellPrice: 280, stock: 45 },
                  { id: '2', name: 'Batterie Bosch 60Ah', buyPrice: 650, sellPrice: 850, stock: 12 },
                  { id: '3', name: 'Filtre à huile Mann', buyPrice: 35, sellPrice: 65, stock: 100 },
                ].map((product) => (
                  <div key={product.id} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800 text-sm">{product.name}</h4>
                      <button className="p-1 hover:bg-slate-200 rounded">
                        <Edit className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Prix achat</p>
                        <p className="font-medium text-slate-800">{product.buyPrice} MAD</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Prix vente</p>
                        <p className="font-medium text-emerald-600">{product.sellPrice} MAD</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Stock</p>
                        <p className="font-medium text-slate-800">{product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            {/* Current Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Plan actuel
                </h3>
                <span className="text-sm font-bold text-blue-600">Starter</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Commission</span>
                  <span className="font-medium text-slate-800">10%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Services débloqués</span>
                  <span className="font-medium text-slate-800">3 / 8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Visibilité</span>
                  <span className="font-medium text-slate-800">Standard</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/mechanic/plans')}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                Gérer mon abonnement
              </button>
            </div>

            {/* Plan Benefits */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3">Avantages de votre plan</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <span className="text-sm text-slate-700">Accès aux demandes basiques</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <span className="text-sm text-slate-700">3 services débloqués</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <span className="text-sm text-slate-700">Profil de base</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <span className="text-sm text-slate-700">Support standard</span>
                </div>
              </div>
            </div>

            {/* Upgrade Info */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Passez au niveau supérieur</p>
                  <p className="text-xs text-amber-700">
                    Débloquez plus de services, réduisez votre commission et augmentez votre visibilité avec un plan Pro ou Expert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
