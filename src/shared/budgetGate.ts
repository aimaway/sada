import { portalApi } from './apiClient';

// Portail "Budget Gate" : un pro (mécanicien / tuner / vendeur) ne peut accepter
// une mission / un projet / une commande que si son wallet couvre la commission
// due à la plateforme. Taux par rôle (alignés avec le backend /wallet/check-acceptance).
// En mode démo, les soldes sont persistés dans localStorage ; dès que l'API
// répond, le solde réel du backend est utilisé et cache la valeur locale.



export type ProviderRole = 'mechanic' | 'tuner' | 'seller';

export const COMMISSION_RATES: Record<ProviderRole, number> = {
  mechanic: 0.1, // 10%
  tuner: 0.07, //  7%
  seller: 0.05, //  5%
};

const WALLET_KEYS: Record<ProviderRole, string> = {
  mechanic: 'mech.wallet.balance',
  tuner: 'tuner.wallet.balance',
  seller: 'seller.wallet.balance',
};

// Soldes de démonstration : mécanicien bien financé, tuner au milieu,
// vendeur volontairement pauvre pour tester le blocage + modal d'avertissement.
const DEMO_SEED: Record<ProviderRole, number> = {
  mechanic: 150000, // 1 500 MAD
  tuner: 200000, // 2 000 MAD
  seller: 8000, // 80 MAD -> bloqué sur la plupart des commandes
};

export const getWalletBalance = (role: ProviderRole): number => {
  try {
    const raw = localStorage.getItem(WALLET_KEYS[role]);
    if (raw != null) return Number(raw) || 0;
    localStorage.setItem(WALLET_KEYS[role], String(DEMO_SEED[role]));
    return DEMO_SEED[role];
  } catch {
    return DEMO_SEED[role];
  }
};

export const setWalletBalance = (role: ProviderRole, cents: number): void => {
  try {
    localStorage.setItem(WALLET_KEYS[role], String(Math.max(0, Math.round(cents))));
  } catch {
    /* ignore */
  }
};

export const addFunds = (role: ProviderRole, cents: number): number => {
  const next = getWalletBalance(role) + Math.max(0, Math.round(cents));
  setWalletBalance(role, next);
  return next;
};

export const computeCommission = (role: ProviderRole, amountCents: number): number =>
  Math.round(amountCents * COMMISSION_RATES[role]);

export interface BudgetCheckResult {
  allowed: boolean;
  balance: number; // cents
  commission: number; // cents
  amount: number; // cents (prix mission / budget / total commande)
}

/**
 * Vérifie si le pro peut accepter. Interroge d'abord le backend
 * (POST /api/v1/wallet/check-acceptance) ; si l'API est hors ligne,
 * retombe sur le calcul local démo.
 */
export const checkAcceptanceBudget = async (
  role: ProviderRole,
  amountCents: number,
): Promise<BudgetCheckResult> => {
  const commission = computeCommission(role, amountCents);
  const localBalance = getWalletBalance(role);

  try {
    const res = await portalApi<any>('/wallet/check-acceptance', {
      method: 'POST',
      body: { provider_type: role,
      commission_rate: COMMISSION_RATES[role], amount: amountCents },
    });
    if (res && typeof res.allowed === 'boolean') {
      // Le backend est source de vérité : on synchronise le solde local affiché.
      if (typeof res.balance === 'number') setWalletBalance(role, res.balance);
      return {
        allowed: res.allowed,
        balance: typeof res.balance === 'number' ? res.balance : localBalance,
        commission: typeof res.commission_required === 'number' ? res.commission_required : commission,
        amount: amountCents,
      };
    }
  } catch {
    /* API offline -> mode démo local */
  }

  return { allowed: localBalance >= commission, balance: localBalance, commission, amount: amountCents };
};

