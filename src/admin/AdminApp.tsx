import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, StatusBadge } from '../shared/components';
import { PortalSidebar } from '../components/PortalSidebar';
import { api, adminLogin } from './apiClient';
import { Star, Award, Phone } from 'lucide-react';
import {
  LayoutDashboard, Users, FileCheck, Briefcase, AlertTriangle, Settings, ScrollText,
  TrendingUp, CheckCircle2, XCircle, Clock, Wallet, Search, Shield, Wrench, Ban,
  RotateCcw, KeyRound, Trash2, UserPlus, Gauge,
} from 'lucide-react';

type AnyObj = Record<string, any>;

function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const toast = useToast();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    setLoading(true); setError(null);
    fn().then(setData).catch(e => setError(e.message || 'Erreur')).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(reload, [reload]);
  return { data, error, loading, reload };
}

// ---------------------------------------------------------------------------
// Bandeau "source des données" — permet de voir si le dashboard admin tourne
// sur les données réelles du backend ou sur le jeu de démo (mock) local.
// Le toggle Démo global (bouton flottant bas-droite) force le jeu mock même
// quand l'API répond.
// ---------------------------------------------------------------------------
import { getLastDataSource, onDataSourceChange } from '../shared/demoFallback';
import { useDemo } from '../shared/DemoContext';

export function DataSourceBanner() {
  const { isDemoMode, toggleDemoMode } = useDemo();
  const [src, setSrc] = useState(getLastDataSource());
  useEffect(() => {
    const off = onDataSourceChange(setSrc);
    return () => { off(); };
  }, []);
  const enhanced = isDemoMode || src === 'mock';
  return (
    <div className={`mb-6 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${enhanced ? 'border-violet-200 bg-violet-50 text-violet-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${enhanced ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white'}`}>
        {enhanced ? '🎭 Dashboard ENHANCED — données DÉMO (mock)' : '✅ Dashboard standard — données RÉELLES (API)'}
      </span>
      <span className="flex-1 min-w-[220px]">
        {enhanced
          ? 'Le tableau de bord affiche le jeu de données de démonstration (backend hors ligne ou mode Démo activé).'
          : 'Le tableau de bord affiche les statistiques renvoyées par le backend FastAPI.'}
      </span>
      <button onClick={toggleDemoMode} className="rounded-lg border border-current/30 px-3 py-1 text-xs font-semibold hover:opacity-80">
        Basculer en {isDemoMode ? 'Live (API réelle)' : 'Démo (mock)'}
      </button>
    </div>
  );
}

