// Client API partagé pour les portails TomoBily (customer/mécanicien…).
// Réutilise le même schéma de session que src/admin/apiClient.ts mais avec une
// clé localStorage distincte alimentée par l'écran de connexion.
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export interface PortalSession {
  token: string;
  user: { id: string; full_name: string; role: string };
}

const KEY = 'tomobily_session';

export function getPortalSession(): PortalSession | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
export function setPortalSession(s: PortalSession | null) {
  if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY);
}

export async function portalApi<T = any>(path: string, opts: { method?: string; body?: any } = {}): Promise<T> {
  const s = getPortalSession();
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(s ? { Authorization: `Bearer ${s.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let detail: any = `Erreur ${res.status}`;
    try { const j = await res.json(); detail = (typeof j.detail === 'string' || (j.detail && typeof j.detail === 'object')) ? j.detail : detail; } catch {}
    const e: any = new Error(typeof detail === 'string' ? detail : (detail?.message || 'Requête refusée'));
    e.detail = detail; e.status = res.status;
    throw e;
  }
  return res.json();
}
