import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Settings, Bot, Wrench, ShoppingCart, Car, Search, Gift,
  FileText, CalendarClock, ClipboardList, Receipt, Sparkles, ArrowRight,
} from 'lucide-react';
import { useApp } from '../shared/context';
import { portalApi } from '../shared/apiClient';

// ============================================
// TOMOBILY — Customer Command Center Dashboard
// Design : sidebar navy (PortalSidebar), zone de contenu claire,
// accents bleu électrique, indicateurs statut émeraude, carte hero IFIX AI.
// Toutes les statistiques proviennent du backend réel
// (GET /api/v1/customer/dashboard). États vides affichés sinon — aucun chiffre inventé.
// ============================================

interface DashStats {
  active_requests: number;
  offers_received: number;
  upcoming_bookings: number;
  total_spent_centimes: number;
}
interface Vehicle { make?: string; model?: string; year?: number; plate?: string; mileage?: number; next_service_km?: number; }
interface DashData {
  ok: boolean;
  stats: DashStats;
  profile: { display_name: string; city?: string | null; vehicles: Vehicle[]; loyalty_points: number };
  recent_requests: Array<{ id: number; status: string; description: string; offer_count: number; vehicle_summary?: string | null; created_at: string | null }>;
  recent_orders: Array<{ id: number; order_number: string; status: string; payment_status: string; total: number; created_at: string | null }>;
  recent_jobs: Array<{ id: number; status: string; agreed_price: number; created_at: string | null }>;
}

const fmtMAD = (centimes: number) =>
  new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(centimes / 100);

const STATUS_LABELS: Record<string, string> = {
  open: 'Ouverte', offers_received: 'Offres reçues', accepted: 'Acceptée',
  on_the_way: 'En route', arrived: 'Arrivé', in_progress: 'En cours',
  completed: 'Terminée', cancelled: 'Annulée', pending: 'En attente',
  confirmed: 'Confirmée', processing: 'En préparation', shipped: 'Expédiée',
  delivered: 'Livrée', disputed: 'En litige', auto_closed: 'Clôturée',
};
const statusColor = (s: string) =>
  ['completed', 'delivered', 'accepted', 'confirmed'].includes(s)
    ? 'bg-emerald-100 text-emerald-700'
    : ['cancelled', 'disputed', 'refunded'].includes(s)
      ? 'bg-red-100 text-red-700'
      : 'bg-sky-100 text-sky-700';

