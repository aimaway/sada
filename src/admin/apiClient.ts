// Client API minimal pour le portail Admin (backend FastAPI).
// Base : VITE_API_URL (défaut http://localhost:8000).
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export interface Session { token: string; user: { id: string; full_name: string; role: string } }

const KEY = 'tombily_admin_session';

export function getSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function setSession(s: Session | null) {
  if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY);
}

export async function api<T = any>(path: string, opts: { method?: string; body?: any } = {}): Promise<T> {
  const s = getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(s ? { Authorization: `Bearer ${s.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 401 || res.status === 403) throw new Error(res.status === 401 ? 'Authentification requise' : 'Accès refusé (rôle admin requis)');
  if (!res.ok) {
    let detail = `Erreur ${res.status}`;
    try { const j = await res.json(); detail = j.detail || detail; } catch {}
    throw new Error(detail);
  }
  return res.json();
}

export async function adminLogin(phone: string, password: string): Promise<Session> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`, { method: 'POST' });
  if (!res.ok) throw new Error('Identifiants invalides ou serveur indisponible');
  const data = await res.json();
  if (data.user.role !== 'admin') throw new Error('Ce compte n’a pas le rôle admin');
  const sess: Session = { token: data.access_token, user: data.user };
  setSession(sess);
  return sess;
}
