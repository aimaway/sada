import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button, Card, Avatar, StarRating, PriceDisplay, CountdownTimer, EmptyState } from '../shared/components';
import { ArrowLeft, Plus, MapPin, Camera, Clock, Star, MessageCircle, Phone, Navigation, CheckCircle2, XCircle, Wrench, Car, ShoppingBag } from 'lucide-react';

export function CustomerLogin() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    const knownPhones = ['600000010', '600000011'];
    const isKnown = knownPhones.some(p => phone.includes(p));
    if (isKnown) {
      setUser({ id: 'u_c1', phone: '+212' + phone, role: 'customer', full_name: 'Amine K.', status: 'active', language: 'fr', created_at: new Date().toISOString() });
      navigate('/customer/home');
    } else {
      setUser({ id: 'u_new', phone: '+212' + phone, role: 'customer', full_name: '', status: 'active', language: 'fr', created_at: new Date().toISOString() });
      navigate('/customer/profile-setup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Wrench className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Connexion</h1>
      {step === 'phone' ? (
        <div className="w-full max-w-sm space-y-4">
          <div className="flex gap-2">
            <span className="px-3 py-2.5 bg-slate-100 rounded-xl text-sm">+212</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="6XX XXX XXX" className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl outline-none" maxLength={9} />
          </div>
          <Button fullWidth size="lg" onClick={() => setStep('otp')}>Envoyer le code</Button>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-4">
          <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="• • • • • •" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-2xl tracking-widest font-mono outline-none" maxLength={6} />
          <Button fullWidth size="lg" onClick={handleVerify} disabled={otp.length < 4}>Vérifier</Button>
          <button onClick={() => setStep('phone')} className="text-sm text-emerald-600 font-medium mx-auto block">Retour</button>
          <p className="text-xs text-slate-400 text-center">🎮 Dev: n'importe quel code 4+ chiffres</p>
        </div>
      )}
    </div>
  );
}

export function CustomerHome() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Bonjour 👋</p>
            <h1 className="text-xl font-bold text-slate-800">{user?.full_name || 'Client'}</h1>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-xl bg-slate-100">
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
      <div className="px-4 py-4 space-y-4">
        <button onClick={() => navigate('/customer/new-request')} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 text-left shadow-lg">
          <h2 className="text-white font-bold text-lg mb-1">Nouvelle demande</h2>
          <p className="text-emerald-100 text-sm">Décrivez votre problème</p>
        </button>
        <button onClick={() => navigate('/customer/ai-assistant')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-left shadow-lg">
          <h2 className="text-white font-bold text-lg mb-1">✨ Assistant IA</h2>
          <p className="text-blue-100 text-sm">Diagnostic + estimation de prix</p>
        </button>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🛒', label: 'Boutique', route: '/customer/shop' },
            { icon: '📋', label: 'Historique', route: '/customer/orders' },
            { icon: '🔔', label: 'Rappels', route: '/customer/reminders' },
            { icon: '📄', label: 'Documents', route: '/customer/documents' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.route)} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-[10px] font-medium text-slate-700">{item.label}</p>
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/customer/maintenance')} className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800">✅ Check-list du jour</h3>
          <p className="text-xs text-slate-500">Vérifiez votre voiture en 2 min</p>
        </button>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-around z-50">
        {[
          { icon: <Car className="w-5 h-5" />, label: 'Accueil', route: '/customer/home', active: true },
          { icon: <Wrench className="w-5 h-5" />, label: 'Entretien', route: '/customer/maintenance' },
          { icon: <MessageCircle className="w-5 h-5" />, label: 'Messages', route: '/customer/messages' },
          { icon: <ShoppingBag className="w-5 h-5" />, label: 'Commandes', route: '/customer/orders' },
        ].map((tab, i) => (
          <button key={i} onClick={() => navigate(tab.route)} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${tab.active ? 'text-emerald-600' : 'text-slate-400'}`}>
            {tab.icon}<span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function CustomerNewRequest() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const categories = [
    { id: '1', name_fr: 'Batterie', name_ar: 'بطارية', icon: '🔋', min: 150, max: 500 },
    { id: '2', name_fr: 'Vidange', name_ar: 'تغيير الزيت', icon: '🛢️', min: 200, max: 600 },
    { id: '3', name_fr: 'Freins', name_ar: 'فرامل', icon: '🔧', min: 300, max: 1200 },
    { id: '4', name_fr: 'Pneus', name_ar: 'إطارات', icon: '🛞', min: 100, max: 800 },
  ];
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/customer/home')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">Nouvelle demande</h1>
      </div>
      <div className="px-4 py-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Choisir le type de réparation</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setCategory(cat.id); setStep(2); }} className="p-4 rounded-2xl border-2 border-slate-100 bg-white text-left hover:border-emerald-300">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <p className="font-medium text-slate-800 text-sm">{language === 'fr' ? cat.name_fr : cat.name_ar}</p>
                  <p className="text-xs text-slate-500">{cat.min}-{cat.max} MAD</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Décrivez le problème</h2>
            <textarea placeholder="Ex: Ma batterie est morte..." className="w-full px-4 py-3 border border-slate-200 rounded-xl resize-none h-28 outline-none" />
            <button className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2">
              <Camera className="w-8 h-8 text-slate-400" /><span className="text-sm text-slate-500">Ajouter des photos</span>
            </button>
            <Button fullWidth size="lg" onClick={() => setStep(3)}>Suivant</Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Votre prix proposé</h2>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="text-4xl font-bold text-center w-32 outline-none bg-transparent" />
              <span className="text-xl text-slate-400 ms-2">MAD</span>
            </div>
            <Button fullWidth size="lg" onClick={() => navigate('/customer/offers')} disabled={!price}>Envoyer</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CustomerWaiting() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 mb-4">En attente des offres...</p>
        <Button onClick={() => navigate('/customer/offers')}>Voir les offres (démo)</Button>
      </div>
    </div>
  );
}

export function CustomerTracking() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Card className="p-4 text-center">
        <p className="text-lg font-bold mb-2">Job en cours</p>
        <Button onClick={() => navigate('/customer/negotiation')}>Ouvrir la discussion</Button>
      </Card>
    </div>
  );
}

export function CustomerRate() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-4" />
      <h2 className="text-xl font-bold mb-4">Job terminé !</h2>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => setStars(s)}>
            <Star className={`w-10 h-10 ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
          </button>
        ))}
      </div>
      <Button fullWidth size="lg" onClick={() => navigate('/customer/home')} disabled={stars === 0}>Envoyer</Button>
    </div>
  );
}

export function CustomerHistory() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-xl font-bold mb-4">Historique</h1>
      <EmptyState icon="📋" title="Aucun historique" description="Vos jobs terminés apparaîtront ici" action={<Button onClick={() => navigate('/customer/home')}>Retour</Button>} />
    </div>
  );
}
