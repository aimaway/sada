import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { portalApi } from '../shared/apiClient';
import {
  ArrowLeft, Loader2, Users, Search, Send, Inbox, CheckCircle2, XCircle,
  AlertCircle, MapPin, Star, Ban, Crown, RefreshCw,
} from 'lucide-react';

// Partenariats vendeur — branché sur le backend réel (service premium) :
//   GET  /api/v1/partnerships/entitlement        (abonnement requis ?)
//   GET  /api/v1/partnerships/discover?q=&       (pros éligibles à proximité)
//   POST /api/v1/partnerships/invite             (invitation ciblée + message)
//   GET  /api/v1/partnerships/invitations        (envoyées + reçues)
//   GET  /api/v1/partnerships/partners           (liens acceptés)
//   POST /api/v1/partnerships/invitations/{id}/respond|withdraw
// Un clic d'invitation ne crée JAMAIS un lien "accepté" côté client : le statut
// vient uniquement du serveur (l'invité doit accepter).

type Ent = { allowed: boolean; source?: string; reason?: string; role?: string };
type DiscItem = { id: number; name: string; city?: string; type?: string; rating_avg?: number; rating_count?: number; specialties?: string[]; distance_km?: number | null };
type Inv = { id: number; other_name: string; status: string; direction: 'sent' | 'received'; message?: string; created_at?: string };
type Partner = { id: number; name: string; city?: string; since?: string };

const detailOf = (e: unknown) => (e as any)?.detail;

