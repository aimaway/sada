import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Upload, CheckCircle } from 'lucide-react';
import { useApp } from '../shared/context';

export const TunerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    description: '',
    address: '',
    city: 'Casablanca',
    yearsExperience: '',
    specialties: [] as string[],
    certifications: [] as string[],
    logo: null as File | null,
    gallery: [] as File[],
  });

  const specialties = [
    'Stage 1',
    'Stage 2',
    'Stage 3',
    'Reprogrammation ECU',
    'Échappement sport',
    'Admission',
    'Suspension',
    'Freinage sport',
  ];

  const certifications = [
    'Stage 1 Certified',
    'Stage 2 Specialist',
    'Stage 3 Expert',
    'ECU Remapping',
    'Dyno Testing',
  ];

  const handleSubmit = () => {
    // Simulate backend registration
    const tunerId = `tuner_${Date.now()}`;
    
    setUser({
      id: tunerId,
      phone: formData.phone,
      role: 'tuner',
      full_name: formData.ownerName,
      status: 'active',
      language: 'fr',
      created_at: new Date().toISOString(),
    });

    // In production, save to backend
    console.log('Tuner registered:', { ...formData, id: tunerId });

    navigate('/tuner/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Inscription Tuner</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Informations de base</h2>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Nom de votre société *
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="Ex: Speed Tuning Casa"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Votre nom complet *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Ex: Youssef El Mansouri"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+212 6XX XXX XXX"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Mot de passe *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.shopName || !formData.ownerName || !formData.phone || !formData.email || !formData.password}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Informations professionnelles</h2>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Description de votre société *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre activité, vos spécialités, votre expérience..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Adresse de l'atelier *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ex: Quartier Industriel, Casablanca"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Années d'expérience *
              </label>
              <input
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                placeholder="Ex: 12"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.description || !formData.address || !formData.yearsExperience}
                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Specialties & Certifications */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Spécialités & Certifications</h2>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Spécialités proposées *
              </label>
              <div className="flex flex-wrap gap-2">
                {specialties.map((spec) => {
                  const isSelected = formData.specialties.includes(spec);
                  return (
                    <button
                      key={spec}
                      onClick={() => {
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            specialties: formData.specialties.filter((s) => s !== spec),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            specialties: [...formData.specialties, spec],
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => {
                  const isSelected = formData.certifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      onClick={() => {
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            certifications: formData.certifications.filter((c) => c !== cert),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            certifications: [...formData.certifications, cert],
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={formData.specialties.length === 0}
                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Media Upload */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Logo & Galerie</h2>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Logo de votre société
              </label>
              <button className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-900 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Uploader un logo</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG jusqu'à 5MB</p>
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Galerie de vos réalisations
              </label>
              <button className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-900 transition-colors">
                <Car className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Uploader des photos/vidéos</p>
                <p className="text-xs text-slate-500 mt-1">Avant/Après vos préparations</p>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Prêt à rejoindre TomoBily !
                  </p>
                  <p className="text-xs text-blue-700">
                    Votre profil sera examiné par notre équipe sous 24-48h. Vous recevrez une notification une fois approuvé.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