// Paliers fidélité (règles produit existantes du programme fidélité TomoBily)
const TIERS = [
  { level: 'Bronze', min: 0, icon: '🥉' },
  { level: 'Silver', min: 500, icon: '🥈' },
  { level: 'Gold', min: 1500, icon: '🥇' },
  { level: 'Platinum', min: 3000, icon: '💎' },
];

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    portalApi<DashData>('/api/v1/customer/dashboard')
      .then((d) => { if (alive) setData(d); })
      .catch((e) => { if (alive) setError(e.message || 'Chargement impossible'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const firstName = (data?.profile.display_name || user?.full_name || '').split(' ')[0] || '';
  const vehicles = data?.profile.vehicles ?? [];
  const primaryVehicle = vehicles[0];
  const points = data?.profile.loyalty_points ?? 0;
  const tierIdx = TIERS.reduce((acc, t, i) => (points >= t.min ? i : acc), 0);
  const currentTier = TIERS[tierIdx];
  const nextTier = TIERS[tierIdx + 1] ?? null;
  const tierProgress = nextTier
    ? Math.min(100, Math.round(((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100))
    : 100;

  const stats = [
    { label: 'Demandes actives', value: data?.stats.active_requests, to: '/customer/requests', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Offres reçues', value: data?.stats.offers_received, to: '/customer/offers', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'RDV à venir', value: data?.stats.upcoming_bookings, to: '/customer/maintenance', icon: <CalendarClock className="w-5 h-5" /> },
    { label: 'Total dépensé', value: data ? fmtMAD(data.stats.total_spent_centimes) : undefined, to: '/customer/orders', icon: <Receipt className="w-5 h-5" />, money: true },
  ];

  const quickActions = [
    { label: 'Trouver un mécanicien', desc: 'Professionnels vérifiés près de vous', to: '/discover', icon: <Search className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Demander un service', desc: 'Décrivez votre besoin, recevez des offres', to: '/customer/new-request', icon: <Wrench className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { label: 'Boutique auto', desc: 'Pièces et accessoires', to: '/customer/shop', icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Gérer mes véhicules', desc: 'Kilométrage, entretien, historique', to: '/customer/vehicles', icon: <Car className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Welcome header */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Bonjour{firstName ? `, ${firstName}` : ''} 👋</h1>
          <p className="text-sm text-slate-500">
            {primaryVehicle ? `${primaryVehicle.make ?? ''} ${primaryVehicle.model ?? ''} ${primaryVehicle.year ?? ''}`.trim() : 'Aucun véhicule enregistré'}
            {data?.profile.city ? ` · ${data.profile.city}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/customer/notifications')} aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/customer/profile/settings')} aria-label="Paramètres du compte"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Quick statistics — réelles, cliquables */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <button key={s.label} onClick={() => navigate(s.to)}
            className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-blue-200 transition group">
            <div className="flex items-center gap-2 text-blue-600 mb-2">{s.icon}<span className="text-xs font-medium text-slate-500">{s.label}</span></div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? <span className="inline-block w-16 h-7 bg-slate-100 rounded animate-pulse align-middle" /> : error ? '—' : (s.value ?? '—')}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition">Voir détails <ArrowRight className="w-3 h-3" /></div>
          </button>
        ))}
      </div>

      {/* 3. IFIX AI hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f3a] via-[#12305c] to-[#1d4ed8] text-white p-6 shadow-lg">
        <div className="absolute -right-6 -top-6 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
            <Bot className="w-9 h-9 text-cyan-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold">IFIX AI</h2>
              <span className="text-[10px] uppercase tracking-wide bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 rounded-full px-2 py-0.5">Assistant diagnostic</span>
            </div>
            <p className="text-sm text-blue-100 max-w-xl">
              Décrivez un symptôme ou une voyant allumé : IFIX analyse votre problème, pose les bonnes questions
              et vous oriente vers le bon professionnel. Gratuit pendant la phase de démonstration.
            </p>
          </div>
          <button onClick={() => navigate('/customer/ifix')}
            className="shrink-0 inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#0b1f3a] font-bold px-5 py-3 rounded-xl shadow transition">
            <Bot className="w-5 h-5" /> Interroger IFIX AI
          </button>
        </div>
      </div>

      {/* 4. Quick actions */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Actions rapides</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.to)}
              className={`rounded-2xl border p-4 text-left hover:shadow-md transition ${a.color}`}>
              {a.icon}
              <h3 className="font-semibold text-slate-800 text-sm mt-2">{a.label}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 5. Mon véhicule */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><Car className="w-5 h-5 text-blue-600" /> Mes véhicules</h2>
            <button onClick={() => navigate('/customer/vehicles')} className="text-xs font-medium text-blue-600 hover:underline">Gérer</button>
          </div>
          {loading ? (
            <div className="h-24 bg-slate-50 rounded-xl animate-pulse" />
          ) : vehicles.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-3">Aucun véhicule enregistré pour le moment.</p>
              <button onClick={() => navigate('/customer/vehicles')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700">+ Ajouter mon premier véhicule</button>
            </div>
          ) : (
            <div className="space-y-2">
              {vehicles.slice(0, 3).map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{v.make ?? ''} {v.model ?? ''} {v.year ? `· ${v.year}` : ''}</p>
                    <p className="text-xs text-slate-500">{v.plate ?? 'Plaque non renseignée'}{v.mileage ? ` · ${new Intl.NumberFormat('fr-FR').format(v.mileage)} km` : ''}</p>
                  </div>
                  <button onClick={() => navigate('/customer/maintenance')} className="text-xs text-emerald-600 font-medium hover:underline">Entretien</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Activité récente */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Activité récente</h2>
          {loading ? (
            <div className="h-24 bg-slate-50 rounded-xl animate-pulse" />
          ) : error ? (
            <p className="text-sm text-slate-500">{error}. <button onClick={() => window.location.reload()} className="text-blue-600 font-medium hover:underline">Réessayer</button></p>
          ) : ((data?.recent_requests.length ?? 0) + (data?.recent_jobs.length ?? 0) + (data?.recent_orders.length ?? 0)) === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-3">Votre activité apparaîtra ici : demandes, offres, RDV et commandes.</p>
              <button onClick={() => navigate('/customer/new-request')} className="text-sm font-semibold text-blue-600 hover:underline">Créer ma première demande</button>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {data!.recent_requests.map((r) => (
                <button key={`rq-${r.id}`} onClick={() => navigate('/customer/requests')}
                  className="w-full flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-left hover:bg-slate-100">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.vehicle_summary || r.description}</p>
                    <p className="text-xs text-slate-500">{r.offer_count} offre(s) en attente</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${statusColor(r.status)}`}>{STATUS_LABELS[r.status] ?? r.status}</span>
                </button>
              ))}
              {data!.recent_jobs.map((j) => (
                <button key={`jb-${j.id}`} onClick={() => navigate('/customer/requests')}
                  className="w-full flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-left hover:bg-slate-100">
                  <div className="min-w-0"><p className="text-sm font-medium text-slate-800">Intervention #{j.id}</p><p className="text-xs text-slate-500">{fmtMAD(j.agreed_price)}</p></div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${statusColor(j.status)}`}>{STATUS_LABELS[j.status] ?? j.status}</span>
                </button>
              ))}
              {data!.recent_orders.map((o) => (
                <button key={`or-${o.id}`} onClick={() => navigate('/customer/orders')}
                  className="w-full flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-left hover:bg-slate-100">
                  <div className="min-w-0"><p className="text-sm font-medium text-slate-800">Commande {o.order_number}</p><p className="text-xs text-slate-500">{fmtMAD(o.total)}</p></div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${statusColor(o.status)}`}>{STATUS_LABELS[o.status] ?? o.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7. Aperçu entretien */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><CalendarClock className="w-5 h-5 text-emerald-600" /> Entretien & rappels</h2>
          <button onClick={() => navigate('/customer/maintenance')} className="text-xs font-medium text-blue-600 hover:underline">Tout voir</button>
        </div>
        {loading ? (
          <div className="h-16 bg-slate-50 rounded-xl animate-pulse" />
        ) : (() => {
          const dueSoon = vehicles.filter((v) => v.next_service_km && v.mileage && v.next_service_km - v.mileage <= 1500);
          const reminders = vehicles.filter((v) => v.next_service_km);
          if (reminders.length === 0) {
            return (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500 mb-2">Aucune échéance d’entretien enregistrée. Ajoutez le prochain kilométrage de révision pour activer les rappels.</p>
                <button onClick={() => navigate('/customer/vehicles')} className="text-sm font-semibold text-blue-600 hover:underline">Compléter mes véhicules</button>
              </div>
            );
          }
          return (
            <div className="space-y-2">
              {reminders.map((v, i) => {
                const remaining = v.mileage != null ? (v.next_service_km! - v.mileage) : null;
                const overdue = remaining != null && remaining <= 0;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-800 font-medium">{v.make} {v.model}</p>
                    <span className={`text-xs font-semibold ${overdue ? 'text-red-600' : remaining != null && remaining <= 1500 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {remaining == null ? `Prochaine révision : ${v.next_service_km?.toLocaleString('fr-FR')} km`
                        : overdue ? `Révision en retard de ${Math.abs(remaining).toLocaleString('fr-FR')} km`
                        : `Révision dans ${remaining.toLocaleString('fr-FR')} km`}
                    </span>
                  </div>
                );
              })}
              {dueSoon.length > 0 && (
                <button onClick={() => navigate('/customer/maintenance-request')}
                  className="w-full mt-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition">
                  Prendre rendez-vous pour l’entretien
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* 8. Fidélité */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-slate-800">Programme fidélité</h2>
          <span className="ml-auto text-sm font-bold text-amber-700">{currentTier.icon} {currentTier.level}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <span>{points.toLocaleString('fr-FR')} points</span>
          {nextTier ? <span>{(nextTier.min - points).toLocaleString('fr-FR')} pts → {nextTier.level}</span> : <span>Palier maximal atteint 🎉</span>}
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden border border-amber-200">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${tierProgress}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">Les points sont crédités sur vos interventions réelles ; aucune donnée n’est simulée.</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
