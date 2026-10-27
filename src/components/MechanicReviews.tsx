import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MessageCircle, ThumbsUp, ThumbsDown, Calendar,
  Wrench, CheckCircle2, TrendingUp
} from 'lucide-react';

export const MechanicReviews: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const reviews = [
    {
      id: 'r1',
      customer: 'Amine K.',
      rating: 5,
      comment: 'Excellent travail ! Intervention rapide et professionnelle. Je recommande vivement.',
      date: '2024-03-15',
      service: 'Vidange',
      helpful: 12,
      responded: true,
    },
    {
      id: 'r2',
      customer: 'Sara M.',
      rating: 5,
      comment: 'Très satisfait. Prix juste et travail de qualité.',
      date: '2024-03-10',
      service: 'Freins',
      helpful: 8,
      responded: true,
    },
    {
      id: 'r3',
      customer: 'Youssef R.',
      rating: 4,
      comment: 'Bon travail, mais un peu en retard. Résultat satisfaisant.',
      date: '2024-03-05',
      service: 'Diagnostic',
      helpful: 5,
      responded: false,
    },
    {
      id: 'r4',
      customer: 'Fatima Z.',
      rating: 5,
      comment: 'Parfait ! Mécanicien très compétent et agréable.',
      date: '2024-02-28',
      service: 'Batterie',
      helpful: 15,
      responded: true,
    },
  ];

  const filteredReviews = reviews.filter(r => {
    if (filter === 'all') return true;
    return r.rating === parseInt(filter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.rating - a.rating;
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100,
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/mechanic/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Avis clients</h1>
            <p className="text-xs text-slate-500">{reviews.length} avis au total</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Rating Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-800">{averageRating.toFixed(1)}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">{reviews.length} avis</p>
            </div>
            <div className="flex-1 space-y-1">
              {ratingDistribution.map((dist) => (
                <div key={dist.rating} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-4">{dist.rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8">{dist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex gap-2 mb-3">
            {[
              { id: 'all', label: 'Tous' },
              { id: '5', label: '5★' },
              { id: '4', label: '4★' },
              { id: '3', label: '3★' },
              { id: '2', label: '2★' },
              { id: '1', label: '1★' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                  filter === f.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                sortBy === 'recent' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Plus récents
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                sortBy === 'rating' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Meilleures notes
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-800">{review.customer}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <Wrench className="w-3 h-3" />
                    <span>{review.service}</span>
                  </div>
                </div>
                {review.responded && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    ✓ Répondu
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-700 mb-3">{review.comment}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{review.helpful} personnes ont trouvé cet avis utile</span>
                </div>
                {!review.responded && (
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700">
                    Répondre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Performance des avis</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-xs text-blue-700">Note moyenne</p>
                  <p className="text-lg font-bold text-blue-900">{averageRating.toFixed(1)}/5</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Taux de réponse</p>
                  <p className="text-lg font-bold text-blue-900">
                    {Math.round((reviews.filter(r => r.responded).length / reviews.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
