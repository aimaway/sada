// ============================================
// MARKETPLACE — CLIENT-SIDE PERSISTENT STORE (demo/test phase)
// ============================================
// Single source of truth on the frontend for requests / offers / jobs /
// notifications. Persisted in localStorage so state survives reloads and is
// shared across portal pages (customer request -> offers -> provider inbox ->
// accept -> job). When the FastAPI endpoints are wired in, this module becomes
// the offline fallback: swap loadState/saveState calls for API calls without
// touching the UI components. Backend mirror: backend/app/api/marketplace.py.
//
// Test data rule: synthetic records keep ids from the unified mock dataset
// (r1/o1/u_m1...) and demo users stay in the reserved +2126000000XX range.

import { loadState, saveState } from '../shared/portalStore';
import { mockUsers, mockRequests, mockOffers as unifiedMockOffers, mockCategories } from '../shared/unifiedMockData';

export type RequestStatus = 'open' | 'offered' | 'accepted' | 'cancelled' | 'expired' | 'completed';
export type OfferStatus = 'active' | 'accepted' | 'withdrawn' | 'expired' | 'rejected';

export type RequestSource = 'customer' | 'ai_assisted';

export interface MarketplaceRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  vehicle_summary: string;
  category_id: string;
  category_label: string;
  description: string;
  urgency: 'low' | 'normal' | 'urgent';
  preferred_time: string;
  location: string;
  service_mode: 'at_garage' | 'at_home' | 'roadside';
  budget: number | null;
  status: RequestStatus;
  accepts_offers: boolean;
  eligible_provider_ids: string[];
  offer_count: number;
  accepted_offer_id: string | null;
  ai_session_id: string | null;
  source: RequestSource;
  created_at: string;
  expires_at: string;
}

export interface ProviderOffer {
  id: string;
  request_id: string;
  provider_id: string;
  provider_name: string;
  price: number;
  message: string;
  availability: string;
  eta_min: number | null;
  warranty_days: number;
  includes_parts: boolean;
  rating: number;
  jobs_done: number;
  verified: boolean;
  status: OfferStatus;
  created_at: string;
}

export interface AcceptedJob {
  id: string;
  request_id: string;
  offer_id: string;
  customer_id: string;
  provider_id: string;
  agreed_price: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface PortalNotification {
  id: string;
  audience: 'customer' | 'provider';
  user_id: string;
  title: string;
  body: string;
  kind: 'new_request' | 'new_offer' | 'offer_accepted' | 'offer_declined' | 'request_cancelled' | 'system';
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  city: string;
  categories: string[];
  vehicle_types: string[];
  rating_avg: number;
  jobs_completed: number;
  response_time_min: number;
  is_online: boolean;
  verification_status: string;
  service_radius_km: number;
  specialties: string[];
  warranty_days: number;
}

function buildProviders(): ProviderInfo[] {
  const mechanics = (mockUsers as any).mechanics || [];
  return mechanics.map((m: any) => ({
    id: m.id,
    name: m.full_name,
    city: m.profile?.city ?? 'Casablanca',
    categories: m.profile?.categories ?? [],
    vehicle_types: ['car', 'motorcycle'],
    rating_avg: m.profile?.rating_avg ?? 0,
    jobs_completed: m.profile?.jobs_completed ?? 0,
    response_time_min: m.profile?.response_time_min ?? 10,
    is_online: !!m.profile?.is_online,
    verification_status: m.profile?.verification_status ?? 'pending',
    service_radius_km: m.profile?.service_radius_km ?? 10,
    specialties: m.profile?.specialties ?? [],
    warranty_days: m.profile?.warranty_days ?? 30,
  }));
}

export const providers: ProviderInfo[] = buildProviders();

export function getProvider(id: string): ProviderInfo | undefined {
  return providers.find(p => p.id === id);
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '1': ['batterie', 'démarr', 'demarr', 'électricité', 'electricite', 'charge', 'alternateur'],
  '2': ['vidange', 'huile', 'oil', 'entretien', 'filtre'],
  '3': ['frein', 'freinage', 'plaquette', 'disque', 'direction'],
  '4': ['pneu', 'roue', 'crève', 'creve', 'pression'],
};

/**
 * Eligibility rules (mirrored on the backend in app/services/marketplace.py):
 *  - approved provider only
 *  - provider covers the requested category
 *  - urgent requests go only to online providers
 */
// Scenario slugs (src/data/scenarios.ts) map onto the canonical service
// categories so NewRequestEnhanced can create real marketplace requests.
const SCENARIO_CATEGORY: Record<string, string> = {
  batt: '1', tire: '4', sos: '1', vid: '2', frein: '3', clim: '2', diag: '2',
  moto: '4', flotte: '2', inspect: '2', proche: '2',
};

export function categoryForScenarioSlug(slug?: string | null, description = ''): string {
  if (slug && SCENARIO_CATEGORY[slug]) return SCENARIO_CATEGORY[slug];
  const lower = description.toLowerCase();
  let best = '2'; let bestHits = 0;
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    const hits = kws.filter(k => lower.includes(k)).length;
    if (hits > bestHits) { best = cat; bestHits = hits; }
  }
  return best;
}

