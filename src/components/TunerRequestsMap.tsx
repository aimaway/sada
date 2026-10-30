import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Filter, List, Map as MapIcon, Navigation, Clock, DollarSign, Star } from 'lucide-react';

// Mock data for demo
const mockRequests = [
  {
    id: 'req1',
    client: 'Mohamed K.',
    vehicle: 'Golf GTI 2019',
    stage: 'Stage 2',
    budget: '5000-8000 MAD',
    distance: 2.3,
    urgency: 'normal',
    description: 'Reprogrammation ECU + échappement sport',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'req2',
    client: 'Youssef B.',
    vehicle: 'Clio RS 2018',
    stage: 'Stage 1',
    budget: '2000-4000 MAD',
    distance: 1.8,
    urgency: 'urgent',
    description: 'Optimisation de base pour track day ce weekend',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'req3',
    client: 'Karim L.',
    vehicle: 'BMW M3 2020',
    stage: 'Stage 3',
    budget: '10000-20000 MAD',
    distance: 5.2,
    urgency: 'normal',
    description: 'Préparation complète : turbo, freins, suspension',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

export const TunerRequestsMap: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filter, setFilter] = useState<'all' | 'urgent' | 'nearby'>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filteredRequests = mockRequests.filter((req) => {
    if (filter === 'urgent') return req.urgency === 'urgent';
    if (filter === 'nearby') return req.distance <= 3;
    return true;
  });

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return 'À l\'instant';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Demandes à proximité</h1>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
              viewMode === 'map' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Carte
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
              viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
            Liste
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'urgent', label: '🚨 Urgentes' },
            { id: 'nearby', label: '📍 Proches (<3km)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                filter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="relative">
          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-100 to-green-100 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-800 mb-2">Carte interactive</p>
              <p className="text-sm text-slate-600">
                {filteredRequests.length} demande(s) dans votre zone
              </p>
              <p className="text-xs text-slate-500 mt-2">
                (Intégration Google Maps / Mapbox à implémenter)
              </p>
            </div>
          </div>

          {/* Request Markers (simulated) */}
          <div className="absolute top-20 left-20 bg-white rounded-full p-2 shadow-lg border-2 border-red-600 cursor-pointer hover:scale-110 transition-transform">
            <div className="text-xs font-bold text-red-600">1</div>
          </div>
          <div className="absolute top-40 right-32 bg-white rounded-full p-2 shadow-lg border-2 border-orange-600 cursor-pointer hover:scale-110 transition-transform">
            <div className="text-xs font-bold text-orange-600">2</div>
          </div>
          <div className="absolute bottom-32 left-1/2 bg-white rounded-full p-2 shadow-lg border-2 border-slate-600 cursor-pointer hover:scale-110 transition-transform">
            <div className="text-xs font-bold text-slate-600">3</div>
          </div>

          {/* Your Location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
              className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                selectedRequest === request.id
                  ? 'border-red-500 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">🏎️</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">{request.client}</h3>
                    {request.urgency === 'urgent' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{request.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{getTimeAgo(request.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-red-600" />
                  <span className="text-slate-700">{request.stage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700">{request.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-700">{request.distance} km</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-3">{request.description}</p>

              {selectedRequest === request.id && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast(`Demande envoyée à ${request.client} !`);
                    }}
                    className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
                  >
                    Envoyer une offre
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customer/chat/${request.id}`);
                    }}
                    className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200"
                  >
                    Contacter le client
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{filteredRequests.length}</p>
            <p className="text-xs text-slate-500">Demandes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {filteredRequests.filter(r => r.urgency === 'urgent').length}
            </p>
            <p className="text-xs text-slate-500">Urgentes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {(filteredRequests.reduce((sum, r) => sum + r.distance, 0) / filteredRequests.length).toFixed(1)} km
            </p>
            <p className="text-xs text-slate-500">Distance moy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
