import React, { useState } from 'react';
import { AlertTriangle, Wallet, X } from 'lucide-react';
import { formatMoney } from './portalStore';
import type { BudgetCheckResult, ProviderRole } from './budgetGate';
import { COMMISSION_RATES } from './budgetGate';

const ROLE_LABEL: Record<ProviderRole, string> = {
  mechanic: 'cette intervention',
  tuner: 'ce projet de tuning',
  seller: 'cette commande',
};

const ROLE_LABEL_EN: Record<ProviderRole, string> = {
  mechanic: 'this service job',
  tuner: 'this tuning project',
  seller: 'this order',
};

interface Props {
  role: ProviderRole;
  check: BudgetCheckResult | null;
  lang?: 'fr' | 'ar' | 'en';
  onClose: () => void;
  /** Re-déclenche l'action d'acceptation après rechargement réussi. */
  onAddFunds: (cents: number) => Promise<void>;
}

/**
 * Avertissement bloquant : le pro n'a pas assez de budget dans son wallet
 * pour couvrir la commission plateforme -> il doit recharger avant d'accepter.
 */
export const InsufficientFundsModal: React.FC<Props> = ({ role, check, lang = 'fr', onClose, onAddFunds }) => {
  const [amount, setAmount] = useState(50000); // 500 MAD par défaut
  const [busy, setBusy] = useState(false);

  if (!check) return null;
  const missing = Math.max(0, check.commission - check.balance);
  const suggested = Math.max(50000, Math.ceil((missing + check.commission) / 10000) * 10000);

  const fr = lang === 'fr';
  const en = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" title="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 className="mt-3 text-lg font-bold text-slate-900">
          {fr ? 'Budget insuffisant' : en ? 'Insufficient budget' : 'الميزانية غير كافية'}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {fr
            ? `Vous devez ajouter des fonds à votre compte pour pouvoir accepter ${ROLE_LABEL[role]}. La commission plateforme (${Math.round(COMMISSION_RATES[role] * 100)}%) doit être couverte par votre solde avant acceptation.`
            : en
              ? `You must add funds to your account to accept ${ROLE_LABEL_EN[role]}. The platform commission must be covered by your balance before acceptance.`
              : `يجب إضافة رصيد إلى حسابك لقبول ${role === 'mechanic' ? 'هذه الخدمة' : role === 'tuner' ? 'هذا المشروع' : 'هذا الطلب'}. يجب أن يغطي رصيدك عمولة المنصة قبل القبول.`}
        </p>

        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">{fr ? 'Montant de la mission' : 'Job amount'}</span>
            <span className="font-semibold text-slate-800">{formatMoney(check.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{fr ? 'Commission requise' : 'Required commission'}</span>
            <span className="font-semibold text-amber-700">{formatMoney(check.commission)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{fr ? 'Votre solde wallet' : 'Wallet balance'}</span>
            <span className="font-semibold text-red-600">{formatMoney(check.balance)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-500">{fr ? 'Manque' : 'Missing'}</span>
            <span className="font-bold text-red-700">{formatMoney(missing)}</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-500">
            {fr ? 'Montant à recharger (MAD)' : 'Top-up amount (MAD)'}
          </label>
          <div className="mt-1 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-slate-400" />
            <input
              type="number"
              min={100}
              step={1000}
              value={amount / 100}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) * 100))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <button
              onClick={() => setAmount(suggested)}
              className="shrink-0 rounded-lg bg-slate-100 px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              {fr ? `Suggéré ${formatMoney(suggested)}` : `Suggest ${formatMoney(suggested)}`}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {fr ? 'Plus tard' : 'Later'}
          </button>
          <button
            disabled={busy || amount < 1000}
            onClick={async () => {
              setBusy(true);
              await onAddFunds(amount);
              setBusy(false);
            }}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? '…' : `${fr ? 'Ajouter' : 'Add'} ${formatMoney(amount)}`}
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">
          {fr
            ? 'Les coordonnées du client restent protégées tant que la mission n’est pas acceptée via la plateforme.'
            : 'Client contact details stay protected until the job is accepted through the platform.'}
        </p>
      </div>
    </div>
  );
};