/** Keyword-based category guess used by ExplainProblem free-text flow. */
export function categoryFromDescription(description: string): string {
  return categoryForScenarioSlug(null, description);
}

export function computeEligibleProviders(categoryId: string, urgency: string): string[] {
  return providers
    .filter(p => p.verification_status === 'approved')
    .filter(p => p.categories.includes(categoryId))
    .filter(p => (urgency === 'urgent' ? p.is_online : true))
    .map(p => p.id);
}

export function rankProvidersForCategory(categoryId: string, limit = 6): ProviderInfo[] {
  const keywords = CATEGORY_KEYWORDS[categoryId] ?? [];
  return providers
    .filter(p => p.verification_status === 'approved')
    .filter(p => p.categories.includes(categoryId) || keywords.some(k => p.specialties.join(' ').toLowerCase().includes(k)))
    .sort((a, b) => b.rating_avg * Math.log(b.jobs_completed + 2) - a.rating_avg * Math.log(a.jobs_completed + 2))
    .slice(0, limit);
}

export function relevanceReason(p: ProviderInfo, categoryId: string): string {
  const label = mockCategories.find(c => c.id === categoryId)?.name_fr ?? 'ce service';
  const bits: string[] = [];
  if (p.categories.includes(categoryId)) bits.push(`couvre « ${label} »`);
  if (p.specialties.length) bits.push(`spécialités : ${p.specialties.slice(0, 2).join(', ')}`);
  if (p.rating_avg > 0) bits.push(`${p.rating_avg.toFixed(1)}★ (${p.jobs_completed} jobs)`);
  if (p.is_online) bits.push('en ligne');
  bits.push(`${p.city}`);
  return bits.join(' • ');
}

// ---------- State ----------

const K_REQUESTS = 'tomobily.market.requests.v1';
const K_OFFERS = 'tomobily.market.offers.v1';
const K_JOBS = 'tomobily.market.jobs.v1';
const K_NOTIFS = 'tomobily.market.notifications.v1';

function seedRequests(): MarketplaceRequest[] {
  const now = Date.now();
  return (mockRequests as any[]).map((r, idx) => ({
    id: r.id,
    customer_id: r.customer_id,
    customer_name: 'Amine Khalid',
    vehicle_summary: 'Dacia Logan 2019',
    category_id: r.category_id,
    category_label: mockCategories.find(c => c.id === r.category_id)?.name_fr ?? 'Service',
    description: r.description,
    urgency: idx === 1 ? ('urgent' as const) : ('normal' as const),
    preferred_time: 'Dès que possible',
    location: r.address,
    service_mode: 'at_home' as const,
    budget: r.customer_price ?? null,
    status: r.status as RequestStatus,
    accepts_offers: true,
    eligible_provider_ids: computeEligibleProviders(r.category_id, idx === 1 ? 'urgent' : 'normal'),
    offer_count: 0,
    accepted_offer_id: null,
    ai_session_id: null,
    source: 'customer' as const,
    created_at: new Date(now - (idx + 1) * 5 * 60000).toISOString(),
    expires_at: new Date(now + 25 * 60000).toISOString(),
  }));
}

function seedOffers(): ProviderOffer[] {
  return (unifiedMockOffers as any[]).map(o => {
    const p = getProvider(o.mechanic_id);
    return {
      id: o.id,
      request_id: o.request_id,
      provider_id: o.mechanic_id,
      provider_name: p?.name ?? o.mechanic_id,
      price: o.price,
      message: o.message,
      availability: `Dans ${o.estimated_arrival_min} min`,
      eta_min: o.estimated_arrival_min,
      warranty_days: p?.warranty_days ?? 30,
      includes_parts: true,
      rating: p?.rating_avg ?? 4.5,
      jobs_done: p?.jobs_completed ?? 0,
      verified: p?.verification_status === 'approved',
      status: 'active' as OfferStatus,
      created_at: o.created_at,
    };
  });
}

