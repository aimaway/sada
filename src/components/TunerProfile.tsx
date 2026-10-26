import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Wrench, Camera, Video, Share2, Shield, Award, Zap } from 'lucide-react';

export const TunerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<'about' | 'stages' | 'gallery' | 'reviews'>('about');

  const tunerProfile = {
    slug: 'speed-tuning-casa',
    name: 'Speed Tuning Casa',
    logo: '🏎️',
    description: 'Spécialiste du tuning automobile à Casablanca. Stage 1 à Stage 3, préparations moteur, échappements sport, et plus encore.',
    rating: 4.9,
    totalReviews: 89,
    totalJobs: 156,
    yearsExperience: 12,
    verified: true,
    certifications: ['Stage 1 Certified', 'Stage 2 Specialist', 'ECU Remapping Expert'],
    stages: [
      {
        level: 1,
        name: 'Stage 1',
        description: 'Optimisation de base - Gain de puissance 10-15%',
        features: ['Reprogrammation ECU', 'Filtre à air sport', 'Échappement sport', 'Bougies haute performance'],
        priceRange: '2000-4000 MAD',
        popular: true,
      },
      {
        level: 2,
        name: 'Stage 2',
        description: 'Préparation intermédiaire - Gain de puissance 20-30%',
        features: ['Tout Stage 1', 'Downpipe sport', 'Intercooler upgrade', 'Injecteurs haute performance'],
        priceRange: '5000-8000 MAD',
        popular: false,
      },
      {
        level: 3,
        name: 'Stage 3',
        description: 'Préparation avancée - Gain de puissance 40-60%',
        features: ['Tout Stage 2', 'Turbo upgrade', 'Fuel pump haute performance', 'Freins upgrade', 'Suspension sport'],
        priceRange: '10000-20000 MAD',
        popular: false,
      },
    ],
    gallery: [
      { id: '1', type: 'before', vehicle: 'Golf GTI', stage: 'Stage 2', label: 'Avant préparation' },
      { id: '2', type: 'after', vehicle: 'Golf GTI', stage: 'Stage 2', label: 'Après Stage 2 (+35% puissance)' },
      { id: '3', type: 'before', vehicle: 'Clio RS', stage: 'Stage 1', label: 'Avant préparation' },
      { id: '4', type: 'after', vehicle: 'Clio RS', stage: 'Stage 1', label: 'Après Stage 1 (+15% puissance)' },
    ],
    videos: [
      { url: 'https://youtube.com/watch?v=example1', title: 'Préparation Golf GTI Stage 2' },
      { url: 'https://youtube.com/watch?v=example2', title: 'Reprogrammation ECU - Tutoriel' },
    ],
    reviews: [
      { id: '1', customer: 'Mohamed K.', rating: 5, vehicle: 'Golf GTI 2019', comment: 'Excellent travail ! Ma voiture est méconnaissable. Gain de puissance incroyable.', date: '2024-03-10' },
      { id: '2', customer: 'Youssef B.', rating: 5, vehicle: 'Clio RS 2018', comment: 'Professionnels et passionnés. Je recommande vivement !', date: '2024-03-05' },
    ],
  };

  const handleShare = () => {
    const shareUrl = `https://mecago.app/tuner/${slug}`;
    if (navigator.share) {
      navigator.share({ title: tunerProfile.name, text: tunerProfile.description, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié !');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button onClick={handleShare} className="p-2 bg-white/20 rounded-full">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-6xl">{tunerProfile.logo}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{tunerProfile.name}</h1>
              {tunerProfile.verified && <Shield className="w-5 h-5 text-white" />}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>{tunerProfile.rating} ({tunerProfile.totalReviews} avis)</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
              <Award className="w-4 h-4" />
              <span>{tunerProfile.yearsExperience} ans d'expérience</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-2 mt-4">
          {tunerProfile.certifications.map((cert, i) => (
            <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{tunerProfile.totalJobs}</p>
            <p className="text-xs text-slate-500">Préparations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">3</p>
            <p className="text-xs text-slate-500">Stages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">4.9</p>
            <p className="text-xs text-slate-500">Note</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {['about', 'stages', 'gallery', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'about' && 'À propos'}
              {tab === 'stages' && 'Stages'}
              {tab === 'gallery' && 'Galerie'}
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
              <p className="text-sm text-slate-600">{tunerProfile.description}</p>
            </div>

            {tunerProfile.videos.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Vidéos</h3>
                <div className="space-y-2">
                  {tunerProfile.videos.map((video, i) => (
                    <a
                      key={i}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100"
                    >
                      <Video className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-slate-700">{video.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Avertissement légal</p>
                  <p className="text-xs text-red-700 mt-1">
                    Les modifications doivent respecter la réglementation routière locale. Certaines préparations peuvent invalider votre assurance ou votre contrôle technique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stages Tab */}
        {activeTab === 'stages' && (
          <div className="space-y-4">
            {tunerProfile.stages.map((stage) => (
              <div key={stage.level} className={`bg-white p-4 rounded-2xl border-2 ${stage.popular ? 'border-red-500' : 'border-slate-200'}`}>
                {stage.popular && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                    ⭐ Populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-800 mb-2">{stage.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{stage.description}</p>
                
                <div className="space-y-2 mb-3">
                  {stage.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-sm text-slate-600">{stage.priceRange}</span>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                    Demander un devis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Avant / Après</h3>
            <div className="grid grid-cols-2 gap-3">
              {tunerProfile.gallery.map((item, i) => (
                <div key={item.id} className="bg-slate-100 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-slate-200 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-slate-800">{item.vehicle}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {item.stage}
                    </span>
                  </div>
                </div>
              ))}
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
                <span className="font-bold text-slate-800">{tunerProfile.rating}</span>
                <span className="text-sm text-slate-500">({tunerProfile.totalReviews})</span>
              </div>
            </div>

            <div className="space-y-3">
              {tunerProfile.reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{review.customer}</p>
                      <p className="text-xs text-slate-500">{review.vehicle}</p>
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
          onClick={() => navigate('/customer/new-request?tuner=' + slug)}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700"
        >
          Demander une préparation
        </button>
      </div>
    </div>
  );
};
