import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button } from '../shared/components';
import { IfixMascot } from './IfixMascot';
import {
  startSession, sendMessage, getSession, sessionsForCustomer, remainingFreeSessions,
  recommendedProviders, recordConsent, shareSummary, attachRequestToSession,
  FREE_SESSION_ALLOWANCE, IfixSession, IfixMascotState,
} from './ifixAi';
import { createRequest, relevanceReason } from './ifixStore';
import { mockCategories, mockVehicles } from '../shared/unifiedMockData';
import {
  ArrowLeft, Send, ShieldCheck, Share2, Wrench, Sparkles, Lock, CheckCircle2, AlertTriangle, Bot,
} from 'lucide-react';

// ============================================
// IFIX AI — DIAGNOSTIC ASSISTANT PAGE (v2)
// ============================================
// Request-first philosophy: AI is optional guidance. Mascot states drive the
// conversation UI. Entitlement (3 free sessions), consent-gated sharing and
// grounded provider recommendations are all handled in ifixAi.ts / ifixStore.ts.

const QUICK_PROMPTS = [
  'Ma batterie ne démarre plus',
  'Mes freins grincent',
  'Voyant température allumé',
  'Besoin d’une vidange',
];

export function IfixAssistantPage() {
  const navigate = useNavigate();
  const { user, language } = useApp();
  const customerId = user?.id ?? 'u1';

  const vehicles = mockVehicles.filter(v => v.owner_id === customerId);
  const [vehicleId, setVehicleId] = useState<string>(vehicles[0]?.id ?? '');
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const vehicleSummary = selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}` : 'Mon véhicule';

  const [session, setSession] = useState<IfixSession | null>(() => {
    const existing = sessionsForCustomer(customerId).find(s => s.status === 'active');
    return existing ?? null;
  });
  const [input, setInput] = useState('');
  const [mascotState, setMascotState] = useState<IfixMascotState>('welcome');
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [consentFlow, setConsentFlow] = useState<'idle' | 'choosing' | 'granting'>('idle');
  const remaining = remainingFreeSessions(customerId);
  const history = sessionsForCustomer(customerId).filter(s => s.id !== session?.id);

  useEffect(() => {
    if (session && session.status === 'active') setMascotState('listening');
  }, [session?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const providers = useMemo(() => (session && session.status === 'completed' ? recommendedProviders(session) : []), [session]);

  const beginSession = () => {
    setError(null);
    const res = startSession(customerId, vehicleSummary);
    if (!res.ok) { setGateOpen(true); return; }
    setSession(res.session);
    setMascotState('welcome');
  };

  const send = (text?: string) => {
    const body = (text ?? input).trim();
    if (!body || !session) return;
    setInput('');
    setThinking(true);
    setMascotState('thinking');
    // Small delay purely for perceived responsiveness of the "thinking" state
    setTimeout(() => {
      const res = sendMessage(session.id, body);
      setThinking(false);
      if (!res.ok) { setError(res.error ?? 'Erreur inattendue.'); return; }
      setSession(res.session ?? null);
      setMascotState(res.reply?.safety ? 'safety' : res.reply?.done ? 'success' : 'explaining');
    }, 600);
  };

  const createFromSession = (providerId?: string) => {
    if (!session) return;
    const categoryId = session.category_guess ?? '1';
    const label = mockCategories.find(c => c.id === categoryId)?.name_fr ?? 'Diagnostic';
    const res = createRequest({
      customer_id: customerId,
      customer_name: user?.full_name ?? 'Client SADA',
      vehicle_summary: vehicleSummary,
      category_id: categoryId,
      description: `[Demande créée via IFIX AI — orientation informationnelle, diagnostic non confirmé] ${session.messages.filter(m => m.role === 'user').map(m => m.text).join(' | ').slice(0, 300)}`,
      urgency: session.safety_flag ? 'urgent' : 'normal',
      preferred_time: 'Dès que possible',
      location: 'Casablanca',
      service_mode: session.safety_flag ? 'roadside' : 'at_garage',
      budget: null,
      ai_session_id: session.id,
    });
    if (!res.ok) { setError(res.error ?? 'Erreur de création.'); return; }
    attachRequestToSession(session.id, res.request!.id);
    setMascotState('connecting');
    navigate('/customer/offers');
  };

  const onConsent = (decision: 'granted' | 'declined') => {
    if (!session) return;
    recordConsent(session.id, decision);
    setSession(getSession(session.id) ?? null);
    setConsentFlow('idle');
    if (decision === 'declined') setMascotState('concerned');
  };

  const onShareWith = (providerId: string) => {
    if (!session) return;
    const res = shareSummary(session.id, providerId);
    if (!res.ok) { setError(res.error ?? 'Partage impossible.'); return; }
    setSession(res.session ?? null);
    setMascotState('success');
    createFromSession(providerId);
  };

  const fr = language !== 'ar';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/customer/home')} className="p-2 hover:bg-slate-100 rounded-xl" aria-label="Retour">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <IfixMascot state="idle" size={34} />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-slate-900 leading-tight">IFIX AI</h1>
            <p className="text-xs text-slate-500 truncate">{fr ? 'Votre copilote auto & moto — guide optionnel, jamais obligatoire' : 'Copilote optionnel'}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${remaining > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {remaining}/{FREE_SESSION_ALLOWANCE} {fr ? 'sessions offertes' : 'sessions'}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /><div>{error}</div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* No active session -> welcome */}
        {!session && (
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3"><IfixMascot state="welcome" size={120} wordmark /></div>
            <p className="text-sm font-medium text-emerald-700 mb-1">{fr ? '« Un problème ? IFIX AI vous guide. »' : 'Ask IFIX AI before you fix!'}</p>
            <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
              {fr
                ? 'Décrivez le symptôme, je pose des questions et je vous oriente — sans jamais remplacer l’œil d’un professionnel. Vous pouvez aussi créer une demande directement.'
                : 'Optional guidance only.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white">
                {vehicles.length === 0 && <option value="">Aucun véhicule enregistré</option>}
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} {v.year}</option>)}
              </select>
              <Button onClick={beginSession}><Sparkles className="w-4 h-4 mr-1" />{fr ? 'Commencer une session' : 'Start'}</Button>
            </div>
            <button onClick={() => navigate('/customer/new-request')} className="text-sm text-slate-600 underline hover:text-slate-900">
              {fr ? 'Je sais ce dont j’ai besoin → créer une demande directement' : 'Skip AI'}
            </button>
            {remaining === 0 && (
              <p className="mt-3 text-xs text-amber-700">{fr ? 'Quota de sessions gratuites épuisé — une nouvelle session nécessitera IFIX Premium.' : 'Premium required.'}</p>
            )}
          </Card>
        )}

        {/* Conversation */}
        {session && (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center gap-3">
              <IfixMascot state={mascotState} size={44} />
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">IFIX AI</p>
                <p className="text-slate-300 text-xs">
                  {session.vehicle_summary} • {session.status === 'active' ? (fr ? 'session en cours' : 'active') : (fr ? 'terminée' : 'completed')}
                </p>
              </div>
              {session.safety_flag && <span className="text-[10px] bg-red-500/20 text-red-200 border border-red-400/40 rounded-full px-2 py-0.5 font-semibold">⚠ {fr ? 'SÉCURITÉ' : 'SAFETY'}</span>}
            </div>

            <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto bg-slate-50">
              {session.messages.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role === 'ifix' && <IfixMascot state={m.mascot ?? 'idle'} size={30} className="mt-1 shrink-0" />}
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                    m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' :
                    m.mascot === 'safety' ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm' :
                    'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}>{m.text}</div>
                </div>
              ))}
              {thinking && (
                <div className="flex gap-2 items-center text-xs text-slate-500">
                  <IfixMascot state="thinking" size={28} />
                  <span className="animate-pulse">{fr ? 'IFIX analyse vos symptômes…' : 'analyzing…'}</span>
                </div>
              )}
            </div>

            {/* Actions when session completed */}
            {session.status === 'completed' && (
              <div className="border-t border-slate-100 p-4 space-y-3 bg-white">
                {/* Consent block — BEFORE any recommendation sharing */}
                {session.consent === 'pending' && consentFlow !== 'granting' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-1"><Lock className="w-4 h-4 text-emerald-600" />{fr ? 'Confidentialité de votre échange' : 'Privacy'}</div>
                    <p className="text-xs text-slate-600 mb-2">
                      {fr
                        ? 'Votre conversation avec IFIX AI reste privée. Avec votre accord explicite, un résumé sera envoyé au professionnel choisi : véhicule, symptômes rapportés, pistes NON confirmées et consignes de sécurité — pas la conversation complète.'
                        : 'Private by default.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="!text-xs !py-1.5" onClick={() => onConsent('granted')}>
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />{fr ? 'J’autorise le résumé' : 'Allow summary'}
                      </Button>
                      <Button variant="ghost" className="!text-xs !py-1.5" onClick={() => onConsent('declined')}>
                        {fr ? 'Rester privé' : 'Keep private'}
                      </Button>
                    </div>
                  </div>
                )}
                {session.consent === 'granted' && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />{fr ? 'Consentement accordé — le résumé ne sera envoyé que si vous choisissez un professionnel ci-dessous.' : 'Consent granted.'}</p>
                )}
                {session.consent === 'declined' && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5"><Lock className="w-4 h-4" />{fr ? 'Conversation gardée privée. Vous pouvez quand même créer une demande classique — elle ne contiendra que votre description du problème.' : 'Kept private.'}</p>
                )}

                {/* Recommended professionals (grounded, real data) */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-800"><Bot className="w-4 h-4 text-teal-600" />{fr ? `Professionnels pertinents (${providers.length})` : `Providers (${providers.length})`}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {providers.map(p => (
                      <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                          {p.verification_status === 'approved' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">{relevanceReason(p, session.category_guess ?? '1')}</p>
                        <div className="flex gap-2">
                          <button
                            disabled={session.consent !== 'granted'}
                            onClick={() => onShareWith(p.id)}
                            title={session.consent !== 'granted' ? (fr ? 'Autorisez d’abord le partage du résumé' : 'Consent first') : undefined}
                            className="flex-1 text-xs rounded-lg bg-emerald-600 text-white py-1.5 px-2 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          >
                            <Share2 className="w-3 h-3" />{fr ? 'Choisir + résumé' : 'Choose'}
                          </button>
                          <button
                            onClick={() => { createFromSession(); }}
                            className="text-xs rounded-lg border border-slate-200 text-slate-600 py-1.5 px-2 hover:bg-slate-50"
                          >
                            {fr ? 'Demande générale' : 'Marketplace'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button onClick={() => createFromSession()}><Wrench className="w-4 h-4 mr-1" />{fr ? 'Créer la demande de service' : 'Create request'}</Button>
                  <Button variant="ghost" onClick={() => navigate('/customer/home')}>{fr ? 'Revenir à l’accueil' : 'Back'}</Button>
                </div>
              </div>
            )}

            {/* Input */}
            {session.status === 'active' && (
              <div className="border-t border-slate-100 p-3 bg-white">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {QUICK_PROMPTS.map(q => (
                    <button key={q} onClick={() => send(q)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-2.5 py-1">{q}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder={fr ? 'Décrivez ce que vous observez…' : 'Describe the symptoms…'}
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <Button onClick={() => send()} disabled={!input.trim() || thinking}><Send className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* History */}
        {history.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">{fr ? 'Historique des diagnostics' : 'History'}</h3>
            <div className="space-y-2">
              {history.slice(0, 5).map(h => (
                <button
                  key={h.id}
                  onClick={() => { setSession(h); setMascotState(h.safety_flag ? 'safety' : 'explaining'); }}
                  className="w-full text-left flex items-center gap-3 rounded-xl border border-slate-100 hover:border-emerald-200 p-3"
                >
                  <IfixMascot state={h.safety_flag ? 'safety' : h.status === 'completed' ? 'success' : 'idle'} size={30} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{h.vehicle_summary} — {mockCategories.find(c => c.id === h.category_guess)?.name_fr ?? fr ? 'Diagnostic' : 'AI'}</p>
                    <p className="text-xs text-slate-500">{new Date(h.created_at).toLocaleString('fr-MA')} • {h.consent === 'granted' ? (fr ? 'partage autorisé' : 'shared') : fr ? 'privé' : 'private'}</p>
                  </div>
                  {h.request_id && <span className="text-[10px] bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">{fr ? 'demande liée' : 'linked'}</span>}
                </button>
              ))}
            </div>
          </Card>
        )}

        <p className="text-[11px] text-slate-400 text-center px-4">
          {fr
            ? 'IFIX AI fournit des informations générales. Ce n’est ni un mécanicien certifié ni un diagnostic garanti. En cas de doute sur la sécurité du véhicule, arrêtez de conduire et consultez un professionnel.'
            : 'Informational assistant only.'}
        </p>
      </div>

      {/* Upgrade gate (placeholder — no real charges in dev) */}
      {gateOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setGateOpen(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-3"><IfixMascot state="concerned" size={90} /></div>
            <h3 className="font-bold text-slate-900 mb-1">{fr ? 'Vos 3 sessions gratuites sont utilisées' : 'Free allowance used'}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {fr
                ? 'IFIX Premium (illimité) arrive bientôt — aucun paiement n’est activé en phase de test. Votre historique et vos résultats restent accessibles, et les conseils de sécurité restent toujours disponibles gratuitement.'
                : 'IFIX Premium coming soon.'}
            </p>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => { setGateOpen(false); navigate('/customer/subscription'); }}>{fr ? 'Voir IFIX Premium (bientôt)' : 'See Premium'}</Button>
              <Button variant="outline" className="w-full" onClick={() => { setGateOpen(false); navigate('/customer/new-request'); }}>{fr ? 'Créer une demande sans IA' : 'Request without AI'}</Button>
              <button onClick={() => { setGateOpen(false); }} className="text-xs text-slate-400 hover:text-slate-600">{fr ? 'Fermer' : 'Close'}</button>
            </div>
            <p className="mt-3 text-[10px] text-slate-400">{fr ? 'Placeholder d’abonnement — facturation non activée en développement.' : 'Billing not enabled.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default IfixAssistantPage;
