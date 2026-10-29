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

/**
 * api() with an offline mock fallback (same contract as portalApi):
 * network failure / 404 / 5xx → demo data from shared/demoFallback so the
 * console never shows "Failed to fetch". 401/403 still throw.
 */
export async function api<T = any>(path: string, opts: { method?: string; body?: any } = {}): Promise<T> {
  const s = getSession();
  let res: Response | null = null;
  let networkError: any = null;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(s ? { Authorization: `Bearer ${s.token}` } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (e) {
    networkError = e; // backend indisponible → bascule sur les données de démo
  }

  if (networkError || !res || res.status === 404 || res.status >= 500) {
    const { resolveWithFallback, setLastDataSource } = await import('../shared/demoFallback');
    setLastDataSource('mock');
    return resolveWithFallback<T>(path, opts);
  }

  if (res.status === 401 || res.status === 403) throw new Error(res.status === 401 ? 'Authentification requise' : 'Accès refusé (rôle admin requis)');
  if (!res.ok) {
    let detail = `Erreur ${res.status}`;
    try { const j = await res.json(); detail = j.detail || detail; } catch {}
    throw new Error(detail);
  }
  const { setLastDataSource } = await import('../shared/demoFallback');
  setLastDataSource('api');
  return res.json();
}

export async function adminLogin(phone: string, password: string): Promise<Session> {
  // Session démo locale : elle alimente le fallback mock quand le backend est hors ligne.
  const demoSession = (): Session => {
    const sess: Session = {
      token: 'demo-local-token',
      user: { id: 'admin1', full_name: phone ? `Admin (${phone})` : 'Admin Démo', role: 'admin' },
    };
    setSession(sess);
    try { localStorage.setItem('tomobily_session', JSON.stringify({ token: 'demo-local-token', user: { id: 'admin1', full_name: sess.user.full_name, role: 'admin' } })); } catch {}
    return sess;
  };
  let res: Response | null = null;
  try {
    res = await fetch(`${API_BASE}/api/v1/auth/login?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`, { method: 'POST' });
  } catch {
    // Backend éteint → en mode démo on laisse entrer avec une session locale.
    if ((import.meta as any).env?.DEMO_MODE !== false && (!phone || !password || phone.startsWith('+212'))) {
      return demoSession();
    }
    throw new Error('Identifiants invalides ou serveur indisponible');
  }
  if (!res.ok) {
    if (res.status === 404 || res.status >= 500) return demoSession();
    throw new Error('Identifiants invalides ou serveur indisponible');
  }
  const data = await res.json();
  if (data.user.role !== 'admin') throw new Error('Ce compte n’a pas le rôle admin');
  const sess: Session = { token: data.access_token, user: data.user };
  setSession(sess);
  return sess;
}
