import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Package, Users, Shield, Share2, Award, TrendingUp } from 'lucide-react';

export const SellerPublicProfile: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'partners' | 'reviews'>('about');

  const sellerProfile = {
    slug: 'autopieces-maroc',
    name: 'AutoPièces Maroc',
    logo: '🏪',
    description: 'Votre spécialiste en pièces détachées automobile à Casablanca. Large stock, prix compétitifs, livraison rapide.',
    rating: 4.7,
    totalReviews: 234,
    totalSales: 1250,
    totalProducts: 342,
    yearsActive: 5,
    verified: true,
    partneredMechanics: 12,
    partneredTuners: 3,
    categories: ['Huiles', 'Batteries', 'Filtres', 'Freins', 'Pneus', 'Accessoires'],
    services: ['Livraison à domicile', 'Conseil technique', 'Installation partenaire', 'Garantie produit'],
    products: [
      { id: '1', name: 'Huile Total 5W-30 5L', price: 280, stock: 45, category: 'Huiles', popular: true },
      { id: '2', name: 'Batterie Bosch 60Ah', price: 850, stock: 12, category: 'Batteries', popular: true },
      { id: '3', name: 'Filtre à huile Mann', price: 65, stock: 100, category: 'Filtres', popular: false },
      { id: '4', name: 'Plaquettes frein Brembo', price: 320, stock: 20, category: 'Freins', popular: false },
    ],
    partners: [
      { id: '1', name: 'Ahmed Benali', type: 'mechanic', rating: 4.8, jobs: 145 },
      { id: '2', name: 'Youssef El Amrani', type: 'mechanic', rating: 4.5, jobs: 89 },
      { id: '3', name: 'Speed Tuning Casa', type: 'tuner', rating: 4.9, jobs: 156 },
    ],
    reviews: [
      { id: '1', customer: 'Amine K.', rating: 5, comment: 'Produits de qualité et livraison rapide. Je recommande !', date: '2024-03-10' },
      { id: '2', customer: 'Sara M.', rating: 5, comment: 'Excellent service client. Prix compétitifs.', date: '2024-03-05' },
    ],
  };

  const handleShare = () => {
    const shareUrl = `https://mecacasablanca.ma/seller/${slug}`;
    if (navigator.share) {
      navigator.share({ title: sellerProfile.name, text: sellerProfile.description, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié !');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button onClick={handleShare} className="p-2 bg-white/20 rounded-full">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-6xl">{sellerProfile.logo}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{sellerProfile.name}</h1>
              {sellerProfile.verified && <Shield className="w-5 h-5 text-white" />}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>{sellerProfile.rating} ({sellerProfile.totalReviews} avis)</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
              <Award className="w-4 h-4" />
              <span>{sellerProfile.yearsActive} ans d'activité</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{sellerProfile.totalSales}</p>
            <p className="text-xs opacity-90">Ventes</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{sellerProfile.totalProducts}</p>
            <p className="text-xs opacity-90">Produits</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{sellerProfile.partneredMechanics}</p>
            <p className="text-xs opacity-90">Partenaires</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {['about', 'products', 'partners', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'about' && 'À propos'}
              {tab === 'products' && 'Produits'}
              {tab === 'partners' && 'Partenaires'}
              {tab === 'reviews' && 'Avis'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
              <p className="text-sm text-slate-600">{sellerProfile.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                {sellerProfile.categories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Services</h3>
              <div className="space-y-2">
                {sellerProfile.services.map((service, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Produits populaires</h3>
              <span className="text-sm text-slate-500">{sellerProfile.totalProducts} produits</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {sellerProfile.products.map((product) => (
                <div key={product.id} className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="aspect-square bg-slate-100 rounded-lg mb-2 flex items-center justify-center">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  {product.popular && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mb-2 inline-block">
                      ⭐ Populaire
                    </span>
                  )}
                  <h4 className="font-medium text-slate-800 text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">{product.price} MAD</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      product.stock > 20 ? 'bg-green-100 text-green-700' :
                      product.stock > 5 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock} en stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Mécaniciens partenaires</h3>
              <div className="space-y-2">
                {sellerProfile.partners.filter(p => p.type === 'mechanic').map((partner) => (
                  <div key={partner.id} className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        🔧
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{partner.name}</p>
                          <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-slate-600">{partner.rating}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{partner.jobs} jobs</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/m/${partner.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Tuners partenaires</h3>
              <div className="space-y-2">
                {sellerProfile.partners.filter(p => p.type === 'tuner').map((partner) => (
                  <div key={partner.id} className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                        🏎️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{partner.name}</p>
                          <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-slate-600">{partner.rating}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{partner.jobs} préparations</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/tuner/${partner.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-purple-800">Réseau de confiance</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Ce vendeur travaille avec {sellerProfile.partneredMechanics} mécaniciens et {sellerProfile.partneredTuners} tuners vérifiés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Avis clients</h3>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-slate-800">{sellerProfile.rating}</span>
                <span className="text-sm text-slate-500">({sellerProfile.totalReviews})</span>
              </div>
            </div>

            <div className="space-y-3">
              {sellerProfile.reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{review.customer}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <button
          onClick={() => navigate('/customer/shop?seller=' + slug)}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700"
        >
          Voir tous les produits
        </button>
      </div>
    </div>
  );
};
