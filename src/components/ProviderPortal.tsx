import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Power, PowerOff, Filter, Clock, MapPin, DollarSign, MessageCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Mock data for demo - In production, this would come from WebSocket/SSE
const mockLiveRequests = [
  {
    id: 'req1',
    scenario: 'battery',
    icon: '🔋',
    summary: 'Voiture ne démarre pas, batterie à plat',
    vehicleType: 'car',
    vehicleInfo: 'Dacia Logan 2019',
    distance: 2.3,
    proposedPrice: 250,
    verdict: 'fair',
    urgency: 'high',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 60000).toISOString(),
    mediaCount: 2,
  },
  {
    id: 'req2',
    scenario: 'tire',
    icon: '🛞',
    summary: 'Pneu crevé, besoin de remplacement',
    vehicleType: 'car',
    vehicleInfo: 'Peugeot 208 2020',
    distance: 1.8,
    proposedPrice: 350,
    verdict: 'good',
    urgency: 'medium',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 60000).toISOString(),
    mediaCount: 1,
  },
  {
    id: 'req3',
    scenario: 'diagnostic',
    icon: '🔍',
    summary: 'Voyant moteur allumé, diagnostic nécessaire',
    vehicleType: 'car',
    vehicleInfo: 'BMW Serie 3 2018',
    distance: 3.5,
    proposedPrice: 200,
    verdict: 'fair',
    urgency: 'low',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
    mediaCount: 0,
  },
];

export const ProviderPortal: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'jobs' | 'stats'>('live');
  const [requests, setRequests] = useState(mockLiveRequests);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'nearby'>('all');

  // Simulate real-time updates (in production, this would be WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new request arriving
      if (Math.random() > 0.7 && isOnline) {
        const newRequest = {
          id: `req${Date.now()}`,
          scenario: 'oil',
          icon: '🛢️',
          summary: 'Vidange urgente nécessaire',
          vehicleType: 'car',
          vehicleInfo: 'Renault Clio 2021',
          distance: Math.round(Math.random() * 5 * 10) / 10,
          proposedPrice: 300 + Math.floor(Math.random() * 100),
          verdict: ['good', 'fair', 'high'][Math.floor(Math.random() * 3)],
          urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
          mediaCount: Math.floor(Math.random() * 3),
        };
        setRequests((prev) => [newRequest, ...prev]);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  const filteredRequests = requests.filter((req) => {
    if (filter === 'urgent') return req.urgency === 'high';
    if (filter === 'nearby') return req.distance <= 3;
    return true;
  });

  const handleAccept = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    alert('Offre acceptée ! (Simulation)');
  };

  const handleCounterOffer = (requestId: string) => {
    alert('Contre-offre envoyée ! (Simulation)');
  };

  const handleIgnore = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'good': return 'bg-green-100 text-green-700';
      case 'fair': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Portail Provider</h1>
          <button onClick={() => setIsOnline(!isOnline)} className={`p-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}>
            {isOnline ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{requests.length}</p>
            <p className="text-xs opacity-90">Demandes</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs opacity-90">Jobs actifs</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-xs opacity-90">Note</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {[
            { id: 'live', label: 'Demandes live', icon: <Bell className="w-4 h-4" /> },
            { id: 'jobs', label: 'Mes jobs', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'stats', label: 'Statistiques', icon: <Clock className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === 'live' && (
          <div className="space-y-4">
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
                    filter === f.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Online Status */}
            {!isOnline && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Vous êtes hors ligne</p>
                    <p className="text-xs text-amber-700 mt-1">Passez en ligne pour recevoir des demandes</p>
                  </div>
                </div>
              </div>
            )}

            {/* Requests */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Aucune demande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAccept={() => handleAccept(request.id)}
                    onCounterOffer={() => handleCounterOffer(request.id)}
                    onIgnore={() => handleIgnore(request.id)}
                    getVerdictColor={getVerdictColor}
                    getUrgencyColor={getUrgencyColor}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Vos jobs en cours apparaîtront ici</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Vos statistiques apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RequestCard: React.FC<{
  request: any;
  onAccept: () => void;
  onCounterOffer: () => void;
  onIgnore: () => void;
  getVerdictColor: (verdict: string) => string;
  getUrgencyColor: (urgency: string) => string;
}> = ({ request, onAccept, onCounterOffer, onIgnore, getVerdictColor, getUrgencyColor }) => {
  const timeLeft = Math.max(0, Math.floor((new Date(request.expiresAt).getTime() - Date.now()) / 60000));

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl">{request.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800">{request.summary}</h3>
            {request.urgency === 'high' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">URGENT</span>}
          </div>
          <p className="text-sm text-slate-600">{request.vehicleInfo}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div className="flex items-center gap-1 text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{request.distance} km</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600">
          <DollarSign className="w-4 h-4" />
          <span>{request.proposedPrice} MAD</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className={getUrgencyColor(request.urgency)}>{timeLeft} min</span>
        </div>
      </div>

      {/* Verdict Badge */}
      <div className="mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${getVerdictColor(request.verdict)}`}>
          {request.verdict === 'good' && '✓ Bon prix'}
          {request.verdict === 'fair' && '✓ Prix correct'}
          {request.verdict === 'high' && '⚠ Prix élevé'}
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onAccept}
          className="py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
        >
          Accepter
        </button>
        <button
          onClick={onCounterOffer}
          className="py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          Contre-offre
        </button>
        <button
          onClick={onIgnore}
          className="py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200"
        >
          Ignorer
        </button>
      </div>
    </div>
  );
};
