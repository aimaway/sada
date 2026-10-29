import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button, StatusBadge } from '../shared/components';
import { api, adminLogin, setSession } from './apiClient';
import { ArrowLeft, LayoutDashboard, Users, FileCheck, Briefcase, AlertTriangle, Settings, ScrollText, TrendingUp, CheckCircle2, XCircle, Clock, Wallet, Search, Shield, Wrench, Ban, RotateCcw, KeyRound, Trash2, UserPlus } from 'lucide-react';

type AnyObj = Record<string, any>;

function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
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

function AdminLayout({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  const { logout } = useApp();
  const navigate = useNavigate();
  const tabs = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'verification', icon: <FileCheck className="w-5 h-5" />, label: 'Vérification' },
    { id: 'requests', icon: <Briefcase className="w-5 h-5" />, label: 'Jobs' },
    { id: 'users', icon: <Users className="w-5 h-5" />, label: 'Utilisateurs' },
    { id: 'disputes', icon: <AlertTriangle className="w-5 h-5" />, label: 'Litiges' },
    { id: 'audit', icon: <ScrollText className="w-5 h-5" />, label: 'Audit' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ];
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="md:w-64 bg-slate-900 text-white flex md:flex-col md:fixed md:h-full overflow-x-auto md:overflow-visible">
        <div className="p-4 border-b border-slate-800 hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><Wrench className="w-4 h-4" /></div>
          <span className="font-bold">TomoBily Admin</span>
        </div>
        <nav className="flex md:block flex-1 p-3 md:space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => navigate(`/admin/${tab.id}`)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600' : 'text-slate-400 hover:bg-slate-800'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800 hidden md:block">
          <button onClick={() => { logout(); setSession(null); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 min-h-screen bg-slate-50"><div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div></main>
    </div>
  );
}

const fmtMAD = (cents?: number | null) => cents == null ? '—' : `${(cents / 100).toLocaleString('fr-FR')} MAD`;

export function AdminDashboard() {
  const { data, error, loading } = useAsync<AnyObj>(() => api('/api/v1/admin/stats'), []);
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
      {error && <Card className="p-4 mb-4 text-red-600 text-sm">Backend indisponible : {error}. Vérifiez que l’API tourne et que vous êtes connecté·e en admin.</Card>}
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
  const { data, error, loading, reload } = useAsync<any>(() => api('/api/v1/admin/verifications'), []);
  const act = async (id: number, action: string) => {
    const reason = action === 'reject' ? (prompt('Motif du refus ?') || undefined) : undefined;
    try { await api(`/api/v1/admin/providers/${id}/verify`, { method: 'PUT', body: { action, reason } }); reload(); }
    catch (e: any) { alert(e.message); }
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
  const reqs = useAsync<any>(() => api('/api/v1/admin/requests?page_size=100'), []);
  const jobs = useAsync<any>(() => api('/api/v1/admin/jobs?page_size=100'), []);
  const [tab, setTab] = useState<'requests' | 'jobs'>('requests');
  const closeReq = async (id: number) => {
    if (!confirm(`Annuler la demande #${id} ?`)) return;
    try { await api(`/api/v1/admin/requests/${id}/close`, { method: 'POST' }); reqs.reload(); }
    catch (e: any) { alert(e.message); }
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
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState('all');
  const users = useAsync<any>(() => api(`/api/v1/admin/users?role=${role}&q=${encodeURIComponent(q)}${statusF !== 'all' ? `&status_filter=${statusF}` : ''}&page_size=100`), [role, q, statusF]);
  const doStatus = async (id: number, status: string) => {
    try { await api(`/api/v1/admin/users/${id}/status`, { method: 'PUT', body: { status } }); users.reload(); }
    catch (e: any) { alert(e.message); }
  };
  const resetPw = async (id: number) => {
    const pw = prompt('Nouveau mot de passe (min 6 caractères) ?');
    if (!pw) return;
    try { await api(`/api/v1/admin/users/${id}/reset-password`, { method: 'PUT', body: { password: pw } }); alert('Mot de passe réinitialisé.'); }
    catch (e: any) { alert(e.message); }
  };
  const remove = async (id: number) => {
    if (!confirm(`Supprimer définitivement le compte #${id} ?`)) return;
    try { await api(`/api/v1/admin/users/${id}`, { method: 'DELETE' }); users.reload(); }
    catch (e: any) { alert(e.message); }
  };
  const create = async () => {
    const full_name = prompt('Nom complet ?'); if (!full_name) return;
    const phone = prompt('Téléphone (+212…) ?'); if (!phone) return;
    const roleNew = prompt('Rôle (customer/mechanic/tuner/seller/admin) ?', 'customer') || 'customer';
    try { await api('/api/v1/admin/users', { method: 'POST', body: { full_name, phone, role: roleNew } }); users.reload(); }
    catch (e: any) { alert(e.message); }
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
                  <button title="Supprimer" onClick={() => remove(u.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>))}</tbody>
        </table></Card>
      )}
    </AdminLayout>
  );
}

export function AdminDisputes() {
  const { data, error, reload } = useAsync<any>(() => api('/api/v1/admin/disputes'), []);
  const resolve = async (jobId: number, outcome: string) => {
    const note = prompt('Note de résolution ?') || undefined;
    try { await api(`/api/v1/admin/jobs/${jobId}/resolve-dispute`, { method: 'POST', body: { outcome, note } }); reload(); }
    catch (e: any) { alert(e.message); }
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
  const flags = useAsync<any>(() => api('/api/v1/feature-flags'), []);
  const countries = useAsync<any>(() => api('/api/v1/countries'), []);
  const toggle = async (f: AnyObj) => {
    try { await api(`/api/v1/feature-flags/${f.id}`, { method: 'PUT', body: { is_active: !f.is_active } }); flags.reload(); }
    catch (e: any) { alert(e.message); }
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
