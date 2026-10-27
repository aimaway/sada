import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import {
  ArrowLeft, Globe, CheckCircle2, Save
} from 'lucide-react';

export const CustomerLanguage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languages = [
    {
      id: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      description: 'Langue principale',
    },
    {
      id: 'ar',
      name: 'Arabe',
      nativeName: 'العربية',
      flag: '🇲🇦',
      description: 'Langue nationale',
    },
    {
      id: 'en',
      name: 'Anglais',
      nativeName: 'English',
      flag: '🇬🇧',
      description: 'Pour les touristes et MRE',
    },
  ];

  const handleSave = () => {
    setLanguage(selectedLanguage);
    alert('Langue mise à jour !');
    navigate('/customer/profile');
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
              <h1 className="text-xl font-bold text-slate-800">Langue</h1>
              <p className="text-xs text-slate-500">Choisissez votre langue préférée</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Languages List */}
        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id as any)}
              className={`w-full bg-white rounded-2xl p-4 border-2 transition-all text-left ${
                selectedLanguage === lang.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{lang.flag}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">{lang.name}</h3>
                    <span className="text-sm text-slate-500">({lang.nativeName})</span>
                  </div>
                  <p className="text-sm text-slate-600">{lang.description}</p>
                </div>
                {selectedLanguage === lang.id && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">À propos des langues</p>
              <p className="text-xs text-blue-700 mt-1">
                La langue sélectionnée sera utilisée pour toute l'interface de l'application. 
                Vous pouvez la modifier à tout moment dans les paramètres.
              </p>
            </div>
          </div>
        </div>

        {/* Current Language */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Langue actuelle</h3>
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {languages.find(l => l.id === language)?.flag}
            </div>
            <div>
              <p className="font-medium text-slate-800">
                {languages.find(l => l.id === language)?.name}
              </p>
              <p className="text-sm text-slate-500">
                {languages.find(l => l.id === language)?.nativeName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
