import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Edit2, Trash2, MessageCircle, ThumbsUp, ThumbsDown,
  Calendar, Wrench, Package, CheckCircle2
} from 'lucide-react';

interface Review {
  id: string;
  type: 'service' | 'product';
  provider: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  helpful: number;
}

export const CustomerReviews: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      type: 'service',
      provider: 'Ahmed Benali',
      rating: 5,
      comment: 'Excellent travail ! Intervention rapide et professionnelle. Je recommande vivement.',
      date: '2024-03-15',
      response: 'Merci beaucoup pour votre avis !',
      helpful: 12,
    },
    {
      id: 'r2',
      type: 'service',
      provider: 'Karim Tazi',
      rating: 4,
      comment: 'Bon travail, mais un peu en retard. Résultat satisfaisant.',
      date: '2024-03-10',
      helpful: 8,
    },
    {
      id: 'r3',
      type: 'product',
      provider: 'AutoPièces Maroc',
      rating: 5,
      comment: 'Produits de qualité et livraison rapide. Service client excellent.',
      date: '2024-03-05',
      response: 'Merci pour votre confiance !',
      helpful: 15,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'service' | 'product'>('all');

  const filteredReviews = reviews.filter(r => filter === 'all' || r.type === filter);

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Mes Avis</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <Star className="w-5 h-5 text-amber-600 mx-auto mb-1 fill-amber-600" />
            <p className="text-xs text-slate-600">Note moyenne</p>
            <p className="text-sm font-bold text-amber-600">{averageRating.toFixed(1)}/5</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">Total avis</p>
            <p className="text-sm font-bold text-blue-600">{reviews.length}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <ThumbsUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">Utile pour</p>
            <p className="text-sm font-bold text-emerald-600">{reviews.reduce((sum, r) => sum + r.helpful, 0)}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'service', label: 'Services' },
            { id: 'product', label: 'Produits' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    review.type === 'service' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {review.type === 'service' ? (
                      <Wrench className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Package className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{review.provider}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                    <Edit2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer cet avis ?')) {
                        setReviews(reviews.filter(r => r.id !== review.id));
                      }
                    }}
                    className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-3">{review.comment}</p>

              {review.response && (
                <div className="bg-slate-50 rounded-xl p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-emerald-700 mb-1">Réponse du professionnel</p>
                      <p className="text-xs text-slate-600">{review.response}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{review.helpful} personnes ont trouvé cet avis utile</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Aucun avis trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};
