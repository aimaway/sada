import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, resolveDemoIdentity } from '../shared/context';
import { Card, Button, StatusBadge, EmptyState } from '../shared/components';
import { IfixMascot } from './IfixMascot';
import {
  getRequest, offersForRequest, submitOffer, subscribeMarket, getProvider,
  MarketplaceRequest,
} from './ifixStore';

// ============================================
// PROVIDER — request detail + offer form
// Route: /mechanic/request/:id
// All validation is re-run inside submitOffer() (mirrors backend rules):
// eligibility, open state, price bounds, duplicate active offer.
// ============================================

const AVAILABILITY_OPTIONS = [
  'Dès que possible',
  "Aujourd'hui après-midi",
  'Demain matin',
  'Cette semaine',
];

export function RequestOfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  const identity = resolveDemoIdentity(user);
  const providerId = identity?.id ?? 'u_m1';
  const provider = getProvider(providerId);

  const [, tick] = useState(0);
  useEffect(() => subscribeMarket(() => tick(t => t + 1)), []);
  const req: MarketplaceRequest | undefined = useMemo(() => (id ? getRequest(id) : undefined), [id, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
  const [eta, setEta] = useState('');
  const [includesParts, setIncludesParts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!req) {
    return (
      <EmptyState icon="🔍" title="Demande introuvable" description="Elle a peut-être expiré ou été annulée."
        action={<Button onClick={() => navigate('/mechanic/inbox')}>Retour à la boîte de réception</Button>} />
    );
  }

  const eligible = req.eligible_provider_ids.includes(providerId);
  const canOffer = eligible && req.accepts_offers && (req.status === 'open' || req.status === 'offered');
  const myExisting = offersForRequest(req.id).find(o => o.provider_id === providerId && o.status === 'active');
  const competingOffers = offersForRequest(req.id).filter(o => o.status === 'active' && o.provider_id !== providerId).length;

  const doSubmit = () => {
    setError(null);
    setBusy(true);
    const res = submitOffer({
      request_id: req.id,
      provider_id: providerId,
      price: parseInt(price, 10),
      message,
      availability,
      eta_min: eta ? parseInt(eta, 10) : null,
      includes_parts: includesParts,
    });
    setBusy(false);
    if (!res.ok) { setError(res.error ?? 'Erreur inattendue.'); return; }
    setSuccess(true);
    setTimeout(() => navigate('/mechanic/inbox'), 1200);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <IfixMascot state={canOffer ? 'connecting' : 'concerned'} size={36} />
        <div className="flex-1">
          <h2 className="font-bold text-slate-900">{req.category_label}</h2>
          <p className="text-xs text-slate-500">Reçue {new Date(req.created_at).toLocaleString('fr-MA')} • expire à {new Date(req.expires_at).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <StatusBadge status={req.status === 'offered' ? 'success' : 'info'} label={req.status === 'offered' ? 'Offres en cours' : 'Ouverte'} />
      </div>

      <Card className="p-4 space-y-2">
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{req.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>🚗 {req.vehicle_summary}</span>
          <span>📍 {req.location.split(',')[0]} (adresse exacte partagée après acceptation)</span>
          <span>🕐 {req.preferred_time}</span>
          <span>🔧 {req.service_mode === 'at_home' ? 'Chez le client' : req.service_mode === 'roadside' ? 'Assistance route' : 'Au garage'}</span>
          <span>⚡ {req.urgency === 'urgent' ? 'Urgent' : req.urgency === 'low' ? 'Planifié' : 'Standard'}</span>
          <span>{req.budget != null ? `💰 Budget indicatif : ${req.budget} MAD` : '💰 Pas de budget indiqué'}</span>
          {req.source === 'ai_assisted' && <span className="col-span-2 text-teal-700">🤖 Demande orientée par IFIX AI — les pistes du client ne sont pas des diagnostics confirmés.</span>}
        </div>
      </Card>

      {!eligible && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-800">Vous n’êtes pas éligible à cette demande (catégorie, statut de vérification ou disponibilité). Vous ne pouvez pas soumettre d’offre.</p>
        </Card>
      )}
      {eligible && !canOffer && (
        <Card className="p-4 border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-600">Cette demande n’accepte plus d’offres (acceptée, annulée ou expirée).</p>
        </Card>
      )}

      {canOffer && !myExisting && (
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-slate-900 text-sm">Votre offre</h3>
          {competingOffers > 0 && <p className="text-xs text-slate-500">{competingOffers} autre(s) offre(s) déjà envoyée(s) — restez compétitif.</p>}
          <div>
            <label className="text-xs font-medium text-slate-600">Prix total (MAD) *</label>
            <input type="number" min={50} max={20000} value={price} onChange={e => setPrice(e.target.value)}
              placeholder="ex : 350" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            <p className="text-[11px] text-slate-400 mt-1">Entre 50 et 20 000 MAD. Validation aussi côté serveur.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Description de l’intervention *</label>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Ex : Remplacement batterie 60Ah + test alternateur, pièce incluse."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Disponibilité</label>
              <select value={availability} onChange={e => setAvailability(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white">
                {AVAILABILITY_OPTIONS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Temps estimé (min, optionnel)</label>
              <input type="number" min={10} max={480} value={eta} onChange={e => setEta(e.target.value)}
                placeholder="ex : 45" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={includesParts} onChange={e => setIncludesParts(e.target.checked)} className="rounded" />
            Pièces incluses dans le prix
          </label>
          {provider && (
            <p className="text-[11px] text-slate-400">Garantie proposée : {provider.warranty_days} jours • Note : {provider.rating_avg.toFixed(1)}★ ({provider.jobs_completed} jobs)</p>
          )}
          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
          <Button fullWidth loading={busy} disabled={!price || !message} onClick={doSubmit}>Envoyer mon offre</Button>
        </Card>
      )}

      {myExisting && (
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Votre offre : {myExisting.price} MAD</p>
            <p className="text-xs text-slate-500">{myExisting.message.slice(0, 80)} • {myExisting.availability}</p>
          </div>
          <StatusBadge status="info" label="En attente du client" />
        </Card>
      )}

      {success && (
        <Card className="p-4 bg-emerald-50 border-emerald-200 flex items-center gap-2">
          <IfixMascot state="success" size={28} />
          <p className="text-sm text-emerald-800 font-medium">Offre transmise au client ✓</p>
        </Card>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/mechanic/inbox')}>← Retour inbox</Button>
      </div>
    </div>
  );
}

export default RequestOfferDetail;
