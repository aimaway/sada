import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button, Card, Avatar, StarRating, PriceDisplay, EmptyState } from '../shared/components';
import { ArrowLeft, Power, PowerOff, Wrench, Wallet, TrendingUp, TrendingDown, ShoppingBag, XCircle, MapPin, Clock, CheckCircle2, Navigation, MessageCircle, Phone, AlertTriangle, ChevronRight, Star } from 'lucide-react';

export function MechanicLogin() {
  const { setUser, setMechanicProfile } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    const known = ['600000001', '600000002', '600000003'];
    if (known.some(p => phone.includes(p))) {
      setUser({ id: 'u_m1', phone: '+212' + phone, role: 'mechanic', full_name: 'Ahmed Benali', status: 'active', language: 'fr', created_at: new Date().toISOString() });
      setMechanicProfile({ id: 'm1', user_id: 'u_m1', verification_status: 'approved', is_online: false });
      navigate('/mechanic/home');
    } else {
      setUser({ id: 'u_new_m', phone: '+212' + phone, role: 'mechanic', full_name: '', status: 'active', language: 'fr', created_at: new Date().toISOString() });
      navigate('/mechanic/profile-setup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Wrench className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Espace Mécanicien</h1>
      {step === 'phone' ? (
        <div className="w-full max-w-sm space-y-4">
          <div className="flex gap-2">
            <span className="px-3 py-2.5 bg-slate-100 rounded-xl text-sm">+212</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="6XX XXX XXX" className="flex-1 px-4 py-2.5 border rounded-xl outline-none" maxLength={9} />
          </div>
          <Button fullWidth size="lg" onClick={() => setStep('otp')}>Envoyer le code</Button>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-4">
          <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="• • • • • •" className="w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest font-mono outline-none" maxLength={6} />
          <Button fullWidth size="lg" onClick={handleVerify} disabled={otp.length < 4}>Vérifier</Button>
          <button onClick={() => setStep('phone')} className="text-sm text-blue-600 mx-auto block">Retour</button>
          <p className="text-xs text-slate-400 text-center">🎮 Dev: code 4+ chiffres. Approuvé: 600000001</p>
        </div>
      )}
    </div>
  );
}

export function MechanicHome() {
  const { user, mechanicProfile, setMechanicProfile, logout } = useApp();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(mechanicProfile?.is_online || false);

  if (mechanicProfile?.verification_status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6"><Clock className="w-10 h-10 text-amber-600" /></div>
        <h2 className="text-xl font-bold mb-2">En attente d'approbation</h2>
        <p className="text-sm text-slate-500 text-center mb-8">Votre profil est en cours de vérification.</p>
        <Button onClick={() => { if (mechanicProfile) setMechanicProfile({ ...mechanicProfile, verification_status: 'approved' }); }}>Simuler l'approbation</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 pt-6 pb-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/mechanic/profile')} className="flex items-center gap-3">
            <Avatar name={user?.full_name || ''} />
            <div className="text-start"><p className="text-sm text-slate-500">Bonjour 👋</p><p className="font-bold">{user?.full_name}</p></div>
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsOnline(!isOnline)} className={`px-4 py-2 rounded-full text-sm font-medium ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>
              {isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-xl bg-slate-100"><XCircle className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <button onClick={() => navigate('/mechanic/active-job')} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 text-left shadow-lg">
          <p className="text-white font-semibold text-sm">Job en cours</p>
          <p className="text-blue-100 text-xs">Batterie — Amine K. — 250 MAD</p>
        </button>
        <h3 className="font-semibold">Demandes à proximité</h3>
        {isOnline ? (
          <Card className="p-4" onClick={() => navigate('/mechanic/request/r1')}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔋</span>
              <div className="flex-1"><p className="font-medium text-sm">Batterie</p><p className="text-xs text-slate-500">Ma voiture ne démarre pas</p>
                <div className="flex gap-3 mt-1 text-xs text-slate-400"><span>📍 2.3 km</span><span>⏱ 25 min</span></div>
              </div>
              <PriceDisplay amount={250} size="sm" />
            </div>
          </Card>
        ) : (
          <EmptyState icon="📡" title="Hors ligne" description="Passez en ligne pour recevoir des demandes" />
        )}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex justify-around">
        {[
          { icon: <Wrench className="w-5 h-5" />, label: 'Demandes', route: '/mechanic/home', active: true },
          { icon: <ShoppingBag className="w-5 h-5" />, label: 'Boutique', route: '/mechanic/shop' },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Gains', route: '/mechanic/earnings' },
          { icon: <Wallet className="w-5 h-5" />, label: 'Wallet', route: '/mechanic/wallet' },
        ].map((tab, i) => (
          <button key={i} onClick={() => navigate(tab.route)} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${tab.active ? 'text-blue-600' : 'text-slate-400'}`}>
            {tab.icon}<span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function MechanicRequestDetail() {
  const { language } = useApp();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-lg font-bold mb-4">Détail demande</h1>
      <Card className="p-4 mb-4"><p className="font-medium">🔋 Batterie — 250 MAD</p><p className="text-sm text-slate-500 mt-1">Ma voiture ne démarre pas</p></Card>
      <div className="space-y-3">
        <Button fullWidth size="lg" onClick={() => navigate('/mechanic/home')}>Accepter (250 MAD)</Button>
        <Button fullWidth variant="outline" size="lg" onClick={() => navigate('/mechanic/home')}>Contre-offrir</Button>
      </div>
    </div>
  );
}

