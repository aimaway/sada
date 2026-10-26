import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Award, Shield, Share2, Camera, Video, MessageCircle, Phone, Heart, Flag, ChevronRight, Search } from 'lucide-react';

// Mock data for demo - In production, this would come from the backend
const mockProviders = {
  mechanics: [
    {
      id: 'm1',
      slug: 'ahmed-benali',
      type: 'mechanic',
      name: 'Ahmed Benali',
      avatar: '👨‍🔧',
      cover: null,
      verified: true,
      badges: ['verified', 'top_rated', 'fast_response'],
      bio: 'Mécanicien expert avec 15 ans d\'expérience. Spécialisé dans toutes marques.',
      rating: 4.9,
      reviewCount: 234,
      jobsCompleted: 3000,
      responseTime: 2,
      completionRate: 100,
      yearsExperience: 15,
      city: 'Casablanca',
      serviceZone: 'Casablanca (25 km)',
      lat: 33.5731,
      lng: -7.5898,
      isOnline: true,
      languages: ['Darija', 'Français', 'العربية', 'English'],
      specialties: ['Toutes marques', 'Diagnostic avancé', 'Système électrique', 'Moteur'],
      brands: ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Dacia', 'Renault'],
      vehicleTypes: ['car', 'motorcycle', 'van'],
      services: [
        { id: 's1', name: 'Diagnostic complet', price: 150, unit: 'MAD' },
        { id: 's2', name: 'Vidange', price: 250, unit: 'MAD' },
        { id: 's3', name: 'Freins', price: 400, unit: 'MAD' },
      ],
      certificates: ['Certification BMW', 'Formation Bosch', 'Expert Diagnostic'],
      equipment: ['Scanner OBD', 'Outils spécialisés', 'Diagnostic électronique'],
      warranty: '60 jours sur toutes les interventions',
      gallery: [
        { type: 'before', label: 'Avant réparation' },
        { type: 'after', label: 'Après réparation' },
      ],
      videos: [
        { url: 'https://youtube.com/watch?v=example1', title: 'Diagnostic moteur' },
      ],
      reviews: [
        { id: 'r1', customer: 'Amine K.', rating: 5, comment: 'Excellent travail !', date: '2024-03-10', photos: [] },
        { id: 'r2', customer: 'Sara M.', rating: 5, comment: 'Très professionnel.', date: '2024-03-05', photos: [] },
      ],
      memberSince: '2019-01-10',
      isFavorite: false,
      isDemo: false,
    },
  ],
  tuners: [
    {
      id: 't1',
      slug: 'speed-tuning-casa',
      type: 'tuner',
      name: 'Speed Tuning Casa',
      avatar: '🏎️',
      cover: null,
      verified: true,
      badges: ['verified', 'top_rated'],
      bio: 'Spécialiste du tuning automobile à Casablanca. Stage 1 à Stage 3.',
      rating: 4.9,
      reviewCount: 89,
      jobsCompleted: 1500,
      responseTime: 3,
      completionRate: 99,
      yearsExperience: 12,
      city: 'Casablanca',
      serviceZone: 'Casablanca (30 km)',
      lat: 33.5800,
      lng: -7.6000,
      isOnline: true,
      languages: ['Darija', 'Français'],
      specialties: ['Stage 1', 'Stage 2', 'Stage 3', 'ECU Remapping'],
      brands: ['Volkswagen', 'Renault', 'Peugeot', 'BMW'],
      vehicleTypes: ['car'],
      tiers: [
        { level: 1, name: 'Stage 1', description: '+10-15% puissance', priceRange: '2000-4000 MAD' },
        { level: 2, name: 'Stage 2', description: '+20-30% puissance', priceRange: '5000-8000 MAD' },
        { level: 3, name: 'Stage 3', description: '+40-60% puissance', priceRange: '10000-20000 MAD' },
      ],
      equipment: ['Dyno', 'ECU Tools', 'Banc de puissance'],
      gallery: [
        { type: 'before', vehicle: 'Golf GTI', label: 'Avant Stage 2' },
        { type: 'after', vehicle: 'Golf GTI', label: 'Après Stage 2 (+35%)' },
      ],
      videos: [
        { url: 'https://youtube.com/watch?v=example1', title: 'Préparation Golf GTI' },
      ],
      reviews: [
        { id: 'r1', customer: 'Mohamed K.', rating: 5, vehicle: 'Golf GTI', comment: 'Excellent travail !', date: '2024-03-10' },
      ],
      memberSince: '2020-06-15',
      isFavorite: false,
      isDemo: false,
    },
  ],
  sellers: [
    {
      id: 's1',
      slug: 'autopieces-maroc',
      type: 'seller',
      name: 'AutoPièces Maroc',
      avatar: '🏪',
      cover: null,
      verified: true,
      badges: ['verified', 'top_seller'],
      bio: 'Votre spécialiste en pièces détachées automobile à Casablanca.',
      rating: 5.0,
      reviewCount: 234,
      totalSales: 2000,
      responseTime: 5,
      yearsActive: 5,
      city: 'Casablanca',
      address: 'Bd Mohammed V, Casablanca',
      deliveryZone: 'Casablanca (20 km)',
      deliveryFee: 0,
      freeDeliveryAbove: 300,
      deliveryTime: '2-4 heures',
      lat: 33.5731,
      lng: -7.5898,
      isOnline: true,
      languages: ['Darija', 'Français', 'العربية'],
      categories: ['Huiles', 'Batteries', 'Filtres', 'Freins', 'Pneus'],
      products: [
        { id: 'p1', name: 'Huile Total 5W-30', price: 280, stock: 45, category: 'Huiles', popular: true },
        { id: 'p2', name: 'Batterie Bosch 60Ah', price: 850, stock: 12, category: 'Batteries', popular: true },
      ],
      returnPolicy: 'Retour sous 7 jours si produit défectueux',
      reviews: [
        { id: 'r1', customer: 'Amine K.', rating: 5, comment: 'Produits de qualité !', date: '2024-03-10' },
      ],
      memberSince: '2019-05-20',
      isFavorite: false,
      isDemo: false,
    },
  ],
};