export interface MarketState {
  requests: MarketplaceRequest[];
  offers: ProviderOffer[];
  jobs: AcceptedJob[];
  notifications: PortalNotification[];
}

let cache: MarketState | null = null;

export function marketState(): MarketState {
  if (cache) return cache;
  const requests = loadState<MarketplaceRequest[]>(K_REQUESTS, []);
  const offers = loadState<ProviderOffer[]>(K_OFFERS, []);
  const jobs = loadState<AcceptedJob[]>(K_JOBS, []);
  const notifs = loadState<PortalNotification[]>(K_NOTIFS, []);
  if (requests.length === 0 && offers.length === 0) {
    cache = { requests: seedRequests(), offers: seedOffers(), jobs: [], notifications: [] };
    persist(cache);
  } else {
    cache = { requests, offers, jobs, notifications: notifs };
  }
  return cache;
}

function persist(s: MarketState) {
  saveState(K_REQUESTS, s.requests);
  saveState(K_OFFERS, s.offers);
  saveState(K_JOBS, s.jobs);
  saveState(K_NOTIFS, s.notifications);
  cache = s;
  notifyListeners();
}

function nextId(prefix: string, existing: string[]): string {
  let n = 1;
  while (existing.some(id => id === `${prefix}${n}`)) n += 1;
  return `${prefix}${n}`;
}

