import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import {
  ArrowLeft, User, Phone, Mail, MapPin, Clock, Save, Upload, CheckCircle2
} from 'lucide-react';

export const MechanicPersonalInfo: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useApp();

  const [profile, setProfile] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    email: 'ahmed.benali@email.com',
    bio: 'Mécanicien certifié avec 8 ans d\'expérience. Spécialisé dans les véhicules européens et japonais.',
    address: 'Bd Mohammed V, Casablanca',
    city: 'Casablanca',
    yearsExperience: 8,
    languages: ['Darija', 'Français', 'العربية'],
    profileImage: null,
  });

  const handleSave = () => {
    toast('Profil mis à jour avec succès !');
    navigate('/mechanic/profile');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mechanic/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Informations personnelles</h1>
              <p className="text-xs text-slate-500">Modifiez vos informations</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Profile Image */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Photo de profil</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl">
                👨‍🔧
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Upload className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-2">
                Une photo professionnelle augmente la confiance des clients
              </p>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                Changer la photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Informations de base</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Nom complet</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Bio professionnelle</h3>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Décrivez votre expérience, vos spécialités, votre approche..."
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            rows={4}
          />
          <p className="text-xs text-slate-500 mt-2">
            {profile.bio.length}/500 caractères
          </p>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Localisation</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Adresse de l'atelier</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Ville</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Expérience</h3>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Années d'expérience</label>
            <input
              type="number"
              value={profile.yearsExperience}
              onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })}
              min="0"
              max="50"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Langues parlées</h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {lang}
              </span>
            ))}
          </div>
          <button className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700">
            + Ajouter une langue
          </button>
        </div>

        {/* Verification Status */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Profil vérifié</p>
              <p className="text-xs text-emerald-700 mt-1">
                Votre identité a été vérifiée. Les clients voient un badge de vérification sur votre profil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
