import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Plus, X, Save, CheckCircle2 } from 'lucide-react';

export const MechanicServices: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([
    { id: '1', name: 'Batterie', enabled: true, unlockedByPlan: false },
    { id: '2', name: 'Vidange', enabled: true, unlockedByPlan: false },
    { id: '3', name: 'Freins', enabled: true, unlockedByPlan: false },
    { id: '4', name: 'Pneus', enabled: false, unlockedByPlan: true },
    { id: '5', name: 'Climatisation', enabled: false, unlockedByPlan: true },
    { id: '6', name: 'Diagnostic', enabled: true, unlockedByPlan: false },
    { id: '7', name: 'Électricité', enabled: false, unlockedByPlan: true },
    { id: '8', name: 'Mécanique générale', enabled: true, unlockedByPlan: false },
  ]);

  const [skills, setSkills] = useState([
    'Diagnostic électronique',
    'Système de freinage',
    'Climatisation',
    'Système électrique',
    'Transmission',
  ]);

  const [specialties, setSpecialties] = useState([
    'Toyota',
    'Dacia',
    'Renault',
  ]);

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
    'Système de refroidissement',
    'Système de lubrification',
  ];

  const availableSpecialties = [
    'Toyota', 'Dacia', 'Renault', 'Peugeot', 'Citroën', 'Volkswagen',
    'BMW', 'Mercedes', 'Audi', 'Ford', 'Hyundai', 'Kia',
    'Nissan', 'Mazda', 'Fiat', 'Opel',
  ];

  const [newSkill, setNewSkill] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleToggleCategory = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
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
              <h1 className="text-xl font-bold text-slate-800">Services & Compétences</h1>
              <p className="text-xs text-slate-500">Gérez vos services proposés</p>
            </div>
          </div>
          <button
            onClick={() => {
              toast('Services mis à jour !');
              navigate('/mechanic/profile');
            }}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Service Categories */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Catégories de services
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Activez les services que vous proposez. Certains services nécessitent un plan Pro ou Expert.
          </p>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleCategory(category.id)}
                    disabled={category.unlockedByPlan && !category.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      category.enabled ? 'bg-blue-600' : 'bg-slate-300'
                    } ${category.unlockedByPlan && !category.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        category.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-slate-800">{category.name}</span>
                </div>
                {category.unlockedByPlan && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    🔒 Plan Pro
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Compétences techniques</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full flex items-center gap-1">
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Sélectionner une compétence</option>
              {availableSkills.filter(s => !skills.includes(s)).map((skill, i) => (
                <option key={i} value={skill}>{skill}</option>
              ))}
            </select>
            <button
              onClick={handleAddSkill}
              disabled={!newSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Marques spécialisées</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {specialties.map((specialty, i) => (
              <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full flex items-center gap-1">
                {specialty}
                <button onClick={() => handleRemoveSpecialty(specialty)} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              className="flex-1 p-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Sélectionner une marque</option>
              {availableSpecialties.filter(s => !specialties.includes(s)).map((specialty, i) => (
                <option key={i} value={specialty}>{specialty}</option>
              ))}
            </select>
            <button
              onClick={handleAddSpecialty}
              disabled={!newSpecialty}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Conseil</p>
              <p className="text-xs text-blue-700 mt-1">
                Plus vous avez de compétences et de spécialités, plus vous aurez de chances d'être choisi par les clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
