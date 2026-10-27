import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Save, CheckCircle2 } from 'lucide-react';

export const MechanicServiceArea: React.FC = () => {
  const navigate = useNavigate();
  
  const [serviceArea, setServiceArea] = useState({
    radius: 25,
    workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    startTime: '08:00',
    endTime: '20:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    isAvailableNow: true,
    acceptsUrgentJobs: true,
    acceptsScheduledJobs: true,
  });

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const handleToggleDay = (day: string) => {
    if (serviceArea.workingDays.includes(day)) {
      setServiceArea({
        ...serviceArea,
        workingDays: serviceArea.workingDays.filter(d => d !== day),
      });
    } else {
      setServiceArea({
        ...serviceArea,
        workingDays: [...serviceArea.workingDays, day],
      });
    }
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
              <h1 className="text-xl font-bold text-slate-800">Zone de service & Horaires</h1>
              <p className="text-xs text-slate-500">Configurez votre disponibilité</p>
            </div>
          </div>
          <button
            onClick={() => {
              alert('Zone de service mise à jour !');
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
        {/* Service Radius */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Rayon de service
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="50"
                value={serviceArea.radius}
                onChange={(e) => setServiceArea({ ...serviceArea, radius: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-lg font-bold text-slate-800 w-16 text-center">
                {serviceArea.radius} km
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Les clients dans un rayon de {serviceArea.radius} km autour de votre position verront vos offres.
            </p>
          </div>
        </div>

        {/* Map Preview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Aperçu de la zone</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Zone de service</p>
              <p className="text-xs text-slate-500 mt-1">Rayon de {serviceArea.radius} km</p>
              <p className="text-xs text-slate-400 mt-2">(Carte interactive à venir)</p>
            </div>
          </div>
        </div>

        {/* Working Days */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Jours de travail
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => handleToggleDay(day)}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  serviceArea.workingDays.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Horaires de travail
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Début</label>
              <input
                type="time"
                value={serviceArea.startTime}
                onChange={(e) => setServiceArea({ ...serviceArea, startTime: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Fin</label>
              <input
                type="time"
                value={serviceArea.endTime}
                onChange={(e) => setServiceArea({ ...serviceArea, endTime: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Break Time */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Pause déjeuner</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Début</label>
              <input
                type="time"
                value={serviceArea.breakStart}
                onChange={(e) => setServiceArea({ ...serviceArea, breakStart: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Fin</label>
              <input
                type="time"
                value={serviceArea.breakEnd}
                onChange={(e) => setServiceArea({ ...serviceArea, breakEnd: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Availability Options */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Options de disponibilité</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Disponible maintenant</p>
                <p className="text-xs text-slate-500">Les clients voient que vous êtes en ligne</p>
              </div>
              <button
                onClick={() => setServiceArea({ ...serviceArea, isAvailableNow: !serviceArea.isAvailableNow })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  serviceArea.isAvailableNow ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    serviceArea.isAvailableNow ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Accepter les urgences</p>
                <p className="text-xs text-slate-500">Interventions immédiates</p>
              </div>
              <button
                onClick={() => setServiceArea({ ...serviceArea, acceptsUrgentJobs: !serviceArea.acceptsUrgentJobs })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  serviceArea.acceptsUrgentJobs ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    serviceArea.acceptsUrgentJobs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">Accepter les rendez-vous</p>
                <p className="text-xs text-slate-500">Interventions planifiées</p>
              </div>
              <button
                onClick={() => setServiceArea({ ...serviceArea, acceptsScheduledJobs: !serviceArea.acceptsScheduledJobs })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  serviceArea.acceptsScheduledJobs ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    serviceArea.acceptsScheduledJobs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Conseil</p>
              <p className="text-xs text-blue-700 mt-1">
                Une zone de service plus large augmente vos chances de recevoir des demandes, mais réduit votre temps de réponse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
