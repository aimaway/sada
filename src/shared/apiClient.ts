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

/**
 * portalApi with an offline mock fallback.
 * - Network failure / 404 / 5xx → realistic demo data (shared/demoFallback).
 * - 401/403 still throws (auth must stay honest).
 */
export async function portalApi<T = any>(path: string, opts: { method?: string; body?: any } = {}): Promise<T> {
  const s = getPortalSession();
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
    networkError = e; // TypeError: Failed to fetch — backend down
  }

  if (networkError || !res) {
    const { resolveWithFallback, setLastDataSource } = await import('./demoFallback');
    setLastDataSource('mock');
    return resolveWithFallback<T>(path, opts);
  }

  if (res.status === 404 || res.status >= 500) {
    // endpoint missing on this server build → serve demo data instead of a dead screen
    const { resolveWithFallback, setLastDataSource } = await import('./demoFallback');
    setLastDataSource('mock');
    return resolveWithFallback<T>(path, opts);
  }

  if (!res.ok) {
    let detail: any = `Erreur ${res.status}`;
    try { const j = await res.json(); detail = (typeof j.detail === 'string' || (j.detail && typeof j.detail === 'object')) ? j.detail : detail; } catch {}
    const e: any = new Error(typeof detail === 'string' ? detail : (detail?.message || 'Requête refusée'));
    e.detail = detail; e.status = res.status;
    throw e;
  }

  const { setLastDataSource } = await import('./demoFallback');
  setLastDataSource('api');
  return res.json();
}
