import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, StatusBadge, EmptyState } from '../shared/components';
import { IfixMascot } from './IfixMascot';
import {
  listRequestsForCustomer, offersForRequest, getRequest, subscribeMarket,
  acceptOffer, cancelRequest, MarketplaceRequest, ProviderOffer, marketState,
} from './ifixStore';

// ============================================
// OFFERS SCREEN v2 — live, inDrive-style comparison
// ============================================
// Reads the shared marketplace store (same source of truth used by the provider
// portal). Updates arrive without a manual page refresh via subscribeMarket.

const STATUS_LABELS: Record<string, [string, string]> = {
  open: ['info', 'En attente d’offres'],
  offered: ['success', 'Offres reçues'],
  accepted: ['success', 'Offre acceptée'],
  cancelled: ['danger', 'Annulée'],
  expired: ['warning', 'Expirée'],
  completed: ['info', 'Terminée'],
};

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return new Date(iso).toLocaleDateString('fr-MA');
}

export function OffersScreen({ initialRequestId }: { initialRequestId?: string }) {
  const navigate = useNavigate();
  const [, forceTick] = useState(0);
  const [expandedReq, setExpandedReq] = useState<string | null>(initialRequestId ?? null);
  const [confirmAccept, setConfirmAccept] = useState<ProviderOffer | null>(null);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => subscribeMarket(() => forceTick(t => t + 1)), []);

  const { user } = useApp();
  const customerId = user?.id ?? 'u_c1';
  const requests = useMemo(() => listRequestsForCustomer(customerId), [customerId]);
  // Re-read on every tick to reflect live changes
  const liveRequests = requests.map(r => getRequest(r.id)!);

  const showToast = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const doAccept = (offer: ProviderOffer) => {
    setBusy(true);
    const res = acceptOffer(offer.id, customerId);
    setBusy(false);
    setConfirmAccept(null);
    if (!res.ok) showToast('err', res.error ?? 'Erreur');
    else showToast('ok', `Offre de ${offer.provider_name} acceptée pour ${offer.price} MAD — RDV confirmé (${offer.availability}).`);
  };

  const doCancel = (req: MarketplaceRequest) => {
    const res = cancelRequest(req.id, customerId);
    if (!res.ok) showToast('err', res.error ?? 'Erreur');
    else showToast('ok', 'Demande annulée.');
  };

  const aiLinkedCount = liveRequests.filter(r => r.ai_session_id).length;

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-3 text-sm shadow-lg max-w-[90vw] ${toast.kind === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3">
        <IfixMascot state={liveRequests.some(r => r.offer_count > 0 && r.status === 'offered') ? 'success' : 'connecting'} size={40} />
        <div className="flex-1">
          <h2 className="font-bold text-slate-900">Mes demandes & offres</h2>
          <p className="text-xs text-slate-500">Mise à jour en temps réel (sondage 3 s) — {aiLinkedCount > 0 ? `${aiLinkedCount} demande(s) issue(s) d’une session IFIX AI` : 'directes, sans IA si vous le souhaitez'}</p>
        </div>
        <Button size="sm" onClick={() => navigate('/customer/new-request')}>+ Nouvelle</Button>
      </div>

      {liveRequests.length === 0 && (
        <EmptyState icon="📭" title="Aucune demande" description="Créez une demande de service pour recevoir des offres de professionnels proches de chez vous." action={<Button onClick={() => navigate('/customer/new-request')}>Créer une demande</Button>} />
      )}

      {liveRequests.map(req => {
        const offers = offersForRequest(req.id).filter(o => o.status === 'active' || o.status === 'accepted');
        const [badge, label] = STATUS_LABELS[req.status] ?? ['info', req.status];
        const expanded = expandedReq === req.id;
        const cheapest = offers.filter(o => o.status === 'active')[0];
        return (
          <Card key={req.id} className="overflow-hidden">
            <button className="w-full p-4 text-left hover:bg-slate-50/60" onClick={() => setExpandedReq(expanded ? null : req.id)}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{req.category_label}</span>
                    <StatusBadge status={badge} label={label} />
                    {req.urgency === 'urgent' && <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5 font-semibold">URGENT</span>}
                    {req.ai_session_id && <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1"><IfixMascot state="idle" size={12} />conseils IA (optionnels)</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">{req.vehicle_summary} • {req.location.split(',')[0]} • {timeAgo(req.created_at)}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-lg font-extrabold ${req.offer_count > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{req.offer_count}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">offre{req.offer_count > 1 ? 's' : ''}</div>
                  {cheapest && <div className="text-[11px] text-slate-500">dès <b>{cheapest.price} MAD</b></div>}
                </div>
              </div>
            </button>

            {expanded && (
              <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/50">
                <p className="text-sm text-slate-700 whitespace-pre-line">{req.description}</p>
                <p className="text-xs text-slate-500">Éligibilité : {req.eligible_provider_ids.length} professionnel(s) pertinent(s) notifié(s) — votre adresse exacte n’est partagée qu’après acceptation.</p>

                {offers.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
                    <IfixMascot state="listening" size={54} className="mb-2" />
                    <p className="text-sm text-slate-600 font-medium">En attente des premières offres…</p>
                    <p className="text-xs text-slate-400">Les professionnels éligibles sont notifiés dès la publication.</p>
                  </div>
                )}

                {offers.map((o, idx) => (
                  <div key={o.id} className={`rounded-xl border p-3.5 ${o.status === 'accepted' ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{o.provider_name}</span>
                          {o.verified && <span className="text-[10px] bg-blue-50 text-blue-600 rounded-full px-1.5 py-0.5 font-semibold">✓ Vérifié</span>}
                          {idx === 0 && o.status === 'active' && <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5 font-semibold">Meilleur prix</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">★ {o.rating.toFixed(1)} • {o.jobs_done} jobs • répond en ~{Math.max(2, Math.round(30 / (o.rating || 3)))} min</p>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">{o.price} MAD</div>
                        <div className="text-[11px] text-slate-500">{o.availability}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{o.message}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                      {o.includes_parts && <span className="bg-slate-100 rounded-full px-2 py-0.5">Pièces incluses</span>}
                      {o.warranty_days > 0 && <span className="bg-slate-100 rounded-full px-2 py-0.5">Garantie {o.warranty_days} j</span>}
                      {o.eta_min != null && <span className="bg-slate-100 rounded-full px-2 py-0.5">Arrivée ~{o.eta_min} min</span>}
                    </div>
                    <div className="mt-3 flex gap-2">
                      {o.status === 'active' && req.accepts_offers && (
                        <Button size="sm" onClick={() => setConfirmAccept(o)}>Accepter cette offre</Button>
                      )}
                      {o.status === 'accepted' && (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">✓ Intervention planifiée — rendez-vous : {o.availability}</span>
                      )}
                    </div>
                  </div>
                ))}

                {(req.status === 'open' || req.status === 'offered') && (
                  <div className="flex justify-end pt-1">
                    <button onClick={() => doCancel(req)} className="text-xs text-red-500 hover:text-red-700 underline">Annuler la demande</button>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Confirmation dialog for consequential action */}
      {confirmAccept && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !busy && setConfirmAccept(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <IfixMascot state="mechanic" size={44} />
              <h3 className="font-bold text-slate-900">Confirmer le choix</h3>
            </div>
            <p className="text-sm text-slate-600 mb-1">
              Vous allez retenir <b>{confirmAccept.provider_name}</b> pour <b>{confirmAccept.price} MAD</b> ({confirmAccept.availability}).
            </p>
            <p className="text-xs text-slate-400 mb-4">Les autres offres seront automatiquement closes et le professionnel sera notifié.</p>
            <div className="flex gap-2">
              <Button className="flex-1" loading={busy} onClick={() => doAccept(confirmAccept)}>Confirmer</Button>
              <Button variant="outline" className="flex-1" onClick={() => setConfirmAccept(null)} disabled={busy}>Retour</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OffersScreen;
