import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Award, Shield, Share2, Camera, Video } from 'lucide-react';

const mockMechanicProfile = {
  slug: 'ahmed-benali',
  name: 'Ahmed Benali',
  photo: '👨‍🔧',
  bio: 'Mécanicien spécialisé Toyota et Dacia avec 8 ans d\'expérience.',
  specialties: ['Toyota', 'Dacia', 'Renault', 'Diagnostic électronique'],
  languages: ['Darija', 'Français', 'العربية'],
  rating: 4.8,
  totalReviews: 145,
  yearsExperience: 8,
  completedJobs: 234,
  responseTime: 3,
  serviceArea: 'Casablanca (15 km)',
  verified: true,
  gallery: [
    { type: 'before', label: 'Avant réparation' },
    { type: 'after', label: 'Après réparation' },
  ],
  videos: [{ url: 'https://youtube.com/watch?v=example1', title: 'Comment je diagnostique une panne' }],
  reviews: [
    { id: 1, customer: 'Amine K.', rating: 5, comment: 'Excellent travail !', date: '2024-03-10' },
    { id: 2, customer: 'Sara M.', rating: 5, comment: 'Super expérience.', date: '2024-03-05' },
  ],
  referralCode: 'MEC-AHMED123',
};

export const MechanicPublicProfile: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState<'about' | 'gallery' | 'reviews'>('about');

  const handleBook = () => {
    navigate(`/customer/new-request?mechanic_id=${mockMechanicProfile.slug}&ref=${mockMechanicProfile.referralCode}`);
  };

  const handleShare = () => {
    const shareUrl = `https://tomobily.app/m/${slug}`;
    if (navigator.share) {
      navigator.share({ title: `${mockMechanicProfile.name} - TomoBily`, text: mockMechanicProfile.bio, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié !');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
          <button onClick={handleShare} className="p-2 bg-white/20 rounded-full"><Share2 className="w-5 h-5" /></button>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-6xl">{mockMechanicProfile.photo}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{mockMechanicProfile.name}</h1>
              {mockMechanicProfile.verified && <Shield className="w-5 h-5 text-emerald-300" />}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>{mockMechanicProfile.rating} ({mockMechanicProfile.totalReviews} avis)</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
              <Award className="w-4 h-4" />
              <span>{mockMechanicProfile.yearsExperience} ans d'expérience</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{mockMechanicProfile.completedJobs}</p>
            <p className="text-xs text-slate-500">Jobs réalisés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{mockMechanicProfile.responseTime} min</p>
            <p className="text-xs text-slate-500">Temps de réponse</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{mockMechanicProfile.serviceArea.split(' ')[1]}</p>
            <p className="text-xs text-slate-500">Rayon</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {['about', 'gallery', 'reviews'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab === 'about' && 'À propos'}
              {tab === 'gallery' && 'Galerie'}
              {tab === 'reviews' && 'Avis'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Bio</h3>
              <p className="text-sm text-slate-600">{mockMechanicProfile.bio}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Spécialités</h3>
              <div className="flex flex-wrap gap-2">
                {mockMechanicProfile.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">{spec}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Langues</h3>
              <div className="flex flex-wrap gap-2">
                {mockMechanicProfile.languages.map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">{lang}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Zone de service</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{mockMechanicProfile.serviceArea}</span>
              </div>
            </div>
            {mockMechanicProfile.videos.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Vidéos</h3>
                <div className="space-y-2">
                  {mockMechanicProfile.videos.map((video, i) => (
                    <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100">
                      <Video className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-slate-700">{video.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Avant / Après</h3>
            <div className="grid grid-cols-2 gap-3">
              {mockMechanicProfile.gallery.map((item, i) => (
                <div key={i} className="bg-slate-100 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-slate-200 flex items-center justify-center"><Camera className="w-8 h-8 text-slate-400" /></div>
                  <div className="p-2"><p className="text-xs text-slate-600">{item.label}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Avis clients</h3>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-slate-800">{mockMechanicProfile.rating}</span>
                <span className="text-sm text-slate-500">({mockMechanicProfile.totalReviews})</span>
              </div>
            </div>
            <div className="space-y-3">
              {mockMechanicProfile.reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{review.customer}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <button onClick={handleBook} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700">
          Réserver ce mécanicien
        </button>
      </div>
    </div>
  );
};