export function AdminLogin() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const { isDemoMode } = useDemo();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    // In demo mode (default when no backend is configured) the login is mocked
    // so the console can be explored offline; live mode hits the real API.
    if (isDemoMode && !localStorage.getItem('tombily_admin_session')) {
      localStorage.setItem('tombily_admin_session', JSON.stringify({
        token: 'demo-admin-token',
        user: { id: 'admin-demo', full_name: 'Administrateur Démo', role: 'admin' },
      }));
    }
    try {
      const sess = await adminLogin(phone, password);
      setUser({ id: String(sess.user.id), phone: '', role: 'admin', full_name: sess.user.full_name, status: 'active', language: 'fr', created_at: new Date().toISOString() } as any);
      navigate('/admin/dashboard');
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
        <Shield className="w-8 h-8 text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">TomoBily — Console Admin</h1>
      <p className="text-sm text-slate-400 mb-6">Connexion via le backend (rôle admin requis)</p>
      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Téléphone (ex: +212...)"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <Button fullWidth size="lg" type="submit" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</Button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Coquille admin : utilise désormais UNIQUEMENT le PortalSidebar moderne
// (une seule source de navigation pour les 5 rôles). L'ancien <aside> local
// qui provoquait un doublon de barres latérales a été supprimé ; la liste des
// ongèles est dérivée de portalConfig (rôle admin) pour rester synchronisée.
// Les pages rendent un simple bloc <div class="mx-auto max-w-7xl …"> et
// l'autoShell du PortalSidebar gère le conteneur de scroll.
// ---------------------------------------------------------------------------
const ADMIN_TAB_TITLES: Record<string, string> = {
  dashboard: 'Console admin', verification: 'File de vérification', requests: 'Demandes & Jobs',
  users: 'Utilisateurs', metrics: 'Centre de contrôle métriques', disputes: 'Litiges',
  audit: "Journal d'audit", settings: 'Paramètres plateforme',
};

function AdminLayout({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  void activeTab; // la surbrillance est gérée par le PortalSidebar via le chemin courant
  return (
    <PortalSidebar title={ADMIN_TAB_TITLES[activeTab] || 'Console admin'} autoShell={false}>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
    </PortalSidebar>
  );
}

const fmtMAD = (cents?: number | null) => cents == null ? '—' : `${(cents / 100).toLocaleString('fr-FR')} MAD`;

// Jeu de démonstration local : sert de filet si ni l'API ni le fallback mock
// ne répondent (ex. session expirée), pour que la console reste présentable.
const DEMO_DASHBOARD_STATS: AnyObj = {
  marketplace: { open_requests: 8, active_jobs: 5, completed_jobs: 132 },
  providers: { verified_mechanics: 46, pending_verifications: 7, total_providers: 73 },
  users: { total: 12480, customers: 9857, mechanics: 1527, tuners: 216, sellers: 643, admins: 3, suspended: 17 },
  quality: { open_disputes: 2, resolved_this_month: 14, avg_rating: 4.6 },
  revenue: { completed_volume_cents: 284500000, commission_cents: 28450000, mrr_cents: 18500000 },
};

export function AdminDashboard() {
  const { isDemoMode } = useDemo();
  const { data: apiData, error, loading } = useAsync<AnyObj>(() => api('/api/v1/admin/stats'), []);
  const data = apiData ?? (isDemoMode ? DEMO_DASHBOARD_STATS : null);
  const kpis = data ? [
    { label: 'Demandes ouvertes', value: data.marketplace.open_requests, icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Jobs actifs', value: data.marketplace.active_jobs, icon: <Clock className="w-5 h-5" />, color: 'bg-emerald-500' },
    { label: 'Jobs terminés', value: data.marketplace.completed_jobs, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Mécaniciens vérifiés', value: `${data.providers.verified_mechanics}/${data.users.mechanics}`, icon: <Users className="w-5 h-5" />, color: 'bg-amber-500' },
    { label: 'Litiges ouverts', value: data.quality.open_disputes, icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-rose-500' },
    { label: 'Volume jobs finis', value: fmtMAD(data.revenue.completed_volume_cents), icon: <Wallet className="w-5 h-5" />, color: 'bg-rose-500' },
    { label: 'Vérifications en attente', value: data.providers.pending_verifications, icon: <FileCheck className="w-5 h-5" />, color: 'bg-teal-500' },
    { label: 'Comptes suspendus', value: data.users.suspended, icon: <Ban className="w-5 h-5" />, color: 'bg-slate-600' },
  ] : [];
  return (
    <AdminLayout activeTab="dashboard">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <DataSourceBanner />
      {error && <Card className="p-4 mb-4 bg-amber-50 text-amber-700 text-sm">Backend indisponible : {error}. {isDemoMode ? 'La console affiche le jeu de données DÉMO ci-dessous.' : ''}</Card>}
      {loading && !error && <p className="text-sm text-slate-500">Chargement des données…</p>}
      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((k, i) => (
              <Card key={i} className="p-4">
                <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center text-white mb-3`}>{k.icon}</div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-slate-500">{k.label}</p>
              </Card>
            ))}
          </div>
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Répartition des comptes</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
              {Object.entries(data.users).map(([k, v]: [string, any]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500 capitalize">{k}</p><p className="font-bold">{v}</p></div>
              ))}
            </div>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}

export function AdminVerification() {
  const toast = useToast();
  const { data, error, loading, reload } = useAsync<any>(() => api('/api/v1/admin/verifications'), []);
  const act = async (id: number, action: string) => {
    const reason = action === 'reject' ? (prompt('Motif du refus ?') || undefined) : undefined;
    try { await api(`/api/v1/admin/providers/${id}/verify`, { method: 'PUT', body: { action, reason } }); reload(); }
    catch (e: any) { toast(e.message); }
  };
  return (
    <AdminLayout activeTab="verification">
      <h1 className="text-2xl font-bold mb-6">File de vérification (temps réel)</h1>
      {error && <Card className="p-4 mb-4 text-red-600 text-sm">{error}</Card>}
      {loading && <p className="text-sm text-slate-500">Chargement…</p>}
      {data && data.items.length === 0 && <Card className="p-8 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" /><p>Aucune vérification en attente.</p></Card>}
      {data && data.items.length > 0 && (
        <div className="space-y-3">
          {data.items.map((it: AnyObj) => (
            <Card key={it.provider_id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold">{it.name} <StatusBadge status={it.type} label={String(it.type)} /></p>
                <p className="text-xs text-slate-500">{it.phone} · {it.city || '—'} · statut: {it.verification_status}</p>
                {(it.specialties || []).length > 0 && <p className="text-xs text-slate-400">Spécialités : {it.specialties.join(', ')}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => act(it.provider_id, 'approve')}><CheckCircle2 className="w-4 h-4 mr-1" />Approuver</Button>
                <Button size="sm" variant="secondary" onClick={() => act(it.provider_id, 'reject')}><XCircle className="w-4 h-4 mr-1" />Refuser</Button>
                <Button size="sm" variant="ghost" onClick={() => act(it.provider_id, 'flag')}>Signaler</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export function AdminRequests() {
  const toast = useToast();
  const reqs = useAsync<any>(() => api('/api/v1/admin/requests?page_size=100'), []);
  const jobs = useAsync<any>(() => api('/api/v1/admin/jobs?page_size=100'), []);
  const [tab, setTab] = useState<'requests' | 'jobs'>('requests');
  const closeReq = async (id: number) => {
    if (!confirm(`Annuler la demande #${id} ?`)) return;
    try { await api(`/api/v1/admin/requests/${id}/close`, { method: 'POST' }); reqs.reload(); }
    catch (e: any) { toast(e.message); }
  };
  return (
    <AdminLayout activeTab="requests">
      <h1 className="text-2xl font-bold mb-4">Demandes & Jobs (base réelle)</h1>
      <div className="flex gap-2 mb-4">
        <Button size="sm" variant={tab === 'requests' ? 'primary' : 'secondary'} onClick={() => setTab('requests')}>Demandes ({reqs.data?.total ?? '…'})</Button>
        <Button size="sm" variant={tab === 'jobs' ? 'primary' : 'secondary'} onClick={() => setTab('jobs')}>Jobs ({jobs.data?.total ?? '…'})</Button>
      </div>
      {(tab === 'requests' ? reqs : jobs).error && <Card className="p-4 mb-4 text-red-600 text-sm">{(tab === 'requests' ? reqs : jobs).error}</Card>}
      {tab === 'requests' && reqs.data && (
        <Card className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b"><th className="p-3">#</th><th className="p-3">Client</th><th className="p-3">Scénario</th><th className="p-3">Prix</th><th className="p-3">Offres</th><th className="p-3">Statut</th><th className="p-3"></th></tr></thead>
          <tbody>{reqs.data.items.map((r: AnyObj) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="p-3">{r.id}</td><td className="p-3">{r.customer_name}</td><td className="p-3">{r.scenario}</td>
              <td className="p-3">{fmtMAD(r.proposed_price)}</td><td className="p-3">{r.offers_count}</td><td className="p-3"><StatusBadge status={r.status} label={String(r.status)} /></td>
              <td className="p-3">{['open','offers_received'].includes(r.status) && <button onClick={() => closeReq(r.id)} className="text-red-600 text-xs font-medium">Annuler</button>}</td>
            </tr>))}</tbody>
        </table></Card>
      )}
      {tab === 'jobs' && jobs.data && (
        <Card className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b"><th className="p-3">#</th><th className="p-3">Client</th><th className="p-3">Provider</th><th className="p-3">Prix</th><th className="p-3">Statut</th><th className="p-3">Litige</th></tr></thead>
          <tbody>{jobs.data.items.map((j: AnyObj) => (
            <tr key={j.id} className="border-b last:border-0">
              <td className="p-3">{j.id}</td><td className="p-3">{j.customer_name || '—'}</td><td className="p-3">{j.provider_name || '—'}</td>
              <td className="p-3">{fmtMAD(j.agreed_price)}</td><td className="p-3"><StatusBadge status={j.status} label={String(j.status)} /></td>
              <td className="p-3">{j.dispute_open ? <span className="text-rose-600 font-medium">ouvert</span> : '—'}</td>
            </tr>))}</tbody>
        </table></Card>
      )}
    </AdminLayout>
  );
}

export function AdminUsers() {
  const toast = useToast();
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [metricsTarget, setMetricsTarget] = useState<AnyObj | null>(null);
  const users = useAsync<any>(() => api(`/api/v1/admin/users?role=${role}&q=${encodeURIComponent(q)}${statusF !== 'all' ? `&status_filter=${statusF}` : ''}&page_size=100`), [role, q, statusF]);
  const doStatus = async (id: number, status: string) => {
    try { await api(`/api/v1/admin/users/${id}/status`, { method: 'PUT', body: { status } }); users.reload(); }
    catch (e: any) { toast(e.message); }
  };
  const resetPw = async (id: number) => {
    const pw = prompt('Nouveau mot de passe (min 6 caractères) ?');
    if (!pw) return;
    try { await api(`/api/v1/admin/users/${id}/reset-password`, { method: 'PUT', body: { password: pw } }); toast('Mot de passe réinitialisé.'); }
    catch (e: any) { toast(e.message); }
  };
  const remove = async (id: number) => {
    if (!confirm(`Supprimer définitivement le compte #${id} ?`)) return;
    try { await api(`/api/v1/admin/users/${id}`, { method: 'DELETE' }); users.reload(); }
    catch (e: any) { toast(e.message); }
  };
  const create = async () => {
    const full_name = prompt('Nom complet ?'); if (!full_name) return;
    const phone = prompt('Téléphone (+212…) ?'); if (!phone) return;
    const roleNew = prompt('Rôle (customer/mechanic/tuner/seller/admin) ?', 'customer') || 'customer';
    try { await api('/api/v1/admin/users', { method: 'POST', body: { full_name, phone, role: roleNew } }); users.reload(); }
    catch (e: any) { toast(e.message); }
  };
  return (
    <AdminLayout activeTab="users">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Utilisateurs ({users.data?.total ?? '…'})</h1>
        <Button size="sm" onClick={create}><UserPlus className="w-4 h-4 mr-1" />Créer</Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nom, téléphone, email…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm" />
        </div>
        {['', 'customer', 'mechanic', 'tuner', 'seller', 'admin'].map(r => (
          <button key={r || 'all'} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${role === r ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}>{r || 'Tous rôles'}</button>
        ))}
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 bg-white">
          <option value="all">Tous statuts</option><option value="active">Actifs</option><option value="suspended">Suspendus</option><option value="banned">Bannis</option>
        </select>
      </div>
      {users.error && <Card className="p-4 mb-4 text-red-600 text-sm">{users.error}</Card>}
      {users.data && (
        <Card className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b"><th className="p-3">#</th><th className="p-3">Nom</th><th className="p-3">Téléphone</th><th className="p-3">Rôle</th><th className="p-3">Vérif.</th><th className="p-3">Statut</th><th className="p-3">Actions</th></tr></thead>
          <tbody>{users.data.items.map((u: AnyObj) => (
            <tr key={u.id} className="border-b last:border-0">
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.full_name}<br /><span className="text-xs text-slate-400">{u.provider?.name || ''}</span></td>
              <td className="p-3">{u.phone}</td>
              <td className="p-3"><StatusBadge status={u.role} label={String(u.role)} /></td>
              <td className="p-3">{u.provider ? (u.provider.verified ? <span className="text-emerald-600">✓ {u.provider.verification_status}</span> : <span className="text-amber-600">{u.provider.verification_status}</span>) : '—'}</td>
              <td className="p-3"><StatusBadge status={u.status} label={String(u.status)} /></td>
              <td className="p-3">
                <div className="flex gap-2">
                  {u.status === 'active'
                    ? <button title="Suspendre" onClick={() => doStatus(u.id, 'suspended')} className="text-amber-600"><Ban className="w-4 h-4" /></button>
                    : <button title="Réactiver" onClick={() => doStatus(u.id, 'active')} className="text-emerald-600"><RotateCcw className="w-4 h-4" /></button>}
                  <button title="Réinitialiser le mot de passe" onClick={() => resetPw(u.id)} className="text-blue-600"><KeyRound className="w-4 h-4" /></button>
                  <button title="Éditer étoiles / jobs / profil" onClick={() => setMetricsTarget(u)} className="text-amber-600"><Star className="w-4 h-4" /></button>
                  <button title="Supprimer" onClick={() => remove(u.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>))}</tbody>
        </table></Card>
      )}
      {metricsTarget && <QuickMetricsModal user={metricsTarget} onClose={() => setMetricsTarget(null)} />}
    </AdminLayout>
  );
}

// Modale d'édition rapide des compteurs depuis la table Utilisateurs
// (équivalent inline du Control Center, route /admin/metrics).
function QuickMetricsModal({ user, onClose }: { user: AnyObj; onClose: () => void }) {
  const toast = useToast();
  const [m, setM] = useState<AnyObj | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api(`/api/v1/admin/metrics/${user.id}`).then((res: AnyObj) => {
      const ov = getMetricsOverride(user.id);
      if (ov) { if (res.provider) res.provider = { ...res.provider, ...ov.provider }; if (res.customer) res.customer = { ...res.customer, ...ov.customer }; }
      setM(res);
    }).catch((e: any) => toast(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
  const save = async () => {
    if (!m) return; setBusy(true);
    try {
      if (m.provider) {
        await api(`/api/v1/admin/metrics/${user.id}/provider`, { method: 'PUT', body: m.provider });
        saveMetricsOverride(user.id, { provider: m.provider });
      }
      if (m.customer) {
        await api(`/api/v1/admin/metrics/${user.id}/customer`, { method: 'PUT', body: m.customer });
        saveMetricsOverride(user.id, { customer: m.customer });
      }
      toast('Compteurs enregistrés ✓'); onClose();
    } catch (e: any) { toast(e.message); } finally { setBusy(false); }
  };
  const num = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold mb-1 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Compteurs — {user.full_name}</h3>
        <p className="text-xs text-slate-500 mb-4">{user.phone} · rôle {user.role}</p>
        {!m && <p className="text-sm text-slate-400">Chargement…</p>}
        {m?.provider && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[['rating', 'Étoiles (0-5)'], ['review_count', 'Avis'], ['jobs_completed', 'Jobs effectués'], ['completion_rate', 'Achèvement %']].map(([k, lbl]) => (
              <label key={k} className="block text-xs font-medium text-slate-600">
                {lbl}
                <input type="number" min={0} max={k === 'rating' ? 5 : k === 'completion_rate' ? 100 : 1000000} step={k === 'rating' || k === 'completion_rate' ? 0.1 : 1}
                  value={num(m.provider[k])} onChange={(e) => setM({ ...m, provider: { ...m.provider, [k]: Number(e.target.value) } })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" />
              </label>
            ))}
          </div>
        )}
        {m?.customer && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[['loyalty_points', 'Fidélité'], ['total_jobs', 'Jobs'], ['total_spent', 'Dépensé (c.)']].map(([k, lbl]) => (
              <label key={k} className="block text-xs font-medium text-slate-600">
                {lbl}
                <input type="number" min={0} value={num(m.customer[k])} onChange={(e) => setM({ ...m, customer: { ...m.customer, [k]: Number(e.target.value) } })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm" />
              </label>
            ))}
          </div>
        )}
        {m && !m.provider && !m.customer && <p className="text-sm text-slate-500 mb-4">Aucun profil pro/client pour ce compte.</p>}
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={onClose}>Fermer</Button>
          <Button size="sm" onClick={save} disabled={busy || !m}>{busy ? '…' : 'Enregistrer'}</Button>
        </div>
      </div>
    </div>
  );
}

export function AdminDisputes() {
  const toast = useToast();
  const { data, error, reload } = useAsync<any>(() => api('/api/v1/admin/disputes'), []);
  const resolve = async (jobId: number, outcome: string) => {
    const note = prompt('Note de résolution ?') || undefined;
    try { await api(`/api/v1/admin/jobs/${jobId}/resolve-dispute`, { method: 'POST', body: { outcome, note } }); reload(); }
    catch (e: any) { toast(e.message); }
  };
  return (
    <AdminLayout activeTab="disputes">
      <h1 className="text-2xl font-bold mb-6">Litiges ({data?.total ?? '…'})</h1>
      {error && <Card className="p-4 mb-4 text-red-600 text-sm">{error}</Card>}
      {data && data.items.length === 0 && <Card className="p-8 text-center text-slate-500">Aucun litige ouvert.</Card>}
      {data && data.items.map((d: AnyObj) => (
        <Card key={d.job_id} className="p-4 mb-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold">Job #{d.job_id} — {d.customer} vs {d.provider}</p>
              <p className="text-sm text-slate-600 mt-1">{d.reason || 'Motif non précisé'}</p>
              <p className="text-xs text-slate-400 mt-1">Montant : {fmtMAD(d.agreed_price)} · statut : {d.status}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => resolve(d.job_id, 'resolved')}>Résolu</Button>
              <Button size="sm" variant="secondary" onClick={() => resolve(d.job_id, 'upheld_customer')}>Client gain</Button>
              <Button size="sm" variant="ghost" onClick={() => resolve(d.job_id, 'cancelled')}>Annuler job</Button>
            </div>
          </div>
        </Card>
      ))}
    </AdminLayout>
  );
}

export function AdminAudit() {
  const toast = useToast();
  const { data, error } = useAsync<any>(() => api('/api/v1/admin/audit?limit=100'), []);
  return (
    <AdminLayout activeTab="audit">
      <h1 className="text-2xl font-bold mb-6">Journal d’audit</h1>
      {error && <Card className="p-4 mb-4 text-red-600 text-sm">{error}</Card>}
      {data && (
        <Card className="divide-y">
          {data.items.slice(0, 60).map((e: AnyObj, i: number) => (
            <div key={i} className="p-3 text-sm flex gap-3 items-center">
              <span className="text-slate-400 w-40 shrink-0">{e.at ? new Date(e.at).toLocaleString('fr-FR') : '—'}</span>
              <StatusBadge status={e.type} label={String(e.type)} />
              <span>#{e.id} {e.detail}</span>
            </div>
          ))}
        </Card>
      )}
    </AdminLayout>
  );
}

export function AdminSettingsPage() {
  const toast = useToast();
  const flags = useAsync<any>(() => api('/api/v1/feature-flags'), []);
  const countries = useAsync<any>(() => api('/api/v1/countries'), []);
  const toggle = async (f: AnyObj) => {
    try { await api(`/api/v1/feature-flags/${f.id}`, { method: 'PUT', body: { is_active: !f.is_active } }); flags.reload(); }
    catch (e: any) { toast(e.message); }
  };
  const flagList: any[] = Array.isArray(flags.data) ? flags.data : (flags.data?.items ?? []);
  const countryList: any[] = Array.isArray(countries.data) ? countries.data : (countries.data?.items ?? []);
  return (
    <AdminLayout activeTab="settings">
      <h1 className="text-2xl font-bold mb-6">Paramètres plateforme</h1>
      {flags.error && <Card className="p-4 mb-4 text-red-600 text-sm">{flags.error}</Card>}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-3">Feature flags</h2>
        {flagList.length > 0 ? (
          <div className="divide-y">
            {flagList.map((f: AnyObj) => (
              <div key={f.id} className="py-2 flex items-center justify-between text-sm">
                <span>{f.key || f.name} <span className="text-xs text-slate-400">({f.description || '—'})</span></span>
                <button onClick={() => toggle(f)} className={`px-3 py-1 rounded-full text-xs font-medium ${f.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{f.is_active ? 'ON' : 'OFF'}</button>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-slate-500">Aucun flag configuré.</p>}
      </Card>
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Pays actifs</h2>
        {countryList.length > 0 ? (
          <div className="flex flex-wrap gap-2">{countryList.map((c: AnyObj) => <span key={c.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm">{c.name} ({c.code})</span>)}</div>
        ) : <p className="text-sm text-slate-500">Aucun pays seedé.</p>}
      </Card>
    </AdminLayout>
  );
}

// ===========================================================================
// CONTROL CENTER — Métriques (étoiles, jobs effectués, profil client)
// ---------------------------------------------------------------------------
// Interface du backend `app/api/admin_metrics.py` :
//   GET  /api/v1/admin/metrics/:id              lecture des compteurs
//   PUT  /api/v1/admin/metrics/:id/provider     pro (mécano / tuner / vendeur)
//   PUT  /api/v1/admin/metrics/:id/customer     client
//   POST /api/v1/admin/providers/:id/seed-reviews   amorçage d'avis
// En mode démo (backend hors ligne), le fallback local (demoFallback) applique
// les changements dans localStorage et ils sont visibles partout dans l'app.
// ===========================================================================

const METRICS_OVERRIDES_KEY = 'tombily_mock_metrics_overrides';

export function getMetricsOverride(id: string | number): AnyObj | null {
  try {
    const all = JSON.parse(localStorage.getItem(METRICS_OVERRIDES_KEY) || '{}');
    return all[String(id)] ?? null;
  } catch { return null; }
}
export function saveMetricsOverride(id: string | number, patch: AnyObj) {
  let all: Record<string, any> = {};
  try { all = JSON.parse(localStorage.getItem(METRICS_OVERRIDES_KEY) || '{}'); } catch {}
  all[String(id)] = { ...(all[String(id)] || {}), ...patch };
  localStorage.setItem(METRICS_OVERRIDES_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event('tomobily-metrics-updated'));
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 align-middle">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${value >= i - 0.25 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
      ))}
    </span>
  );
}

function NumField({ label, value, onChange, min = 0, max = 1_000_000, step = 1, hint }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input type="number" min={min} max={max} step={step} value={Number.isFinite(value) ? value : 0}
        onChange={e => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
      {hint && <span className="mt-0.5 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

export function AdminMetricsControl() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [selected, setSelected] = useState<AnyObj | null>(null);
  const [metrics, setMetrics] = useState<AnyObj | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const users = useAsync<any>(() => api(`/api/v1/admin/users?role=${role}&q=${encodeURIComponent(q)}&page_size=100`), [role, q]);

  const pick = async (u: AnyObj) => {
    setSelected(u); setMetrics(null); setLoading(true);
    try {
      const m = await api(`/api/v1/admin/metrics/${u.id}`);
      // en démo, appliquer les overrides persistés localement
      const ov = getMetricsOverride(u.id);
      if (ov) {
        if (m.provider) m.provider = { ...m.provider, ...ov.provider };
        if (m.customer) m.customer = { ...m.customer, ...ov.customer };
      }
      setMetrics(m);
    } catch (e: any) { toast(e.message); } finally { setLoading(false); }
  };

  // --- état éditable du formulaire (provider) ---
  const [pForm, setPForm] = useState({ rating: 0, review_count: 0, jobs_completed: 0, response_time: 0, completion_rate: 0, verified: false });
  // --- état éditable du formulaire (customer) ---
  const [cForm, setCForm] = useState({ loyalty_points: 0, total_jobs: 0, total_spent_mad: 0 });
  useEffect(() => {
    if (metrics?.provider) setPForm({
      rating: metrics.provider.rating ?? 0, review_count: metrics.provider.review_count ?? 0,
      jobs_completed: metrics.provider.jobs_completed ?? 0, response_time: metrics.provider.response_time ?? 0,
      completion_rate: metrics.provider.completion_rate ?? 0, verified: !!metrics.provider.verified,
    });
    if (metrics?.customer) setCForm({
      loyalty_points: metrics.customer.loyalty_points ?? 0, total_jobs: metrics.customer.total_jobs ?? 0,
      total_spent_mad: (metrics.customer.total_spent ?? 0) / 100,
    });
  }, [metrics]);

  const saveProvider = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await api(`/api/v1/admin/metrics/${selected.id}/provider`, { method: 'PUT', body: pForm });
      saveMetricsOverride(selected.id, { provider: { ...pForm, rating: res?.provider?.rating ?? pForm.rating } });
      toast(`Compteurs mis à jour pour ${selected.full_name} ✓`);
      setMetrics((m: AnyObj) => (m ? { ...m, provider: { ...m.provider, ...pForm, ...(res?.provider || {}) } } : m));
    } catch (e: any) { toast(e.message); } finally { setSaving(false); }
  };

  const saveCustomer = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const body = { loyalty_points: cForm.loyalty_points, total_jobs: cForm.total_jobs, total_spent: Math.round(cForm.total_spent_mad * 100) };
      const res = await api(`/api/v1/admin/metrics/${selected.id}/customer`, { method: 'PUT', body });
      saveMetricsOverride(selected.id, { customer: body });
      toast(`Profil client mis à jour pour ${selected.full_name} ✓`);
      setMetrics((m: AnyObj) => (m ? { ...m, customer: res?.customer || body } : m));
    } catch (e: any) { toast(e.message); } finally { setSaving(false); }
  };

  const seedReviews = async () => {
    if (!metrics?.provider) return;
    const count = Number(prompt("Nombre d'avis à amorcer (1-200) ?", '20'));
    if (!count) return;
    const avg = Number(prompt('Note cible moyenne (0-5) ?', '4.8'));
    if (!(avg >= 0 && avg <= 5)) { toast('Note cible invalide'); return; }
    setSaving(true);
    try {
      const res = await api(`/api/v1/admin/providers/${metrics.provider.id}/seed-reviews`, { method: 'POST', body: { count, avg_rating: avg } });
      const newRating = Number(res?.rating ?? avg);
      const newCount = Number(res?.review_count ?? (metrics.provider.review_count + count));
      saveMetricsOverride(selected!.id, { provider: { rating: newRating, review_count: newCount } });
      setMetrics((m: AnyObj) => (m ? { ...m, provider: { ...m.provider, rating: newRating, review_count: newCount } } : m));
      setPForm(f => ({ ...f, rating: newRating, review_count: newCount }));
      toast(`${count} avis amorcés — nouvelle note : ${newRating}★`);
    } catch (e: any) { toast(e.message); } finally { setSaving(false); }
  };

  const roleBadge = (r: string) => ({ customer: '👤 Client', mechanic: '🔧 Mécanicien', seller: '🏪 Vendeur', tuner: '🏎️ Tuner', admin: '🛡️ Admin' } as any)[r] || r;

  return (
    <AdminLayout activeTab="metrics">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Gauge className="w-6 h-6 text-emerald-600" /> Centre de contrôle — Métriques des comptes</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pilotez manuellement les <strong>étoiles</strong>, le nombre de <strong>jobs effectués</strong> et les données du{' '}
          <strong>profil client</strong> pour les 4 rôles (client, mécanicien, vendeur, tuner). Idéal pour amorcer de nouveaux comptes au démarrage.
        </p>
      </div>
      <DataSourceBanner />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sélecteur de compte */}
        <Card className="lg:col-span-2 p-4 h-fit">
          <h2 className="font-semibold mb-3">1. Choisir un compte</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nom ou téléphone…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            {['', 'customer', 'mechanic', 'seller', 'tuner'].map(r => (
              <button key={r || 'all'} onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${role === r ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}>
                {r ? roleBadge(r) : 'Tous'}
              </button>
            ))}
          </div>
          {users.error && <p className="text-xs text-red-600 mb-2">{users.error}</p>}
          <div className="max-h-[420px] overflow-y-auto divide-y border border-slate-100 rounded-lg">
            {(users.data?.items ?? []).map((u: AnyObj) => (
              <button key={u.id} onClick={() => pick(u)}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-emerald-50 ${selected?.id === u.id ? 'bg-emerald-50 font-semibold' : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{u.full_name}</span>
                  <StatusBadge status={u.role} label={String(u.role)} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Phone className="w-3 h-3" />{u.phone}
                  {u.provider?.verified && <span className="text-emerald-600">✓ vérifié</span>}
                  {u.provider && !u.provider.verified && <span className="text-amber-600">{u.provider.verification_status}</span>}
                </div>
              </button>
            ))}
            {!users.loading && (users.data?.items ?? []).length === 0 && <p className="p-4 text-sm text-slate-400">Aucun compte trouvé.</p>}
          </div>
        </Card>

        {/* Panneau d'édition */}
        <div className="lg:col-span-3 space-y-4">
          {!selected && <Card className="p-10 text-center text-slate-400 text-sm">← Sélectionnez un compte pour éditer ses compteurs.</Card>}
          {selected && loading && <Card className="p-10 text-center text-slate-400 text-sm">Chargement des métriques…</Card>}
          {selected && !loading && metrics && (
            <>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">{roleBadge(metrics.role)?.split(' ')[0]}</div>
                  <div className="flex-1">
                    <p className="font-bold">{metrics.full_name}</p>
                    <p className="text-xs text-slate-500">{metrics.phone} · {roleBadge(metrics.role)}</p>
                  </div>
                  {metrics.provider && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end"><Stars value={metrics.provider.rating} /><span className="text-sm font-bold">{Number(metrics.provider.rating).toFixed(2)}</span></div>
                      <p className="text-xs text-slate-500">{metrics.provider.review_count} avis · {metrics.provider.jobs_completed} jobs</p>
                    </div>
                  )}
                </div>
              </Card>

              {metrics.provider && (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> 2a. Compteurs pro — {metrics.provider.name}</h2>
                    <button onClick={seedReviews} disabled={saving} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
                      ⚡ Amorcer des avis
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <NumField label="Note moyenne (étoiles)" value={pForm.rating} min={0} max={5} step={0.1} onChange={v => setPForm({ ...pForm, rating: v })} hint="0 à 5" />
                    <NumField label="Nombre d'avis" value={pForm.review_count} onChange={v => setPForm({ ...pForm, review_count: v })} />
                    <NumField label="Jobs effectués" value={pForm.jobs_completed} onChange={v => setPForm({ ...pForm, jobs_completed: v })} hint="compteur affiché publiquement" />
                    <NumField label="Temps de réponse (min)" value={pForm.response_time} max={10000} onChange={v => setPForm({ ...pForm, response_time: v })} />
                    <NumField label="Taux d'achèvement (%)" value={pForm.completion_rate} min={0} max={100} step={0.5} onChange={v => setPForm({ ...pForm, completion_rate: v })} />
                    <label className="flex items-end gap-2 pb-2">
                      <input type="checkbox" checked={pForm.verified} onChange={e => setPForm({ ...pForm, verified: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                      <span className="text-xs font-medium text-slate-600">Badge vérifié</span>
                    </label>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" onClick={saveProvider} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer les compteurs pro'}</Button>
                  </div>
                  {(metrics.provider.reviews?.length ?? 0) > 0 && (
                    <div className="mt-4 border-t pt-3">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Derniers avis ({metrics.provider.reviews.length})</p>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {metrics.provider.reviews.slice(0, 8).map((r: AnyObj, i: number) => (
                          <div key={i} className="text-xs flex gap-2 items-start"><Stars value={r.rating} /><span className="text-slate-600 flex-1">{r.comment}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {metrics.customer && (
                <Card className="p-4">
                  <h2 className="font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" /> 2b. Profil client — fidélité & activité</h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <NumField label="Points de fidélité" value={cForm.loyalty_points} onChange={v => setCForm({ ...cForm, loyalty_points: v })} />
                    <NumField label="Jobs / commandes passés" value={cForm.total_jobs} onChange={v => setCForm({ ...cForm, total_jobs: v })} />
                    <NumField label="Total dépensé (MAD)" value={cForm.total_spent_mad} step={10} onChange={v => setCForm({ ...cForm, total_spent_mad: v })} />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" onClick={saveCustomer} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer le profil client'}</Button>
                  </div>
                </Card>
              )}

              {!metrics.provider && !metrics.customer && (
                <Card className="p-6 text-sm text-slate-500">Ce compte n'a pas encore de profil (ni pro, ni client). Créez-lui un profil via son portail, puis revenez ici.</Card>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
