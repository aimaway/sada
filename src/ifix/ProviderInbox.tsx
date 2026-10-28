import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, resolveDemoIdentity } from '../shared/context';
import { Card, Button, StatusBadge, EmptyState } from '../shared/components';
import { IfixMascot } from './IfixMascot';
import {
  listVisibleRequestsForProvider, offersFromProvider, jobsForProvider,
  notificationsFor, markNotificationRead, subscribeMarket, withdrawOffer,
  MarketplaceRequest, ProviderOffer, AcceptedJob,
} from './ifixStore';

// ============================================
// PROVIDER PORTAL — incoming requests inbox, my offers, my jobs
// ============================================
// Only requests where this provider is in eligible_provider_ids are listed
// (eligibility enforced again inside submitOffer on the store/backend).
// Sensitive customer details (name/address) stay masked until an offer exists.

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return new Date(iso).toLocaleDateString('fr-MA');
}

const URGENCY_BADGE: Record<string, [string, string]> = {
  urgent: ['danger', 'URGENT'],
  normal: ['info', 'Standard'],
  low: ['warning', 'Planifié'],
};

const JOB_STATUS: Record<string, [string, string]> = {
  scheduled: ['info', 'Programmé'],
  in_progress: ['success', 'En cours'],
  completed: ['info', 'Terminé'],
  cancelled: ['danger', 'Annulé'],
};

export function ProviderInbox() {
  const navigate = useNavigate();
  const { user } = useApp();
  const identity = resolveDemoIdentity(user);
  const providerId = identity?.id ?? 'u_m1';
  const [, tick] = useState(0);
  const [tab, setTab] = useState<'requests' | 'offers' | 'jobs'>('requests');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => subscribeMarket(() => tick(t => t + 1)), []);

  const requests = useMemo(() => listVisibleRequestsForProvider(providerId), [providerId, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const myOffers = useMemo(() => offersFromProvider(providerId), [providerId, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const myJobs = useMemo(() => jobsForProvider(providerId), [providerId, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const notifs = useMemo(() => notificationsFor('provider', providerId).filter(n => !n.read), [providerId, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3500); };

  const withdraw = (o: ProviderOffer) => {
    const res = withdrawOffer(o.id, providerId);
    showToast(res.ok ? 'Offre retirée.' : res.error ?? 'Erreur');
  };

  const tabs = [
    { id: 'requests' as const, label: 'Demandes entrantes', count: requests.length },
    { id: 'offers' as const, label: 'Mes offres', count: myOffers.filter(o => o.status === 'active').length },
    { id: 'jobs' as const, label: 'Mes interventions', count: myJobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').length },
  ];

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-3 text-sm shadow-lg bg-slate-900 text-white">{toast}</div>
      )}

      <div className="flex items-center gap-3">
        <IfixMascot state={requests.length > 0 ? 'connecting' : 'idle'} size={40} />
        <div className="flex-1">
          <h2 className="font-bold text-slate-900">Espace professionnel</h2>
          <p className="text-xs text-slate-500">{identity?.full_name ?? 'Professionnel'} • nouvelles demandes filtrées par vos spécialités {notifs.length > 0 && <span className="ml-1 text-emerald-600 font-semibold">({notifs.length} notif.)</span>}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}{t.count > 0 && <span className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.5 font-bold ${tab === t.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'requests' && (
        requests.length === 0 ? (
          <EmptyState icon="📥" title="Aucune demande pour le moment" description="Vous recevrez uniquement les demandes correspondant à vos catégories de service et à votre statut de vérification." />
        ) : (
          <div className="space-y-3">
            {requests.map(req => {
              const alreadyOffered = myOffers.some(o => o.request_id === req.id && o.status === 'active');
              const [ub, ul] = URGENCY_BADGE[req.urgency] ?? ['info', req.urgency];
              return (
                <Card key={req.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">{req.category_label}</span>
                        <StatusBadge status={ub} label={ul} />
                        {req.source === 'ai_assisted' && (
                          <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2 py-0.5 font-semibold">orientée IFIX AI</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{req.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {req.vehicle_summary} • {req.location.split(',')[0]} • {req.preferred_time} • {timeAgo(req.created_at)}
                      </p>
                      <p className="text-[11px] text-slate-400 italic mt-1">Coordonnées client masquées tant que votre offre n’a pas été retenue.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400">{req.offer_count} offre{req.offer_count > 1 ? 's' : ''}</div>
                      {req.budget != null && <div className="text-xs text-slate-500 mt-1">Budget&nbsp;: <b>{req.budget} MAD</b></div>}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {alreadyOffered ? (
                      <Button size="sm" variant="outline" disabled>Offre déjà envoyée</Button>
                    ) : (
                      <Button size="sm" onClick={() => navigate(`/mechanic/request/${req.id}`)}>Faire une offre</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/mechanic/request/${req.id}`)}>Détails</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === 'offers' && (
        myOffers.length === 0 ? (
          <EmptyState icon="💼" title="Aucune offre envoyée" description="Répondez aux demandes entrantes pour gagner des interventions." action={<Button onClick={() => setTab('requests')}>Voir les demandes</Button>} />
        ) : (
          <div className="space-y-3">
            {myOffers.map(o => (
              <Card key={o.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{o.price} MAD <span className="text-xs font-normal text-slate-500">— {o.message.slice(0, 60)}</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">Demande {o.request_id} • envoyée {timeAgo(o.created_at)} • {o.availability}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge
                    status={o.status === 'accepted' ? 'success' : o.status === 'active' ? 'info' : 'warning'}
                    label={o.status === 'accepted' ? 'Acceptée ✓' : o.status === 'active' ? 'Active' : o.status === 'withdrawn' ? 'Retirée' : o.status}
                  />
                  {o.status === 'active' && <Button size="sm" variant="ghost" onClick={() => withdraw(o)}>Retirer</Button>}
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {tab === 'jobs' && (
        myJobs.length === 0 ? (
          <EmptyState icon="🔧" title="Aucune intervention" description="Les interventions acceptées par les clients apparaîtront ici." />
        ) : (
          <div className="space-y-3">
            {myJobs.map(j => {
              const [sb, sl] = JOB_STATUS[j.status] ?? ['info', j.status];
              return (
                <Card key={j.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Client {j.customer_id} • {j.agreed_price} MAD</p>
                    <p className="text-xs text-slate-400 mt-0.5">Job {j.id} • créé {timeAgo(j.created_at)}</p>
                  </div>
                  <StatusBadge status={sb} label={sl} />
                </Card>
              );
            })}
          </div>
        )
      )}

      {notifs.length > 0 && tab === 'requests' && (
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <IfixMascot state="listening" size={18} />
          Les nouvelles demandes arrivent automatiquement (sondage 3 s).
          <button className="underline" onClick={() => { notifs.forEach(n => markNotificationRead(n.id)); tick(t => t + 1); }}>Marquer comme lues</button>
        </div>
      )}
    </div>
  );
}

export default ProviderInbox;
