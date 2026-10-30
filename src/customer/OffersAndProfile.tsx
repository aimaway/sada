import { useEffect, useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, Avatar, StarRating, PriceDisplay, CountdownTimer, StatusBadge } from '../shared/components';
import { 
  ArrowLeft, Shield, Clock, MapPin, MessageCircle, Phone, X, 
  Check, Star, Wrench, Zap, Award, ChevronRight, AlertTriangle,
  Volume2, Camera, Image as ImageIcon, Filter, SortAsc, Languages
} from 'lucide-react';

interface MechanicOffer {
  id: string;
  mechanic_id: string;
  name: string;
  avatar_color: string;
  verified: boolean;
  rating: number;
  jobs_done: number;
  response_time_min: number;
  completion_rate: number;
  price: number;
  original_price?: number;
  type: 'accept' | 'counter';
  eta_min: number;
  distance_km: number;
  specialties: string[];
  languages: string[];
  includes_parts: boolean;
  message: string;
  years_experience: number;
  brands: string[];
  is_previous: boolean;
  warranty_days: number;
}

const mockOffers: MechanicOffer[] = [
  {
    id: 'o1', mechanic_id: 'm1', name: 'Ahmed Benali', avatar_color: 'bg-emerald-500',
    verified: true, rating: 4.8, jobs_done: 145, response_time_min: 3, completion_rate: 98,
    price: 250, type: 'accept', eta_min: 12, distance_km: 1.8,
    specialties: ['Toyota', 'Dacia', 'Renault'], languages: ['Darija', 'Français', 'العربية'],
    includes_parts: true, message: 'Pièces incluses, batterie Bosch neuve. Garantie 6 mois.',
    years_experience: 8, brands: ['Toyota', 'Dacia', 'Renault', 'Peugeot'],
    is_previous: true, warranty_days: 30,
  },
  {
    id: 'o2', mechanic_id: 'm2', name: 'Youssef El Amrani', avatar_color: 'bg-blue-500',
    verified: true, rating: 4.5, jobs_done: 89, response_time_min: 5, completion_rate: 95,
    price: 320, type: 'counter', original_price: 250, eta_min: 8, distance_km: 1.2,
    specialties: ['Électrique', 'Hybride', 'Diesel'], languages: ['Darija', 'Français'],
    includes_parts: true, message: 'Batterie Varta premium + diagnostic complet offert.',
    years_experience: 12, brands: ['BMW', 'Mercedes', 'Audi', 'VW'],
    is_previous: false, warranty_days: 30,
  },
  {
    id: 'o3', mechanic_id: 'm3', name: 'Karim Tazi', avatar_color: 'bg-purple-500',
    verified: true, rating: 4.9, jobs_done: 234, response_time_min: 2, completion_rate: 99,
    price: 280, type: 'accept', eta_min: 15, distance_km: 2.5,
    specialties: ['Toutes marques', 'Diesel', 'Turbo'], languages: ['Darija', 'Français', 'العربية', 'English'],
    includes_parts: false, message: 'Main d\'œuvre uniquement. Je peux vous fournir la pièce sur place.',
    years_experience: 15, brands: ['Toutes marques'],
    is_previous: false, warranty_days: 30,
  },
  {
    id: 'o4', mechanic_id: 'm4', name: 'Hassan Idrissi', avatar_color: 'bg-amber-500',
    verified: true, rating: 4.2, jobs_done: 56, response_time_min: 8, completion_rate: 92,
    price: 200, type: 'accept', eta_min: 20, distance_km: 3.8,
    specialties: ['Dacia', 'Renault', 'Peugeot'], languages: ['Darija', 'Français'],
    includes_parts: false, message: 'Prix main d\'œuvre. Pièce à acheter séparément.',
    years_experience: 5, brands: ['Dacia', 'Renault', 'Peugeot', 'Citroën'],
    is_previous: false, warranty_days: 7,
  },
];

