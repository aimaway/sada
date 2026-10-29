// ============================================================================
// FALLBACK MOCK — when the FastAPI backend (http://localhost:8000) is not
// reachable, every portal/admin screen used to die with "TypeError: Failed to
// fetch" and show nothing. This module intercepts those calls and serves
// realistic demo data instead, so the whole app remains browsable offline.
//
// Rules:
//  - Only NETWORK-level failures (backend down) or 404/5xx from a running but
//    incomplete server fall back to mocks. A genuine 401/403 still throws so
//    auth errors stay honest.
//  - Writes (POST/PUT/DELETE/PATCH) are simulated locally and recorded in the
//    audit journal so admin actions visibly "work" in demo mode.
//  - Demo mode ON (DemoContext.isDemoMode) forces mock data even if the
//    backend happens to answer.
// ============================================================================
import {
  mockUsers, mockRequests, mockJobs, mockOrders, mockNotifications,
  mockLegalDocuments, mockProducts, mockPartnerships, mockAdminSettings,
} from './unifiedMockData';
import { getSellerProfile } from '../data/mockDataGlobal';

export type DataSource = 'api' | 'mock';
let lastSource: DataSource = 'api';
const sourceListeners = new Set<(s: DataSource) => void>();

export function getLastDataSource(): DataSource { return lastSource; }
export function setLastDataSource(s: DataSource) {
  lastSource = s;
  sourceListeners.forEach((cb) => { try { cb(s); } catch {} });
}
export function onDataSourceChange(cb: (s: DataSource) => void) {
  sourceListeners.add(cb);
  return () => sourceListeners.delete(cb);
}

/** True when we are allowed to serve mock data for a failed request. */
export function demoModeEnabled(): boolean {
  try { return localStorage.getItem('tombily_demo_mode') !== 'off'; } catch { return true; }
}

// ---------------------------------------------------------------- audit log
const AUDIT_KEY = 'tombily_mock_audit';
export interface MockAuditEntry { id: number; at: string; type: string; detail: string; }

export function getMockAudit(): MockAuditEntry[] {
  try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]'); } catch { return []; }
}
export function pushMockAudit(type: string, detail: string): MockAuditEntry {
  const list = getMockAudit();
  const entry: MockAuditEntry = { id: (list[0]?.id ?? 1000) + 1, at: new Date().toISOString(), type, detail };
  localStorage.setItem(AUDIT_KEY, JSON.stringify([entry, ...list].slice(0, 200)));
  return entry;
}

