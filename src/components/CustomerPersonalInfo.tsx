import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { portalApi } from '../shared/apiClient';

// Informations personnelles — persistées via PATCH /api/v1/users/me
// (identité dérivée du token : aucun user_id envoyé depuis le client).
export const CustomerPersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const [form, setForm] = useState({
    full_name: '', first_name: '', last_name: '', email: '',
    phone: '', city: '', country: '', address: '', language: 'fr',
    support_contact_email: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    portalApi<{ user: any }>('/api/v1/users/me')
      .then((d) => {
        if (!alive) return;
        const u = d.user || {};
        setForm({
          full_name: u.full_name || user?.full_name || '',
          first_name: u.first_name || '', last_name: u.last_name || '',
          email: u.email || '', phone: u.phone || '',
          city: u.city || '', country: u.country || '', address: u.address || '',
          language: u.language || 'fr',
          support_contact_email: u.support_contact_email || '',
        });
      })
      .catch((e) => { if (alive) setStatusMsg({ kind: 'err', text: e.message }); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: string) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: ev.target.value }));
    setFieldErrors((fe) => { const n = { ...fe }; delete n[k]; return n; });
  };

  const handleSave = async () => {
    setSaving(true); setStatusMsg(null); setFieldErrors({});
    try {
      const payload: Record<string, string> = {};
      (['full_name', 'first_name', 'last_name', 'email', 'city', 'country', 'address', 'language', 'support_contact_email'] as const)
        .forEach((k) => { if (form[k] !== undefined && String(form[k]).trim() !== '') payload[k] = String(form[k]).trim(); });
      const d = await portalApi<any>('/api/v1/users/me', { method: 'PATCH', body: payload });
      if (user && d?.user) setUser({ ...user, full_name: d.user.full_name ?? user.full_name });
      setStatusMsg({ kind: 'ok', text: 'Profil enregistré.' + (payload.support_contact_email ? ' L’e-mail support devra être re-vérifié.' : '') });
    } catch (e: any) {
      const detail = e?.message || 'Enregistrement impossible.';
      setStatusMsg({ kind: 'err', text: detail });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (k: string) =>
    `w-full px-3 py-2 rounded-xl border text-sm bg-white ${fieldErrors[k] ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`;

  if (loading) return <div className="max-w-2xl mx-auto p-6 space-y-3"><div className="h-8 w-48 bg-slate-100 rounded animate-pulse" /><div className="h-64 bg-slate-50 rounded-2xl animate-pulse" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <button onClick={() => navigate('/customer/profile')} className="text-sm text-slate-500 hover:text-slate-700">← Retour au profil</button>
      <h1 className="text-lg font-bold text-slate-900">Informations personnelles</h1>
      <p className="text-xs text-slate-500">Ces modifications sont enregistrées sur votre compte (backend), pas seulement localement.</p>

      {statusMsg && (
        <div className={`text-sm rounded-xl px-4 py-3 ${statusMsg.kind === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{statusMsg.text}</div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-slate-600">Prénom</label><input className={inputCls('first_name')} value={form.first_name} onChange={set('first_name')} /></div>
          <div><label className="text-xs font-medium text-slate-600">Nom</label><input className={inputCls('last_name')} value={form.last_name} onChange={set('last_name')} /></div>
        </div>
        <div><label className="text-xs font-medium text-slate-600">Nom complet</label><input className={inputCls('full_name')} value={form.full_name} onChange={set('full_name')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-slate-600">E-mail de connexion</label><input type="email" className={inputCls('email')} value={form.email} onChange={set('email')} /></div>
          <div><label className="text-xs font-medium text-slate-600">Téléphone</label><input className="w-full px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-500" value={form.phone} disabled title="Le numéro se change via Sécurité" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-slate-600">Ville</label><input className={inputCls('city')} value={form.city} onChange={set('city')} /></div>
          <div><label className="text-xs font-medium text-slate-600">Pays</label><input className={inputCls('country')} value={form.country} onChange={set('country')} /></div>
        </div>
        <div><label className="text-xs font-medium text-slate-600">Adresse</label><input className={inputCls('address')} value={form.address} onChange={set('address')} /></div>
        <div><label className="text-xs font-medium text-slate-600">Langue préférée</label>
          <select className={inputCls('language')} value={form.language} onChange={set('language')}>
            <option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">E-mail de contact support</label>
          <input type="email" className={inputCls('support_contact_email')} value={form.support_contact_email} onChange={set('support_contact_email')}
            placeholder="Adresse utilisée pour échanger avec le support TomoBily" />
          <p className="text-[11px] text-slate-400 mt-1">Distinct de l’e-mail de connexion ; il ne modifie jamais vos identifiants.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button onClick={() => navigate('/customer/profile')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPersonalInfo;