// D. Offers Screen - inDrive-style bidding
export function OffersScreen() {
  const toast = useToast();
  const { language } = useApp();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<MechanicOffer[]>([]);
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'rated'>('rated');
  const [filterParts, setFilterParts] = useState<'all' | 'parts' | 'labour'>('all');
  const [showRaisePrice, setShowRaisePrice] = useState(false);
  const [newPrice, setNewPrice] = useState(300);
  const expiresAt = new Date(Date.now() + 5 * 60000).toISOString();

  // Simulate offers arriving in real time
  useEffect(() => {
    const timers = mockOffers.map((offer, idx) => 
      setTimeout(() => {
        setOffers(prev => [...prev, offer]);
      }, (idx + 1) * 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const sortedOffers = [...offers]
    .filter(o => {
      if (filterParts === 'parts') return o.includes_parts;
      if (filterParts === 'labour') return !o.includes_parts;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') return a.price - b.price;
      if (sortBy === 'fastest') return a.eta_min - b.eta_min;
      return b.rating - a.rating;
    });

  // Price protection warning
  const avgPrice = 275;
  const isUnusualPrice = (price: number) => price < avgPrice * 0.5 || price > avgPrice * 1.8;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('/customer/waiting')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="text-center flex-1">
            <p className="text-xs text-slate-500">{language === 'fr' ? 'Expire dans' : 'ينتهي في'}</p>
            <CountdownTimer expiresAt={expiresAt} />
          </div>
          <button onClick={() => navigate('/customer/home')} className="px-3 py-1.5 text-red-600 text-sm font-medium bg-red-50 rounded-lg">
            {language === 'fr' ? 'Annuler' : 'إلغاء'}
          </button>
        </div>
        
        {/* Request summary */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="bg-slate-100 px-2 py-0.5 rounded-full">🔋 Batterie</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-full">📍 Bd Zerktouni</span>
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Votre prix: 250 MAD</span>
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <div className="flex gap-1">
          {[
            { id: 'rated', label: language === 'fr' ? '⭐ Mieux notés' : '⭐ الأفضل', icon: <Star className="w-3 h-3" /> },
            { id: 'cheapest', label: language === 'fr' ? '💰 Moins cher' : '💰 الأرخص', icon: <SortAsc className="w-3 h-3" /> },
            { id: 'fastest', label: language === 'fr' ? '⚡ Plus rapide' : '⚡ الأسرع', icon: <Zap className="w-3 h-3" /> },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as any)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                sortBy === s.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <div className="flex gap-1">
          {[
            { id: 'all', label: language === 'fr' ? 'Tout' : 'الكل' },
            { id: 'parts', label: language === 'fr' ? '🔧+Pièces' : '🔧+قطع' },
            { id: 'labour', label: language === 'fr' ? '🔧Main d\'œuvre' : '🔧يد عاملة' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterParts(f.id as any)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filterParts === f.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        {/* Offers count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-700">
            {offers.length} {language === 'fr' ? 'offres reçues' : 'عروض مستلمة'}
          </p>
          {offers.length === 0 && (
            <button onClick={() => setShowRaisePrice(true)} className="text-xs text-emerald-600 font-medium">
              {language === 'fr' ? 'Augmenter mon prix ↑' : 'رفع سعري ↑'}
            </button>
          )}
        </div>

        {/* Loading state */}
        {offers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500">{language === 'fr' ? 'Recherche de mécaniciens à proximité...' : 'البحث عن ميكانيكيين قريبين...'}</p>
          </div>
        )}

        {/* Offers list */}
        <div className="space-y-3">
          {sortedOffers.map(offer => (
            <Card key={offer.id} className="p-4 border-2 border-slate-100 hover:border-emerald-200 transition-all">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 ${offer.avatar_color} rounded-full flex items-center justify-center text-white font-bold text-lg relative`}>
                  {offer.name.charAt(0)}
                  {offer.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Shield className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">{offer.name}</p>
                    {offer.is_previous && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                        {language === 'fr' ? 'Déjà utilisé' : 'مستخدم سابقاً'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={offer.rating} />
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{offer.jobs_done} jobs</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{offer.years_experience} {language === 'fr' ? 'ans' : 'سنوات'}</span>
                  </div>
                </div>
                <div className="text-end">
                  <PriceDisplay amount={offer.price} size="sm" />
                  {offer.type === 'counter' && (
                    <span className="text-[10px] text-blue-600 font-medium">{language === 'fr' ? 'Contre-offre' : 'عرض مضاد'}</span>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mb-3 text-xs">
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> {offer.eta_min} min
                </span>
                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3" /> {offer.distance_km} km
                </span>
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" /> {offer.response_time_min} min {language === 'fr' ? 'réponse' : 'رد'}
                </span>
                <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3" /> {offer.completion_rate}%
                </span>
              </div>

              {/* Specialty tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {offer.specialties.map(s => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Languages className="w-2.5 h-2.5" /> {offer.languages.slice(0, 2).join(', ')}
                </span>
              </div>

              {/* Includes badge */}
              <div className={`text-xs px-2 py-1 rounded-lg mb-2 ${offer.includes_parts ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
                {offer.includes_parts 
                  ? (language === 'fr' ? '✅ Pièces + main d\'œuvre incluses' : '✅ قطع + يد عاملة مشمولة')
                  : (language === 'fr' ? '🔧 Main d\'œuvre uniquement' : '🔧 يد عاملة فقط')}
              </div>

              {/* Message */}
              {offer.message && (
                <p className="text-xs text-slate-600 italic bg-slate-50 rounded-lg p-2 mb-3">
                  "{offer.message}"
                </p>
              )}

              {/* Price protection warning */}
              {isUnusualPrice(offer.price) && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    {offer.price < avgPrice * 0.5 
                      ? (language === 'fr' ? 'Prix inhabituellement bas — vérifiez la qualité' : 'سعر منخفض بشكل غير عادي — تحقق من الجودة')
                      : (language === 'fr' ? 'Prix au-dessus du marché — négociez ou comparez' : 'السعر فوق السوق — تفاوض أو قارن')}
                  </p>
                </div>
              )}

              {/* Warranty */}
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                <Shield className="w-3 h-3" />
                <span>{language === 'fr' ? `Garantie ${offer.warranty_days} jours` : `ضمان ${offer.warranty_days} يوم`}</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-5 gap-2">
                <button
                  onClick={() => navigate('/customer/tracking')}
                  className="col-span-2 bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  {language === 'fr' ? 'Accepter' : 'قبول'}
                </button>
                <button
                  onClick={() => navigate('/customer/negotiation')}
                  className="bg-blue-100 text-blue-700 rounded-xl py-2.5 text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
                >
                  💬
                </button>
                <button
                  onClick={() => navigate(`/customer/mechanic-profile/${offer.mechanic_id}`)}
                  className="bg-slate-100 text-slate-700 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  👤
                </button>
                <button className="bg-red-50 text-red-600 rounded-xl py-2.5 text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Raise price modal */}
        {offers.length > 0 && (
          <div className="mt-4 text-center">
            <button onClick={() => setShowRaisePrice(true)} className="text-sm text-emerald-600 font-medium">
              {language === 'fr' ? '↑ Augmenter mon prix pour attirer plus de mécaniciens' : '↑ رفع سعي لجذب المزيد من الميكانيكيين'}
            </button>
          </div>
        )}
      </div>

      {/* Raise Price Modal */}
      {showRaisePrice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              {language === 'fr' ? 'Augmenter votre prix' : 'رفع سعرك'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {language === 'fr' ? 'Un prix plus élevé attire plus de mécaniciens' : 'سعر أعلى يجذب المزيد من الميكانيكيين'}
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button onClick={() => setNewPrice(Math.max(250, newPrice - 50))} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">−</button>
              <div className="text-center">
                <input
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  className="text-3xl font-bold text-center w-24 outline-none bg-transparent"
                />
                <p className="text-xs text-slate-500">MAD</p>
              </div>
              <button onClick={() => setNewPrice(newPrice + 50)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">+</button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRaisePrice(false)}>
                {language === 'fr' ? 'Annuler' : 'إلغاء'}
              </Button>
              <Button className="flex-1" onClick={() => { setShowRaisePrice(false); toast('Prix mis à jour !'); }}>
                {language === 'fr' ? 'Confirmer' : 'تأكيد'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// E. Mechanic Profile Page
export function MechanicProfileScreen() {
  const { language } = useApp();
  const navigate = useNavigate();
  const mechanic = mockOffers[0];

  const reviews = [
    { id: 'r1', name: 'Amine K.', rating: 5, comment: 'Excellent travail, très professionnel et ponctuel. Je recommande !', date: 'Il y a 2 jours', has_photo: true },
    { id: 'r2', name: 'Sara M.', rating: 5, comment: 'Rapide et efficace. Prix correct.', date: 'Il y a 1 semaine', has_photo: false },
    { id: 'r3', name: 'Youssef R.', rating: 4, comment: 'Bon travail, un peu en retard mais résultat impeccable.', date: 'Il y a 2 semaines', has_photo: true },
  ];

  const verifications = [
    { label: language === 'fr' ? 'Carte d\'identité' : 'بطاقة الهوية', verified: true },
    { label: language === 'fr' ? 'Atelier vérifié' : 'ورشة موثقة', verified: true },
    { label: language === 'fr' ? 'Certificats' : 'شهادات', verified: true },
    { label: language === 'fr' ? 'Références' : 'مراجع', verified: true },
    { label: language === 'fr' ? 'Assurance pro' : 'تأمين مهني', verified: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800 flex-1">{language === 'fr' ? 'Profil mécanicien' : 'ملف الميكانيكي'}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <Card className="p-6 text-center">
          <div className={`w-20 h-20 ${mechanic.avatar_color} rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 relative`}>
            {mechanic.name.charAt(0)}
            {mechanic.verified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-3 border-white">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{mechanic.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <StarRating rating={mechanic.rating} size="md" />
            <span className="text-sm text-slate-500">({mechanic.jobs_done} jobs)</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {mechanic.years_experience} {language === 'fr' ? 'ans d\'expérience' : 'سنوات خبرة'}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-slate-50 rounded-xl p-2">
              <p className="text-lg font-bold text-emerald-600">{mechanic.completion_rate}%</p>
              <p className="text-[10px] text-slate-500">{language === 'fr' ? 'Complétion' : 'إنجاز'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <p className="text-lg font-bold text-blue-600">{mechanic.response_time_min} min</p>
              <p className="text-[10px] text-slate-500">{language === 'fr' ? 'Réponse' : 'رد'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <p className="text-lg font-bold text-purple-600">{mechanic.warranty_days}j</p>
              <p className="text-[10px] text-slate-500">{language === 'fr' ? 'Garantie' : 'ضمان'}</p>
            </div>
          </div>
        </Card>

        {/* Verification checklist */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            {language === 'fr' ? 'Vérifications' : 'التوثيقات'}
          </h3>
          <div className="space-y-2">
            {verifications.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-slate-700">{v.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Brands & Specialties */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Marques & Spécialités' : 'الماركات والتخصصات'}</h3>
          <div className="flex flex-wrap gap-2">
            {mechanic.brands.map(b => (
              <span key={b} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">{b}</span>
            ))}
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1">{language === 'fr' ? 'Langues parlées' : 'اللغات'}</p>
            <div className="flex flex-wrap gap-2">
              {mechanic.languages.map(l => (
                <span key={l} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <Languages className="w-3 h-3" /> {l}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Service area */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-2">{language === 'fr' ? 'Zone de service' : 'منطقة الخدمة'}</h3>
          <div className="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-xl h-32 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-slate-700">Casablanca</p>
              <p className="text-xs text-slate-500">{mechanic.distance_km} km • ~{mechanic.eta_min} min</p>
            </div>
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">{language === 'fr' ? 'Avis clients' : 'تقييمات العملاء'}</h3>
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar name={review.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{review.name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{review.comment}</p>
                {review.has_photo && (
                  <div className="flex gap-2 mt-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-lg">📷</div>
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-lg">📷</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Hire Again button */}
        {mechanic.is_previous && (
          <Button fullWidth size="lg" onClick={() => navigate('/customer/new-request')}>
            🔄 {language === 'fr' ? 'Engager à nouveau' : 'استأجر مرة أخرى'}
          </Button>
        )}
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