// ------------------------------------------------------------- partnerships
export interface MockInviteRow {
  id: number; target_provider_id: number; target_name: string; message: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn'; direction: 'sent' | 'received';
  created_at: string;
}
const PARTNERSHIP_KEY = 'tombily_mock_partnerships';
const SEED_RECEIVED: MockInviteRow[] = [
  { id: 9001, target_provider_id: 502, target_name: 'Speed Tuning Casa', message: 'Proposition de référencement réciproque sur Casablanca.', status: 'pending', direction: 'received', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];
const SEED_SENT: MockInviteRow[] = [
  { id: 9000, target_provider_id: 503, target_name: 'PneusExpress', message: '', status: 'accepted', direction: 'sent', created_at: new Date(Date.now() - 9 * 86400000).toISOString() },
];

export function getMockInvitations(): MockInviteRow[] {
  let rows: MockInviteRow[];
  try { rows = JSON.parse(localStorage.getItem(PARTNERSHIP_KEY) || 'null'); } catch { rows = null as any; }
  if (!Array.isArray(rows)) {
    rows = [...SEED_SENT, ...SEED_RECEIVED];
    localStorage.setItem(PARTNERSHIP_KEY, JSON.stringify(rows));
  }
  return rows;
}
export function saveMockInvitations(rows: MockInviteRow[]) {
  localStorage.setItem(PARTNERSHIP_KEY, JSON.stringify(rows));
}
export function addMockInvitation(target_provider_id: number, target_name: string, message: string): MockInviteRow {
  const rows = getMockInvitations();
  const row: MockInviteRow = {
    id: Math.max(9000, ...rows.map((r) => r.id)) + 1,
    target_provider_id, target_name, message,
    status: 'pending', direction: 'sent', created_at: new Date().toISOString(),
  };
  saveMockInvitations([row, ...rows]);
  return row;
}
export function respondMockInvitation(id: number, accept: boolean) {
  saveMockInvitations(getMockInvitations().map((r) => (r.id === id ? { ...r, status: accept ? 'accepted' : 'declined' } : r)));
}
export function withdrawMockInvitation(id: number) {
  saveMockInvitations(getMockInvitations().filter((r) => r.id !== id));
}
export function getMockPartnerList() {
  return getMockInvitations()
    .filter((r) => r.status === 'accepted')
    .map((r) => ({ id: r.target_provider_id, name: r.target_name, city: 'Casablanca', since: r.created_at.slice(0, 10) }));
}

// ------------------------------------------------------------ discover pool
const PROVIDER_POOL = [
  { id: 501, name: 'Ahmed Benali — Garage Atlas', city: 'Casablanca', type: 'mechanic', rating_avg: 4.8, rating_count: 145, specialties: ['Toyota', 'Dacia', 'Renault'], distance_km: 2.1 },
  { id: 502, name: 'Speed Tuning Casa', city: 'Casablanca', type: 'tuner', rating_avg: 5.0, rating_count: 320, specialties: ['Stage 1-3', 'Reprogrammation ECU'], distance_km: 6.4 },
  { id: 503, name: 'PneusExpress', city: 'Casablanca', type: 'seller', rating_avg: 4.5, rating_count: 890, specialties: ['Pneus', 'Jantes', 'Montage gratuit'], distance_km: 4.8 },
  { id: 504, name: 'Youssef El Amrani — Electro Auto', city: 'Casablanca', type: 'mechanic', rating_avg: 4.5, rating_count: 89, specialties: ['Électrique', 'Hybride', 'Diesel'], distance_km: 3.2 },
  { id: 505, name: 'Karim Tazi — Diesel Pro', city: 'Rabat', type: 'mechanic', rating_avg: 4.9, rating_count: 234, specialties: ['Toutes marques', 'Diesel', 'Turbo'], distance_km: 52 },
  { id: 506, name: 'Fassi Detailing Studio', city: 'Casablanca', type: 'tuner', rating_avg: 4.7, rating_count: 61, specialties: ['Detailing', 'Covering', 'Lights'], distance_km: 8.9 },
];

// --------------------------------------------------------------- admin stats
function buildAdminStats() {
  const mechanics = mockUsers.mechanics as any[];
  const verified = mechanics.filter((m) => m.profile?.verification_status === 'approved').length;
  const pending = mechanics.filter((m) => m.profile?.verification_status === 'pending').length;
  const openReq = mockRequests.filter((r: any) => ['open', 'offers_received'].includes(r.status)).length;
  const activeJobs = mockJobs.filter((j: any) => j.status === 'in_progress').length;
  const completedJobs = mockJobs.filter((j: any) => j.status === 'completed').length;
  const volume = mockJobs.filter((j: any) => j.status === 'completed').reduce((a: number, j: any) => a + (j.agreed_price || 0), 0);
  return {
    marketplace: { open_requests: openReq, active_jobs: activeJobs, completed_jobs: completedJobs },
    providers: { verified_mechanics: verified, pending_verifications: pending + 1, total_providers: mechanics.length + (mockUsers.sellers?.length ?? 0) + (mockUsers.tuners?.length ?? 0) },
    users: { total: 12480, customers: (mockUsers.customers as any[]).length + 9842, mechanics: mechanics.length + 1523, tuners: (mockUsers.tuners as any[]).length + 214, sellers: (mockUsers.sellers as any[]).length + 640, admins: 3, suspended: 17 },
    quality: { open_disputes: 2, resolved_this_month: 14, avg_rating: 4.6 },
    revenue: { completed_volume_cents: volume * 100, commission_cents: Math.round(volume * 10), mrr_cents: 18500000 },
  };
}

function buildVerificationQueue() {
  const items = (mockUsers.mechanics as any[])
    .filter((m) => m.profile && m.profile.verification_status !== 'approved')
    .map((m, i) => ({
      provider_id: 700 + i, name: m.full_name, phone: m.phone, city: m.profile.city,
      type: 'mechanic', verification_status: m.profile.verification_status,
      specialties: m.profile.specialties || [],
    }));
  items.push({
    provider_id: 742, name: 'Hicham Ouali — Moto Speed', phone: '+212600000142', city: 'Rabat',
    type: 'mechanic', verification_status: 'pending', specialties: ['Moto', 'Scooter'],
  } as any);
  return { total: items.length, items };
}

function mapStatus(s: string): string {
  if (['delivered', 'completed'].includes(s)) return 'completed';
  if (['out_for_delivery', 'in_transit'].includes(s)) return 'in_progress';
  if (['preparing', 'processing'].includes(s)) return 'accepted';
  if (s === 'cancelled') return 'cancelled';
  return 'open';
}

function toAdminRequest(r: any, idx: number) {
  const cust = (mockUsers.customers as any[]).find((c) => c.id === r.customer_id);
  return {
    id: 1000 + idx, customer_name: cust?.full_name || 'Client TomoBily', scenario: `cat_${r.category_id}`,
    proposed_price: Math.round((r.customer_price || 0) * 100), offers_count: mockOffersCount(r.id),
    status: mapStatus(r.status), created_at: r.created_at,
  };
}
function mockOffersCount(requestId: string) {
  // local import avoided to keep this file dependency-light; approximate from jobs/offers seeds
  const counts: Record<string, number> = { r1: 2, r2: 1 };
  return counts[requestId] ?? 0;
}

function toAdminJob(j: any, idx: number) {
  const cust = (mockUsers.customers as any[]).find((c) => c.id === j.customer_id);
  const mech = (mockUsers.mechanics as any[]).find((m) => m.id === j.mechanic_id);
  return {
    id: 2000 + idx, customer_name: cust?.full_name || '—', provider_name: mech?.full_name || '—',
    agreed_price: Math.round((j.agreed_price || 0) * 100), status: mapStatus(j.status),
    dispute_open: false, created_at: j.started_at,
  };
}

function buildUserList(role: string, q: string, statusFilter: string) {
  const all: any[] = [
    ...(mockUsers.customers as any[]).map((u) => ({ ...u, provider: null })),
    ...(mockUsers.mechanics as any[]).map((u) => ({ ...u, provider: { name: u.full_name, verified: u.profile?.verification_status === 'approved', verification_status: u.profile?.verification_status } })),
    ...((mockUsers as any).sellers || []).map((u: any) => ({ ...u, provider: { name: u.shop?.shop_name || u.full_name, verified: u.shop?.verification_status === 'verified', verification_status: u.shop?.verification_status } })),
    ...((mockUsers as any).tuners || []).map((u: any) => ({ ...u, provider: { name: u.shop?.shop_name || u.full_name, verified: u.shop?.verification_status === 'verified', verification_status: u.shop?.verification_status } })),
    ...((mockUsers as any).admins || []),
  ];
  const extraCustomers = Array.from({ length: 12 }).map((_, i) => ({
    id: `ux${i}`, full_name: ['Mohamed Idrissi', 'Fatima Zahra Alaoui', 'Omar Benjelloun', 'Salma Chraibi', 'Reda Bennani', 'Imane Kettani', 'Anas Sebti', 'Khadija Berrada', 'Mehdi Tazi', 'Nadia Lahlou', 'Zakaria Amrani', 'Houda Fikri'][i],
    phone: `+21266100${(1000 + i).toString()}`, role: 'customer', status: i % 6 === 0 ? 'suspended' : 'active', created_at: '2024-05-0' + ((i % 9) + 1), provider: null,
  }));
  const merged = [...all, ...extraCustomers];
  // apply persisted demo mutations (suspend / delete)
  let overrides: Record<string, { status?: string; deleted?: boolean }> = {};
  try { overrides = JSON.parse(localStorage.getItem('tombily_mock_user_overrides') || '{}'); } catch {}
  let filtered = merged
    .filter((u) => !overrides[u.id]?.deleted)
    .map((u) => ({ ...u, status: overrides[u.id]?.status || u.status }));
  if (role) filtered = filtered.filter((u) => u.role === role);
  if (statusFilter && statusFilter !== 'all') filtered = filtered.filter((u) => u.status === statusFilter);
  if (q) {
    const ql = q.toLowerCase();
    filtered = filtered.filter((u) => `${u.full_name} ${u.phone}`.toLowerCase().includes(ql));
  }
  return {
    total: filtered.length,
    items: filtered.map((u, i) => ({
      id: typeof u.id === 'string' ? hashId(u.id) : u.id,
      full_name: u.full_name, phone: u.phone, email: u.email || null, role: u.role,
      status: u.status, provider: u.provider || null, created_at: u.created_at, index: i,
    })),
  };
}
function hashId(id: string): number {
  let h = 3000;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h;
}

export function setUserOverride(id: string | number, patch: { status?: string; deleted?: boolean }) {
  let overrides: Record<string, any> = {};
  try { overrides = JSON.parse(localStorage.getItem('tombily_mock_user_overrides') || '{}'); } catch {}
  overrides[String(id)] = { ...(overrides[String(id)] || {}), ...patch };
  localStorage.setItem('tombily_mock_user_overrides', JSON.stringify(overrides));
}

const FEATURE_FLAGS = [
  { id: 1, key: 'partnerships_premium', name: 'Partenariats premium', description: 'Réservé aux pros abonnés (mécanicien / tuner / vendeur)', is_active: true },
  { id: 2, key: 'ifix_ai', name: 'Assistant IA IFIX', description: 'Diagnostic assisté par IA pour les clients', is_active: true },
  { id: 3, key: 'gift_plans', name: 'Cartes cadeaux abonnements', description: 'Offrir un abonnement à un proche', is_active: true },
  { id: 4, key: 'recurring_plans', name: 'Plans d’entretien récurrents', description: 'Abonnements entretien auto', is_active: true },
  { id: 5, key: 'crypto_wallet', name: 'Portefeuille crypto', description: 'Paiements alternatifs (désactivé en production)', is_active: false },
];

function persistFlags(flags: { key: string; is_active: boolean }[]) {
  localStorage.setItem('tombily_feature_flags', JSON.stringify(flags));
}
export function loadFeatureFlags() {
  try {
    const saved = JSON.parse(localStorage.getItem('tombily_feature_flags') || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {}
  return FEATURE_FLAGS;
}

// ============================================================ main resolver
export async function resolveWithFallback<T = any>(path: string, opts: { method?: string; body?: any } = {}): Promise<T> {
  const method = (opts.method || 'GET').toUpperCase();
  const url = path.startsWith('http') ? path : path;
  const clean = (url.split('?')[0] || '').replace(/\/+$/, '');
  const seg = clean.split('/').filter(Boolean); // e.g. ['api','v1','admin','users','12','status']

  const json = (obj: any) => obj as T;

  try {
    // ------------------------------ ADMIN ------------------------------
    if (clean.includes('/admin/stats')) {
      return json(buildAdminStats());
    }
    if (clean.includes('/admin/verifications')) {
      return json(buildVerificationQueue());
    }
    if (/\/admin\/providers\/[^/]+\/verify$/.test(clean)) {
      const action = (opts.body?.action || 'approve').toString();
      pushMockAudit('provider_verify', `${action} provider #${seg[seg.indexOf('providers') + 1]}${opts.body?.reason ? ` (${opts.body.reason})` : ''}`);
      return json({ ok: true, action });
    }
    if (/\/admin\/requests\/[^/]+\/close$/.test(clean)) {
      pushMockAudit('request_close', `demande #${seg[seg.indexOf('requests') + 1]} annulée`);
      return json({ ok: true });
    }
    if (clean.endsWith('/admin/requests')) {
      const items = mockRequests.map(toAdminRequest);
      return json({ total: items.length, items });
    }
    if (clean.endsWith('/admin/jobs')) {
      const items = mockJobs.map(toAdminJob);
      return json({ total: items.length, items });
    }
    if (/\/admin\/jobs\/[^/]+\/resolve-dispute$/.test(clean)) {
      pushMockAudit('dispute_resolution', `job #${seg[seg.indexOf('jobs') + 1]} → ${opts.body?.outcome || 'resolved'}`);
      return json({ ok: true });
    }
    if (/\/admin\/users\/[^/]+\/status$/.test(clean)) {
      const st = opts.body?.status || 'active';
      pushMockAudit('user_status', `utilisateur #${seg[seg.indexOf('users') + 1]} → ${st}`);
      return json({ ok: true, status: st });
    }
    if (/\/admin\/users\/[^/]+\/reset-password$/.test(clean)) {
      pushMockAudit('password_reset', `utilisateur #${seg[seg.indexOf('users') + 1]}`);
      return json({ ok: true });
    }
    if (/\/admin\/users\/[^/]+$/.test(clean) && method === 'DELETE') {
      pushMockAudit('user_delete', `suppression utilisateur #${seg[seg.length - 1]}`);
      return json({ ok: true });
    }
    if (clean.endsWith('/admin/users')) {
      if (method === 'POST') {
        pushMockAudit('user_create', `nouveau compte ${opts.body?.full_name || '?'} (${opts.body?.role || 'customer'})`);
        return json({ ok: true, id: Date.now() });
      }
      const qs = new URLSearchParams(url.split('?')[1] || '');
      return json(buildUserList(qs.get('role') || '', (qs.get('q') || '').trim(), qs.get('status_filter') || 'all'));
    }
    if (clean.endsWith('/admin/disputes')) {
      return json({
        total: 2,
        items: [
          { job_id: 2001, customer: 'Sara Mansouri', provider: 'Karim Tazi', reason: 'Très mauvaise expérience, le véhicule présente toujours la panne initiale.', agreed_price: 40000, status: 'open' },
          { job_id: 2002, customer: 'Youssef Rachidi', provider: 'Youssef El Amrani', reason: 'Le mécanicien ne s’est pas présenté au rendez-vous confirmé.', agreed_price: 25000, status: 'under_review' },
        ],
      });
    }
    if (clean.endsWith('/admin/audit')) {
      const apiEntries = getMockAudit();
      const seed: MockAuditEntry[] = [
        { id: 1001, at: new Date(Date.now() - 3600000).toISOString(), type: 'login', detail: 'Connexion console admin (démo locale)' },
        { id: 1002, at: new Date(Date.now() - 7200000).toISOString(), type: 'provider_verify', detail: 'approuvé provider #700 (Ahmed Benali)' },
        { id: 1003, at: new Date(Date.now() - 86400000).toISOString(), type: 'config_update', detail: 'commission_percent = 10' },
      ];
      return json({ items: [...apiEntries, ...seed].slice(0, 100) });
    }

    // ------------------------------ PLATFORM ------------------------------
    if (clean.endsWith('/feature-flags')) {
      if (method === 'PUT') {
        const flags = loadFeatureFlags();
        return json(flags);
      }
      return json({ items: loadFeatureFlags() });
    }
    if (/\/feature-flags\/[^/]+$/.test(clean)) {
      const flags = loadFeatureFlags();
      const idNum = Number(seg[seg.length - 1]);
      const idx = flags.findIndex((f: any) => f.id === idNum || String(f.id) === String(seg[seg.length - 1]));
      if (idx >= 0) {
        flags[idx] = { ...flags[idx], is_active: opts.body?.is_active ?? !flags[idx].is_active };
        persistFlags(flags);
        pushMockAudit('feature_flag', `${flags[idx].key} → ${flags[idx].is_active ? 'ON' : 'OFF'}`);
      }
      return json({ items: flags });
    }
    if (clean.endsWith('/countries')) {
      return json({ items: [{ id: 1, name: 'Maroc', code: 'MA' }, { id: 2, name: 'Sénégal', code: 'SN' }] });
    }

    // ------------------------------ PARTNERSHIPS ------------------------------
    if (clean.endsWith('/partnerships/entitlement')) {
      return json({ allowed: true, source: 'demo_premium', role: 'seller', note: 'Accès premium accordé par la démo locale (backend hors ligne).' });
    }
    if (clean.endsWith('/partnerships/discover')) {
      const qs = new URLSearchParams(url.split('?')[1] || '');
      const q = (qs.get('q') || '').toLowerCase().trim();
      const items = PROVIDER_POOL.filter((p) => !q || `${p.name} ${(p.specialties || []).join(' ')} ${p.city}`.toLowerCase().includes(q));
      return json({ total: items.length, items });
    }
    if (clean.endsWith('/partnerships/invite')) {
      const row = addMockInvitation(Number(opts.body?.target_provider_id), opts.body?.target_name || 'Professionnel TomoBily', String(opts.body?.message || ''));
      pushMockAudit('partnership_invite', `invitation envoyée à ${row.target_name}`);
      return json({ ok: true, id: row.id, status: row.status });
    }
    if (clean.endsWith('/partnerships/invitations')) {
      const rows = getMockInvitations();
      return json({
        sent: rows.filter((r) => r.direction === 'sent').map((r) => ({ id: r.id, other_name: r.target_name, status: r.status, message: r.message, created_at: r.created_at })),
        received: rows.filter((r) => r.direction === 'received').map((r) => ({ id: r.id, other_name: r.target_name, status: r.status, message: r.message, created_at: r.created_at })),
      });
    }
    if (/\/partnerships\/invitations\/[^/]+\/respond$/.test(clean)) {
      respondMockInvitation(Number(seg[seg.length - 2]), !!opts.body?.accept);
      pushMockAudit('partnership_response', `invitation #${seg[seg.length - 2]} ${opts.body?.accept ? 'acceptée' : 'refusée'}`);
      return json({ ok: true });
    }
    if (/\/partnerships\/invitations\/[^/]+\/withdraw$/.test(clean)) {
      withdrawMockInvitation(Number(seg[seg.length - 2]));
      return json({ ok: true });
    }
    if (clean.endsWith('/partnerships/partners')) {
      return json({ items: getMockPartnerList() });
    }

    // ------------------------------ CLIENTS (compte client) ------------------------------
    if (clean.includes('/clients/') || clean.endsWith('/client/orders') || clean.endsWith('/client/documents') || clean.endsWith('/client/vehicles')) {
      return json({ orders: mockOrders, documents: mockLegalDocuments, vehicles: mockVehiclesSafe(), notifications: mockNotifications });
    }

    // ------------------------------ SELLER STORE SETTINGS ------------------------------
    if (clean.match(/\/sellers?\/(me\/)?settings$/) || clean.endsWith('/store-settings')) {
      if (method === 'PUT' || method === 'POST') {
        localStorage.setItem('tombily_store_settings', JSON.stringify(opts.body || {}));
        pushMockAudit('store_settings', 'réglages boutique mis à jour');
        return json({ ok: true, saved: true });
      }
      try {
        const saved = JSON.parse(localStorage.getItem('tombily_store_settings') || 'null');
        if (saved) return json(saved);
      } catch {}
      return json((getSellerProfile() as any)?.shop || getSellerProfile() || {});
    }

    // fallback générique : liste vide cohérente plutôt qu'une erreur bloquante
    if (method === 'GET') {
      return json({ items: [], total: 0, _mock: true, _path: clean } as any);
    }
    pushMockAudit('simulated_write', `${method} ${clean}`);
    return json({ ok: true, _mock: true } as any);
  } catch (internalErr) {
    // never let the mock layer itself crash the UI
    if (method === 'GET') return json({ items: [], total: 0, _mock: true } as any);
    return json({ ok: false } as any);
  }
}

function mockVehiclesSafe() {
  try { return (mockUsers.customers as any[])[0]?.vehicles || []; } catch { return []; }
}

export const mockAdminSettingsRef = mockAdminSettings;
export const mockProductsRef = mockProducts;
export const mockPartnershipsRef = mockPartnerships;