export function MechanicActiveJob() {
  const { language } = useApp();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-lg font-bold mb-4">Job actif</h1>
      <Card className="p-4 mb-4"><p className="font-medium">Amine K.</p><p className="text-sm text-slate-500">Bd Zerktouni • 250 MAD</p></Card>
      <Button fullWidth onClick={() => navigate('/mechanic/home')}>Terminer le job</Button>
    </div>
  );
}

export function MechanicWallet() {
  const navigate = useNavigate();
  const [balance] = React.useState(15000); // 150 MAD in centimes
  const minThreshold = 5000; // 50 MAD
  const isBlocked = balance < minThreshold;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/mechanic/home')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Portefeuille</h1>
      </div>
      <div className="p-4 space-y-4">
        {/* Balance Card */}
        <div className={`rounded-2xl p-6 text-white ${isBlocked ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
          <p className="text-sm opacity-80 mb-1">Solde disponible</p>
          <p className="text-4xl font-bold">{(balance / 100).toFixed(0)} <span className="text-lg font-normal opacity-80">MAD</span></p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${isBlocked ? 'bg-red-300' : 'bg-white'}`} style={{ width: `${Math.min(100, (balance / (minThreshold * 4)) * 100)}%` }} />
            </div>
            <span className="text-xs opacity-80">Min: {(minThreshold / 100).toFixed(0)} MAD</span>
          </div>
        </div>

        {/* Blocked Warning */}
        {isBlocked && (
          <Card className="p-4 border-2 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Vous êtes bloqué</p>
                <p className="text-xs text-red-700 mt-1">Votre solde est en dessous du minimum. Rechargez pour recevoir des demandes.</p>
                <Button size="sm" variant="danger" className="mt-3">Recharger maintenant</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Commission Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Commission plateforme</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Taux</span><span className="font-medium">10%</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Minimum</span><span className="font-medium">10 MAD</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Maximum</span><span className="font-medium">100 MAD</span></div>
          </div>
          <p className="text-xs text-slate-500 mt-3 bg-slate-50 rounded-lg p-2">💡 Déduite automatiquement après chaque job</p>
        </Card>

        {/* Ledger */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Historique</h3>
          {[
            { type: 'top_up', amount: 20000, label: 'Rechargement', date: '15 Mar' },
            { type: 'commission', amount: -2500, label: 'Commission job #J-150', date: '16 Mar' },
            { type: 'commission', amount: -2500, label: 'Commission job #J-156', date: '17 Mar' },
          ].map((entry, i) => (
            <Card key={i} className="p-3 mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.amount > 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {entry.amount > 0 ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.label}</p>
                  <p className="text-xs text-slate-500">{entry.date}</p>
                </div>
                <span className={`font-bold ${entry.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {entry.amount > 0 ? '+' : ''}{(entry.amount / 100).toFixed(0)} MAD
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MechanicEarnings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/mechanic/home')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Gains</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Vos statistiques de gains</p></div>
    </div>
  );
}

export function MechanicShop() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => navigate('/mechanic/home')} className="p-1.5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-semibold">Catalogue Produits</h1>
      </div>
      <div className="p-4"><p className="text-sm text-slate-500">Recommandez des produits à vos clients</p></div>
    </div>
  );
}