export const ProviderDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mechanics' | 'tuners' | 'sellers'>('mechanics');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    verifiedOnly: true,
    onlineOnly: false,
    minRating: 0,
  });

  const providers = mockProviders[activeTab];

  const filteredProviders = providers.filter((provider) => {
    if (searchQuery && !provider.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.verifiedOnly && !provider.verified) {
      return false;
    }
    if (filters.onlineOnly && !provider.isOnline) {
      return false;
    }
    if (provider.rating < filters.minRating) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Découvrir</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un provider..."
            className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'mechanics', label: 'Mécaniciens', count: mockProviders.mechanics.length },
            { id: 'tuners', label: 'Tuners', count: mockProviders.tuners.length },
            { id: 'sellers', label: 'Vendeurs', count: mockProviders.sellers.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              filters.verifiedOnly ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            ✓ Vérifiés
          </button>
          <button
            onClick={() => setFilters({ ...filters, onlineOnly: !filters.onlineOnly })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              filters.onlineOnly ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            🟢 En ligne
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-slate-100 text-slate-600"
          >
            {viewMode === 'list' ? '🗺️ Carte' : '📋 Liste'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onClick={() => navigate(`/${provider.type === 'mechanic' ? 'm' : provider.type === 'tuner' ? 't' : 's'}/${provider.slug}`)} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-slate-500">Vue carte (à implémenter avec React Native Maps)</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProviderCard: React.FC<{ provider: any; onClick: () => void }> = ({ provider, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="text-4xl">{provider.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800">{provider.name}</h3>
            {provider.verified && <Shield className="w-4 h-4 text-emerald-600" />}
            {provider.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{provider.rating} ({provider.reviewCount} avis)</span>
            <span>•</span>
            <span>{provider.jobsCompleted} jobs</span>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{provider.bio}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <MapPin className="w-3 h-3" />
            <span>{provider.city}</span>
            <span>•</span>
            <Clock className="w-3 h-3" />
            <span>{provider.responseTime} min</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
};
