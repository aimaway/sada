import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, CheckCircle2, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { IntentTiles } from './IntentTiles';
import {
  SCENARIOS,
  FAMILIES,
  MODES,
  Scenario,
  Field,
  priceBounds,
  priceVerdict,
  VERDICTS,
  getScenariosByFamily,
  getScenarioBySlug,
  getFamilyName,
  getModeLabel,
} from '../data/scenarios';

export const NewRequestEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedScenario = searchParams.get('scenario');
  const preselectedFamily = searchParams.get('family');
  const intent = searchParams.get('intent');

  const [step, setStep] = useState(1);
  const [selectedFamily, setSelectedFamily] = useState<number | null>(
    preselectedFamily ? parseInt(preselectedFamily) : null
  );
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    preselectedScenario ? getScenarioBySlug(preselectedScenario) || null : null
  );
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('Voiture');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const vehicleTypes = ['Voiture', 'Moto', 'Scooter', 'Utilitaire'];

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSelectedFamily(scenario.family);
    setStep(2);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = () => {
    // In production, send to backend
    console.log('Submitting request:', {
      scenario: selectedScenario?.slug,
      family: selectedFamily,
      vehicleType,
      description,
      price,
      formData,
    });
    navigate('/customer/offers');
  };

  const getPriceVerdict = () => {
    if (!selectedScenario || !price) return null;
    const priceNum = parseInt(price);
    const verdict = priceVerdict(priceNum, selectedScenario.price);
    return { verdict, info: VERDICTS[verdict] };
  };

  // Step 1: Family Selection
  if (step === 1 && !selectedFamily) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Nouvelle demande</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Intent Tiles */}
          <IntentTiles />

          {/* Vehicle Type */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Type de véhicule</h2>
            <div className="grid grid-cols-4 gap-3">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    vehicleType === type
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-1">
                    {type === 'Voiture' && '🚗'}
                    {type === 'Moto' && '🏍️'}
                    {type === 'Scooter' && '🛵'}
                    {type === 'Utilitaire' && '🚐'}
                  </div>
                  <p className="text-xs font-medium text-slate-700">{type}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Service Families */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Catégorie de service</h2>
            <div className="grid grid-cols-2 gap-3">
              {FAMILIES.map((family, index) => {
                const scenarios = getScenariosByFamily(index);
                const colors = [
                  'from-red-500 to-red-600',
                  'from-green-500 to-green-600',
                  'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600',
                  'from-orange-500 to-orange-600',
                  'from-pink-500 to-pink-600',
                ];
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedFamily(index)}
                    className={`bg-gradient-to-br ${colors[index]} text-white rounded-2xl p-4 text-left shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                  >
                    <h3 className="font-bold text-lg mb-1">{family}</h3>
                    <p className="text-xs opacity-90">{scenarios.length} services</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1b: Scenario Selection within Family
  if (step === 1 && selectedFamily !== null) {
    const scenarios = getScenariosByFamily(selectedFamily);
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedFamily(null)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">{getFamilyName(selectedFamily)}</h1>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.slug}
                onClick={() => handleScenarioSelect(scenario)}
                className="bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-emerald-500 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{scenario.icon}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>{scenario.price[0]}-{scenario.price[1]} MAD</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{scenario.title}</h3>
                <p className="text-xs text-slate-600 mb-2">{scenario.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    {getModeLabel(scenario.mode)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Scenario Details and Form
  if (step === 2 && selectedScenario) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800">{selectedScenario.title}</h1>
              <p className="text-sm text-slate-600">{selectedScenario.desc}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Scenario Info */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-4xl">{selectedScenario.icon}</div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 mb-1">{selectedScenario.title}</h2>
                <p className="text-sm text-slate-600">{selectedScenario.desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Prix indicatif</p>
                <p className="font-bold text-emerald-600">
                  {selectedScenario.price[0]} - {selectedScenario.price[1]} MAD
                </p>
              </div>
              <div>
                <p className="text-slate-500">Mode</p>
                <p className="font-medium text-slate-800">{getModeLabel(selectedScenario.mode)}</p>
              </div>
              <div>
                <p className="text-slate-500">Véhicules</p>
                <p className="font-medium text-slate-800">{selectedScenario.vehicles.join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-500">Répondants</p>
                <p className="font-medium text-slate-800 text-xs">{selectedScenario.responders}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800">Détails du problème</h3>
            {selectedScenario.fields.map((field, index) => {
              // Handle note fields separately (they don't have a name)
              if (field.type === 'note') {
                return <DynamicField key={index} field={field} value={null} onChange={() => {}} />;
              }
              
              // For other field types, they have a name property
              const fieldWithName = field as Exclude<Field, { type: 'note' }>;
              return (
                <DynamicField
                  key={index}
                  field={field}
                  value={formData[fieldWithName.name]}
                  onChange={(value) => handleFieldChange(fieldWithName.name, value)}
                />
              );
            })}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">Description supplémentaire</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème en détail..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              rows={4}
            />
            <button className="w-full mt-3 p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 transition-colors">
              <Camera className="w-6 h-6 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Ajouter des photos</p>
            </button>
          </div>

          {/* Flow */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Comment ça marche ?
            </h3>
            <ol className="space-y-2">
              {selectedScenario.flow.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Price Proposal
  if (step === 3 && selectedScenario) {
    const verdictData = getPriceVerdict();
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(2)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Proposez votre prix</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Price Input */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600">Prix indicatif</span>
              <span className="text-lg font-bold text-slate-800">
                {selectedScenario.price[0]} - {selectedScenario.price[1]} MAD
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Votre prix"
                className="w-full p-4 pr-16 border-2 border-slate-200 rounded-xl text-2xl font-bold text-center focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                MAD
              </span>
            </div>

            {/* Price Verdict */}
            {verdictData && (
              <div
                className={`mt-4 p-3 rounded-xl border-2 ${
                  verdictData.info.tone === 'ok'
                    ? 'bg-green-50 border-green-200'
                    : verdictData.info.tone === 'warn'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {verdictData.info.tone === 'ok' && <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />}
                  {verdictData.info.tone === 'warn' && <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />}
                  {verdictData.info.tone === 'bad' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        verdictData.info.tone === 'ok'
                          ? 'text-green-800'
                          : verdictData.info.tone === 'warn'
                          ? 'text-amber-800'
                          : 'text-red-800'
                      }`}
                    >
                      {verdictData.info.label}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        verdictData.info.tone === 'ok'
                          ? 'text-green-700'
                          : verdictData.info.tone === 'warn'
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}
                    >
                      {verdictData.info.hint}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Récapitulatif</p>
                <div className="text-xs text-emerald-700 mt-2 space-y-1">
                  <p>• Service: {selectedScenario.title}</p>
                  <p>• Véhicule: {vehicleType}</p>
                  {description && <p>• Description: {description.slice(0, 50)}...</p>}
                  {price && <p>• Prix proposé: {price} MAD</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
            >
              Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={!price}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              Envoyer la demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Dynamic Field Component
const DynamicField: React.FC<{
  field: Field;
  value: any;
  onChange: (value: any) => void;
}> = ({ field, value, onChange }) => {
  if (field.type === 'note') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-sm text-blue-800">{field.text}</p>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">{field.label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Sélectionner...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'chips') {
    const selectedValues: string[] = value || [];
    return (
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">{field.label}</label>
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <button
                key={option}
                onClick={() => {
                  if (isSelected) {
                    onChange(selectedValues.filter((v) => v !== option));
                  } else {
                    onChange([...selectedValues, option]);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === 'text') {
    return (
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
    );
  }

  if (field.type === 'toggle') {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }

  return null;
};