function pushNotification(s: MarketState, n: Omit<PortalNotification, 'id' | 'read' | 'created_at'>) {
  s.notifications.unshift({
    ...n,
    id: `nt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    created_at: new Date().toISOString(),
  });
  s.notifications = s.notifications.slice(0, 100);
}

// ---------- Public API (mirrors the REST surface) ----------

export function listRequestsForCustomer(customerId: string): MarketplaceRequest[] {
  return marketState().requests.filter(r => r.customer_id === customerId).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listVisibleRequestsForProvider(providerId: string): MarketplaceRequest[] {
  const s = marketState();
  return s.requests
    .filter(r => r.eligible_provider_ids.includes(providerId))
    .filter(r => r.status === 'open' || r.status === 'offered')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getRequest(id: string): MarketplaceRequest | undefined {
  return marketState().requests.find(r => r.id === id);
}

export function offersForRequest(requestId: string): ProviderOffer[] {
  return marketState().offers.filter(o => o.request_id === requestId).sort((a, b) => a.price - b.price);
}

export function offersFromProvider(providerId: string): ProviderOffer[] {
  return marketState().offers.filter(o => o.provider_id === providerId).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function jobsForCustomer(customerId: string): AcceptedJob[] {
  return marketState().jobs.filter(j => j.customer_id === customerId);
}

export function jobsForProvider(providerId: string): AcceptedJob[] {
  return marketState().jobs.filter(j => j.provider_id === providerId);
}

export function createRequest(input: {
  customer_id: string;
  customer_name: string;
  vehicle_summary: string;
  category_id: string;
  description: string;
  urgency: 'low' | 'normal' | 'urgent';
  preferred_time: string;
  location: string;
  service_mode: 'at_garage' | 'at_home' | 'roadside';
  budget: number | null;
  ai_session_id?: string | null;
  source?: RequestSource;
}): { ok: boolean; error?: string; request?: MarketplaceRequest } {
  const s = marketState();
  if (!input.description || input.description.trim().length < 10) return { ok: false, error: 'Description trop courte (min. 10 caractères).' };
  if (!input.category_id) return { ok: false, error: 'Catégorie de service requise.' };
  const eligible = computeEligibleProviders(input.category_id, input.urgency);
  if (eligible.length === 0) return { ok: false, error: 'Aucun professionnel éligible pour ce service pour le moment.' };
  const req: MarketplaceRequest = {
    id: nextId('r-', s.requests.map(r => r.id)),
    customer_id: input.customer_id,
    customer_name: input.customer_name,
    vehicle_summary: input.vehicle_summary || 'Véhicule non précisé',
    category_id: input.category_id,
    category_label: mockCategories.find(c => c.id === input.category_id)?.name_fr ?? 'Service',
    description: input.description.trim(),
    urgency: input.urgency,
    preferred_time: input.preferred_time || 'Dès que possible',
    location: input.location || 'Casablanca',
    service_mode: input.service_mode,
    budget: input.budget,
    status: 'open',
    accepts_offers: true,
    eligible_provider_ids: eligible,
    offer_count: 0,
    accepted_offer_id: null,
    ai_session_id: input.ai_session_id ?? null,
    source: input.source ?? (input.ai_session_id ? 'ai_assisted' : 'customer'),
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
  };
  s.requests.unshift(req);
  eligible.forEach(pid => pushNotification(s, {
    audience: 'provider', user_id: pid, kind: 'new_request',
    title: `Nouvelle demande ${req.category_label}`,
    body: `${req.vehicle_summary} — ${req.location.split(',')[0]} (${req.urgency === 'urgent' ? 'urgent' : 'standard'})`,
    link: `/mechanic/request/${req.id}`,
  }));
  persist(s);
  return { ok: true, request: req };
}

export function submitOffer(input: {
  request_id: string;
  provider_id: string;
  price: number;
  message: string;
  availability: string;
  eta_min?: number | null;
  includes_parts: boolean;
}): { ok: boolean; error?: string; offer?: ProviderOffer } {
  const s = marketState();
  const req = s.requests.find(r => r.id === input.request_id);
  if (!req) return { ok: false, error: 'Demande introuvable.' };
  if (!req.accepts_offers || (req.status !== 'open' && req.status !== 'offered')) return { ok: false, error: 'Cette demande n’accepte plus d’offres.' };
  if (!req.eligible_provider_ids.includes(input.provider_id)) return { ok: false, error: 'Vous n’êtes pas éligible pour cette demande.' };
  if (!Number.isFinite(input.price) || input.price < 50 || input.price > 20000) return { ok: false, error: 'Prix invalide (entre 50 et 20 000 MAD).' };
  if (!input.message || input.message.trim().length < 5) return { ok: false, error: 'Décrivez brièvement votre intervention.' };
  const p = getProvider(input.provider_id);
  if (s.offers.some(o => o.request_id === req.id && o.provider_id === input.provider_id && o.status === 'active')) {
    return { ok: false, error: 'Vous avez déjà une offre active sur cette demande.' };
  }
  const offer: ProviderOffer = {
    id: nextId('o-', s.offers.map(o => o.id)),
    request_id: req.id,
    provider_id: input.provider_id,
    provider_name: p?.name ?? input.provider_id,
    price: Math.round(input.price),
    message: input.message.trim(),
    availability: input.availability || 'Dès que possible',
    eta_min: input.eta_min ?? null,
    warranty_days: p?.warranty_days ?? 30,
    includes_parts: input.includes_parts,
    rating: p?.rating_avg ?? 0,
    jobs_done: p?.jobs_completed ?? 0,
    verified: p?.verification_status === 'approved',
    status: 'active',
    created_at: new Date().toISOString(),
  };
  s.offers.push(offer);
  req.offer_count = s.offers.filter(o => o.request_id === req.id && o.status === 'active').length;
  if (req.status === 'open') req.status = 'offered';
  pushNotification(s, {
    audience: 'customer', user_id: req.customer_id, kind: 'new_offer',
    title: `Nouvelle offre — ${offer.provider_name}`,
    body: `${offer.price} MAD • ${offer.availability}`,
    link: '/customer/offers',
  });
  persist(s);
  return { ok: true, offer };
}

export function acceptOffer(offerId: string, customerId: string): { ok: boolean; error?: string; job?: AcceptedJob } {
  const s = marketState();
  const offer = s.offers.find(o => o.id === offerId);
  if (!offer) return { ok: false, error: 'Offre introuvable.' };
  const req = s.requests.find(r => r.id === offer.request_id);
  if (!req) return { ok: false, error: 'Demande introuvable.' };
  if (req.customer_id !== customerId) return { ok: false, error: 'Non autorisé.' };
  // Idempotent replay: same offer accepted twice returns the existing job
  if (req.accepted_offer_id) {
    const existing = s.jobs.find(j => j.offer_id === req.accepted_offer_id);
    if (req.accepted_offer_id === offerId && existing) return { ok: true, job: existing };
    return { ok: false, error: 'Une autre offre a déjà été acceptée pour cette demande.' };
  }
  if (offer.status !== 'active') return { ok: false, error: 'Cette offre n’est plus disponible.' };

  req.accepted_offer_id = offerId;
  req.accepts_offers = false;
  req.status = 'accepted';
  offer.status = 'accepted';
  s.offers.forEach(o => {
    if (o.request_id === req.id && o.id !== offerId && o.status === 'active') o.status = 'expired';
  });
  const job: AcceptedJob = {
    id: nextId('j-', s.jobs.map(j => j.id)),
    request_id: req.id,
    offer_id: offer.id,
    customer_id: req.customer_id,
    provider_id: offer.provider_id,
    agreed_price: offer.price,
    status: 'scheduled',
    created_at: new Date().toISOString(),
  };
  s.jobs.push(job);
  pushNotification(s, {
    audience: 'provider', user_id: offer.provider_id, kind: 'offer_accepted',
    title: 'Offre acceptée 🎉',
    body: `${req.customer_name} a accepté votre offre de ${offer.price} MAD. Rendez-vous : ${offer.availability}.`,
    link: '/mechanic/jobs',
  });
  persist(s);
  return { ok: true, job };
}

export function cancelRequest(requestId: string, customerId: string): { ok: boolean; error?: string } {
  const s = marketState();
  const req = s.requests.find(r => r.id === requestId);
  if (!req) return { ok: false, error: 'Demande introuvable.' };
  if (req.customer_id !== customerId) return { ok: false, error: 'Non autorisé.' };
  if (req.status === 'accepted' || req.status === 'completed') return { ok: false, error: 'Impossible d’annuler une demande déjà attribuée.' };
  req.status = 'cancelled';
  req.accepts_offers = false;
  s.offers.forEach(o => {
    if (o.request_id === req.id && o.status === 'active') {
      o.status = 'expired';
      pushNotification(s, {
        audience: 'provider', user_id: o.provider_id, kind: 'request_cancelled',
        title: 'Demande annulée', body: `La demande ${req.category_label} (${req.customer_name}) a été annulée.`, link: null,
      });
    }
  });
  persist(s);
  return { ok: true };
}

export function withdrawOffer(offerId: string, providerId: string): { ok: boolean; error?: string } {
  const s = marketState();
  const offer = s.offers.find(o => o.id === offerId);
  if (!offer) return { ok: false, error: 'Offre introuvable.' };
  if (offer.provider_id !== providerId) return { ok: false, error: 'Non autorisé.' };
  if (offer.status !== 'active') return { ok: false, error: 'Seules les offres actives peuvent être retirées.' };
  offer.status = 'withdrawn';
  const req = s.requests.find(r => r.id === offer.request_id);
  if (req) req.offer_count = s.offers.filter(o => o.request_id === req.id && o.status === 'active').length;
  persist(s);
  return { ok: true };
}

export function notificationsFor(audience: 'customer' | 'provider', userId: string): PortalNotification[] {
  return marketState().notifications.filter(n => n.audience === audience && n.user_id === userId);
}

export function markNotificationRead(id: string) {
  const s = marketState();
  const n = s.notifications.find(x => x.id === id);
  if (n) { n.read = true; persist(s); }
}

export function resetMarketDemo() {
  saveState(K_REQUESTS, []);
  saveState(K_OFFERS, []);
  saveState(K_JOBS, []);
  saveState(K_NOTIFS, []);
  cache = null;
}

// ---------- Live sync (polling fallback until WS/SSE is wired) ----------
type Listener = () => void;
const listeners = new Set<Listener>();
let lastSerialized = '';

function snapshotKey(): string {
  try {
    return (localStorage.getItem(K_REQUESTS) || '') + '|' + (localStorage.getItem(K_OFFERS) || '') + '|' + (localStorage.getItem(K_NOTIFS) || '');
  } catch { return ''; }
}

function notifyListeners() {
  lastSerialized = snapshotKey();
  listeners.forEach(l => l());
}

if (typeof window !== 'undefined') {
  // Cross-tab updates
  window.addEventListener('storage', e => {
    if ([K_REQUESTS, K_OFFERS, K_JOBS, K_NOTIFS].includes(String(e.key))) {
      cache = null;
      listeners.forEach(l => l());
    }
  });
  // Same-tab polling fallback (3s) — trade-off documented: adds up to 3s latency
  // but zero infrastructure. Replace with WebSocket /ws/market when deployed.
  setInterval(() => {
    const key = snapshotKey();
    if (key !== lastSerialized) {
      lastSerialized = key;
      cache = null;
      listeners.forEach(l => l());
    }
  }, 3000);
}

export function subscribeMarket(cb: Listener): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
