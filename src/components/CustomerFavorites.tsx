import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockClientData } from '../data/mockDataGlobal';
import {
  ArrowLeft, Heart, Trash2, Star, MapPin, Wrench, Package, Car,
  ChevronRight, X
} from 'lucide-react';

interface Favorite {
  id: string;
  type: 'mechanic' | 'seller' | 'tuner';
  name: string;
  rating: number;
  specialty: string;
  image: string;
}

export const CustomerFavorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([
    {
      id: 'f1',
      type: 'mechanic',
      name: 'Ahmed Benali',
      rating: 4.9,
      specialty: 'Toutes marques',
      image: '👨‍🔧',
    },
    {
      id: 'f2',
      type: 'mechanic',
      name: 'Karim Tazi',
      rating: 4.8,
      specialty: 'Diagnostic',
      image: '👨‍🔧',
    },
    {
      id: 'f3',
      type: 'seller',
      name: 'AutoPièces Maroc',
      rating: 5.0,
      specialty: 'Pièces détachées',
      image: '🏪',
    },
    {
      id: 'f4',
      type: 'tuner',
      name: 'Speed Tuning Casa',
      rating: 4.9,
      specialty: 'Stage 1-3',
      image: '🏎️',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'mechanic' | 'seller' | 'tuner'>('all');

  const filteredFavorites = favorites.filter(f => filter === 'all' || f.type === filter);

  const handleRemove = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mechanic': return <Wrench className="w-4 h-4" />;
      case 'seller': return <Package className="w-4 h-4" />;
      case 'tuner': return <Car className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mechanic': return 'bg-blue-100 text-blue-600';
      case 'seller': return 'bg-purple-100 text-purple-600';
      case 'tuner': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mechanic': return 'Mécanicien';
      case 'seller': return 'Vendeur';
      case 'tuner': return 'Tuner';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Mes Favoris</h1>
            <p className="text-xs text-slate-500">{favorites.length} favori{favorites.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'mechanic', label: 'Mécaniciens' },
            { id: 'seller', label: 'Vendeurs' },
            { id: 'tuner', label: 'Tuners' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                filter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Favorites List */}
        {filteredFavorites.map((favorite) => (
          <div key={favorite.id} className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="text-4xl">{favorite.image}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{favorite.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(favorite.type)}`}>
                    {getTypeIcon(favorite.type)}
                    {getTypeLabel(favorite.type)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-slate-800">{favorite.rating}</span>
                  <span className="text-xs text-slate-500">• {favorite.specialty}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (favorite.type === 'mechanic') {
                        navigate(`/m/${favorite.name.toLowerCase().replace(/\s+/g, '-')}`);
                      } else if (favorite.type === 'seller') {
                        navigate(`/seller/${favorite.name.toLowerCase().replace(/\s+/g, '-')}`);
                      } else {
                        navigate(`/tuner/${favorite.name.toLowerCase().replace(/\s+/g, '-')}`);
                      }
                    }}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium hover:bg-emerald-700 flex items-center justify-center gap-1"
                  >
                    Voir le profil
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleRemove(favorite.id)}
                    className="p-2 bg-red-50 rounded-xl hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredFavorites.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Aucun favori dans cette catégorie</p>
            <button
              onClick={() => navigate('/discover')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Découvrir des professionnels
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-pink-800 mb-1">Vos favoris</p>
              <p className="text-xs text-pink-700">
                {favorites.filter(f => f.type === 'mechanic').length} mécanicien{favorites.filter(f => f.type === 'mechanic').length > 1 ? 's' : ''},{' '}
                {favorites.filter(f => f.type === 'seller').length} vendeur{favorites.filter(f => f.type === 'seller').length > 1 ? 's' : ''},{' '}
                {favorites.filter(f => f.type === 'tuner').length} tuner{favorites.filter(f => f.type === 'tuner').length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