export const SellerPartnershipsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'discover' | 'invitations' | 'partners'>('discover');
  const [ent, setEnt] = useState<Ent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const [q, setQ] = useState('');
  const [results, setResults] = useState<DiscItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviteFor, setInviteFor] = useState<DiscItem | null>(null);
  const [message, setMessage] = useState('');
  const [inviting, setInviting] = useState(false);

  const [invs, setInvs] = useState<Inv[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    (async () => {
      try { setEnt(await portalApi<Ent>('/api/v1/partnerships/entitlement')); }
      catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const search = async () => {
    setSearching(true); setError(null);
    try {
      const r = await portalApi<{ items: DiscItem[] }>(`/api/v1/partnerships/discover?q=${encodeURIComponent(q)}&limit=20`);
      setResults(r.items);
    } catch (e: any) {
      const d = detailOf(e);
      setError(typeof d === 'string' ? d : e.message);
      setResults([]);
    } finally { setSearching(false); }
  };

  const loadInvs = async () => {
    try {
      const r = await portalApi<any>('/api/v1/partnerships/invitations');
      const sent: Inv[] = (r.sent || []).map((i: any) => ({ ...i, direction: 'sent' as const }));
      const received: Inv[] = (r.received || []).map((i: any) => ({ ...i, direction: 'received' as const }));
      setInvs([...received, ...sent]);
    } catch (e: any) { setToast({ kind: 'err', text: e.message }); }
  };
  const loadPartners = async () => {
    try { const r = await portalApi<{ items: Partner[] }>('/api/v1/partnerships/partners'); setPartners(r.items); }
    catch (e: any) { setToast({ kind: 'err', text: e.message }); }
  };
  useEffect(() => { if (tab === 'invitations') loadInvs(); if (tab === 'partners') loadPartners(); }, [tab]);

  const sendInvite = async () => {
    if (!inviteFor) return;
    setInviting(true);
    try {
      await portalApi('/api/v1/partnerships/invite', { method: 'POST', body: { target_provider_id: inviteFor.id, message } });
      setInviteFor(null); setMessage('');
      setToast({ kind: 'ok', text: 'Invitation envoyée. En attente de réponse du professionnel.' });
      setTab('invitations');
    } catch (e: any) {
      const d = detailOf(e);
      setToast({ kind: 'err', text: typeof d === 'string' ? d : e.message });
    } finally { setInviting(false); }
  };

  const respond = async (id: number, accept: boolean) => {
    try {
      await portalApi(`/api/v1/partnerships/invitations/${id}/respond`, { method: 'POST', body: { accept } });
      setToast({ kind: 'ok', text: accept ? 'Partenariat accepté.' : 'Invitation refusée.' });
      loadInvs();
    } catch (e: any) { setToast({ kind: 'err', text: e.message }); }
  };
  const withdraw = async (id: number) => {
    try {
      await portalApi(`/api/v1/partnerships/invitations/${id}/withdraw`, { method: 'POST', body: {} });
      setToast({ kind: 'ok', text: 'Invitation retirée.' });
      loadInvs();
    } catch (e: any) { setToast({ kind: 'err', text: e.message }); }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-2 text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /> Chargement…</div>;
  }

  const blocked = ent && !ent.allowed;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 py-3 border-b sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button onClick={() => navigate('/seller/portal')} className="p-1.5" aria-label="Retour"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="font-semibold text-slate-800 flex-1 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Partenaires</h1>
          {ent?.allowed && <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 inline-flex items-center gap-1"><Crown className="w-3 h-3" /> Premium</span>}
        </div>
        {!blocked && (
          <div className="flex gap-1 max-w-3xl mx-auto mt-2">
            {(['discover', 'invitations', 'partners'] as const).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tab === k ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {k === 'discover' ? 'Découvrir' : k === 'invitations' ? 'Invitations' : 'Mes partenaires'}
              </button>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="max-w-3xl mx-auto px-4 pt-3">
          <div className={`rounded-xl px-3 py-2 text-sm flex items-start gap-2 ${toast.kind === 'ok' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {toast.kind === 'ok' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span className="flex-1">{toast.text}</span>
            <button onClick={() => setToast(null)}><XCircle className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
        {/* Verrou premium — message réel du serveur, pas de faux partenariat */}
        {blocked ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <Crown className="w-12 h-12 text-violet-400 mx-auto mb-3" />
            <h2 className="font-bold text-slate-800">Service premium requis</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">{ent?.reason || 'Les partenariats entre professionnels sont réservés aux abonnements éligibles.'}</p>
            <button onClick={() => navigate('/seller/plans')} className="mt-4 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">Voir les abonnements</button>
          </div>
        ) : tab === 'discover' ? (
          <>
            <form onSubmit={(e) => { e.preventDefault(); search(); }} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, spécialité…" className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={searching} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2">
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Rechercher
              </button>
            </form>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
            {!error && results.length === 0 && !searching && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">Aucun professionnel éligible à proximité</p>
                <p className="text-xs text-slate-400 mt-1">La recherche s’appuie sur votre ville/zone de service et les données publiques des profils.</p>
              </div>
            )}
            {results.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    {p.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</span>}
                    {typeof p.rating_avg === 'number' && <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{p.rating_avg.toFixed(1)} ({p.rating_count ?? 0})</span>}
                    {typeof p.distance_km === 'number' && <span>• à {p.distance_km.toFixed(0)} km</span>}
                  </p>
                  {(p.specialties?.length ?? 0) > 0 && <p className="text-[11px] text-slate-400 mt-1 truncate">{p.specialties!.join(', ')}</p>}
                </div>
                <button onClick={() => setInviteFor(p)} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 inline-flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Inviter</button>
              </div>
            ))}
          </>
        ) : tab === 'invitations' ? (
          invs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Aucune invitation</p>
            </div>
          ) : (
            invs.map((i) => (
              <div key={`${i.direction}-${i.id}`} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{i.other_name}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${i.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : i.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{i.status}{i.direction === 'sent' ? ' · envoyée' : ' · reçue'}</span>
                </div>
                {i.message && <p className="text-xs text-slate-500 mt-1 italic">« {i.message} »</p>}
                <div className="flex gap-2 mt-3">
                  {i.status === 'pending' && i.direction === 'received' && (
                    <>
                      <button onClick={() => respond(i.id, true)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700">Accepter</button>
                      <button onClick={() => respond(i.id, false)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"><Ban className="w-3 h-3" /> Refuser</button>
                    </>
                  )}
                  {i.status === 'pending' && i.direction === 'sent' && (
                    <button onClick={() => withdraw(i.id)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Retirer</button>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          partners.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Aucun partenaire actif</p>
              <p className="text-xs text-slate-400 mt-1">Un partenariat n’existe qu’après acceptation côté serveur.</p>
            </div>
          ) : (
            partners.map((pt) => (
              <div key={pt.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{pt.name}</p>
                  <p className="text-xs text-slate-400">{pt.city || ''}{pt.since ? ` • partenaire depuis ${String(pt.since).slice(0, 10)}` : ''}</p>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Modale d'invitation */}
      {inviteFor && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setInviteFor(null)}>
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800">Inviter {inviteFor.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Le professionnel recevra une notification et devra accepter pour que le partenariat devienne actif.</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Message (optionnel) — ex : proposition de référencement réciproque…" className="w-full mt-3 p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-2 mt-3">
              <button onClick={sendInvite} disabled={inviting} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Envoyer l’invitation
              </button>
              <button onClick={() => setInviteFor(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPartnershipsScreen;
