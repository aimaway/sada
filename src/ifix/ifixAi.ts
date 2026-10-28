// ============================================
// IFIX AI — DIAGNOSTIC SESSION ENGINE (client layer)
// ============================================
// Mirrors the backend surface app/api/ifix_ai.py:
//   POST /api/v1/ifix/sessions               -> startSession (entitlement enforced)
//   POST /api/v1/ifix/sessions/{id}/messages -> sendMessage (no extra quota)
//   POST /api/v1/ifix/sessions/{id}/share    -> shareSummary (explicit consent)
// The rule engine below is a LABELED MOCK ("moteur de règles local") — it is
// not an LLM and never claims confirmed faults. When a real AI provider key is
// configured on the backend, only the reply source changes; session,
// entitlement and consent logic stay authoritative server-side.

import { loadState, saveState } from '../shared/portalStore';
import { rankProvidersForCategory, ProviderInfo } from './ifixStore';

export type IfixMascotState =
  | 'welcome' | 'listening' | 'thinking' | 'explaining'
  | 'success' | 'concerned' | 'safety' | 'connecting' | 'mechanic' | 'idle';

export interface IfixMessage {
  id: string;
  role: 'user' | 'ifix';
  text: string;
  mascot?: IfixMascotState;
  created_at: string;
}

export interface IfixSession {
  id: string;
  customer_id: string;
  vehicle_summary: string;
  status: 'active' | 'completed';
  safety_flag: boolean;
  category_guess: string | null;
  summary: string | null;
  consent: 'pending' | 'granted' | 'declined';
  shared_with_provider_id: string | null;
  shared_at: string | null;
  request_id: string | null;
  counted: boolean; // true once it consumed a complimentary session
  messages: IfixMessage[];
  created_at: string;
  updated_at: string;
}

const K_SESSIONS = 'sada.ifix.sessions.v1';
export const FREE_SESSION_ALLOWANCE = 3;

function allSessions(): IfixSession[] {
  return loadState<IfixSession[]>(K_SESSIONS, []);
}
function persist(sessions: IfixSession[]) {
  saveState(K_SESSIONS, sessions);
}

export function sessionsForCustomer(customerId: string): IfixSession[] {
  return allSessions()
    .filter(s => s.customer_id === customerId)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function countedSessions(customerId: string): number {
  return allSessions().filter(s => s.customer_id === customerId && s.counted).length;
}

export function remainingFreeSessions(customerId: string): number {
  return Math.max(0, FREE_SESSION_ALLOWANCE - countedSessions(customerId));
}

export function getSession(sessionId: string): IfixSession | undefined {
  return allSessions().find(s => s.id === sessionId);
}

/**
 * Start a NEW diagnostic case. Enforces the 3-free-sessions allowance.
 * Failed creation never consumes allowance (count flips only on success).
 */
export function startSession(customerId: string, vehicleSummary: string):
  { ok: true; session: IfixSession; remaining: number } |
  { ok: false; code: 'allowance_exhausted'; remaining: number } {
  const sessions = allSessions();
  const used = sessions.filter(s => s.customer_id === customerId && s.counted).length;
  if (used >= FREE_SESSION_ALLOWANCE) {
    return { ok: false, code: 'allowance_exhausted', remaining: 0 };
  }
  const now = new Date().toISOString();
  const session: IfixSession = {
    id: `ifix-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    customer_id: customerId,
    vehicle_summary: vehicleSummary || 'Véhicule non précisé',
    status: 'active',
    safety_flag: false,
    category_guess: null,
    summary: null,
    consent: 'pending',
    shared_with_provider_id: null,
    shared_at: null,
    request_id: null,
    counted: true,
    messages: [{
      id: `m-${Date.now()}-0`, role: 'ifix', mascot: 'welcome', created_at: now,
      text: `Bonjour ! Je suis IFIX AI, votre copilote auto & moto. Décrivez-moi le problème de ${vehicleSummary || 'votre véhicule'} : que se passe-t-il, quand, et depuis combien de temps ?`,
    }],
    created_at: now,
    updated_at: now,
  };
  sessions.push(session);
  persist(sessions);
  return { ok: true, session, remaining: FREE_SESSION_ALLOWANCE - used - 1 };
}

// ---------- Rule engine (labeled mock, deterministic, safety-first) ----------

interface SymptomRule {
  keywords: string[];
  category: string;
  causes: string[];
  checks: string[];
  safety?: 'stop' | 'caution';
  safetyText?: string;
}

const RULES: SymptomRule[] = [
  {
    keywords: ['frein', 'freine', 'freinage', 'plaquette', 'pedale frein', 'pédale'],
    category: '3', safety: 'stop',
    safetyText: '⚠️ PROBLÈME DE FREINAGE DÉTECTÉ — Ne conduisez pas le véhicule. Faites appel à un professionnel immédiatement ou utilisez une remorque.',
    causes: ['Plaquettes usées (bruit de grincement fréquent)', 'Disques marqués ou voilés', 'Niveau de liquide de frein bas / fuite'],
    checks: ['Contrôlez le niveau du liquide de frein (sous capot)', 'Testez la fermeté de la pédale, moteur tournant, véhicule à l’arrêt'],
  },
  {
    keywords: ['batterie', 'demarre', 'démarre', 'clic', 'clignote', 'charge'],
    category: '1',
    causes: ['Batterie déchargée ou en fin de vie (souvent > 4 ans)', 'Cosses oxydées / mal serrées', 'Alternateur qui ne recharge plus'],
    checks: ['Démarrer phares allumés : faiblissent-ils ?', 'Inspectez les cosses (dépôt blanc/vert)', 'Un « clic » unique pointe souvent vers la batterie ou le démarreur'],
  },
  {
    keywords: ['vidange', 'huile', 'oil', 'filtre'],
    category: '2',
    causes: ['Entretien périodique arrivé à échéance', 'Huile trop vieille / niveau bas'],
    checks: ['Vérifiez couleur et niveau de l’huile à la jauge', 'Notez le kilométrage depuis la dernière vidange'],
  },
  {
    keywords: ['pneu', 'roue', 'creve', 'crève', 'pression', 'vibration'],
    category: '4', safety: 'caution',
    safetyText: '🛞 Pneu crevé ou vibration forte au volant : vérification nécessaire avant de reprendre la route à vitesse élevée.',
    causes: ['Pression insuffisante', 'Pneu usé ou endommagé', 'Équilibrage / parallélisme à revoir'],
    checks: ['Contrôlez la pression des 4 pneus à froid', 'Cherchez clou, hernie ou usure irrégulière'],
  },
  {
    keywords: ['surchauffe', 'temperature', 'température', 'vapeur', 'refroidissement'],
    category: '1', safety: 'stop',
    safetyText: '🌡️ SURCHAUFFE — Arrêtez le moteur dès que possible en sécurité. N’ouvrez JAMAIS le bouchon du radiateur à chaud (risque de brûlures et de casse moteur).',
    causes: ['Niveau de liquide de refroidissement bas', 'Thermostat bloqué', 'Ventilateur défaillant'],
    checks: ['Attendez au moins 30 min avant toute vérification', 'Contrôlez le vase d’expansion uniquement à froid'],
  },
  {
    keywords: ['fumee', 'fumée', 'echappement', 'échappement', 'odeur essence', 'carburant', 'fuite'],
    category: '1', safety: 'stop',
    safetyText: '🔥 FUMÉE ou ODEUR DE CARBURANT — Garez-vous immédiatement, coupez le moteur, éloignez-vous du véhicule et appelez les secours si de la fumée sort du capot. Risque d’incendie.',
    causes: ['Fuite carburant/huile sur échappement chaud', 'Joint de culasse (fumée blanche épaisse)', 'Injection défaillante'],
    checks: ['Notez la couleur de la fumée (bleue / blanche / noire)', 'Ne redémarrez pas avant inspection professionnelle'],
  },
  {
    keywords: ['direction', 'volant dur', 'jeu volant', 'steering'],
    category: '3', safety: 'caution',
    safetyText: '🧭 Anomalie de direction : faites vérifier sans délai, la tenue de route peut être compromise.',
    causes: ['Direction assistée (niveau liquide / pompe)', 'Rotules / biellettes usées'],
    checks: ['Vérifiez le jeu à vide du volant, moteur à l’arrêt'],
  },
];

const FALLBACK: SymptomRule = {
  keywords: [], category: '1',
  causes: ['Cause incertaine — plusieurs systèmes possibles', 'Symptôme nécessitant un diagnostic sur place'],
  checks: ['Précisez : moment d’apparition (démarrage / roulage / freinage), bruit associé, voyants allumés'],
};

export interface IfixReply {
  text: string;
  mascot: IfixMascotState;
  safety: boolean;
  category: string;
  done: boolean;
}

function matchRule(text: string): SymptomRule {
  const lower = text.toLowerCase();
  let best: SymptomRule | null = null;
  let bestHits = 0;
  for (const rule of RULES) {
    const hits = rule.keywords.filter(k => lower.includes(k)).length;
    if (hits > bestHits) { best = rule; bestHits = hits; }
  }
  return best ?? FALLBACK;
}

/**
 * Append a user message and produce the IFIX reply. Messages inside an existing
 * session NEVER consume additional complimentary sessions.
 */
export function sendMessage(sessionId: string, userText: string): { ok: boolean; error?: string; reply?: IfixReply; session?: IfixSession } {
  const sessions = allSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return { ok: false, error: 'Session introuvable.' };
  if (!userText.trim()) return { ok: false, error: 'Message vide.' };
  const now = new Date().toISOString();
  session.messages.push({ id: `m-${Date.now()}-u`, role: 'user', text: userText.trim(), created_at: now });

  const rule = matchRule(userText);
  session.category_guess = rule.category;
  const turnCount = session.messages.filter(m => m.role === 'user').length;

  let reply: IfixReply;
  if (rule.safety === 'stop') {
    session.safety_flag = true;
    session.status = 'completed';
    session.summary = buildSummary(session, rule);
    reply = {
      mascot: 'safety', safety: true, category: rule.category, done: true,
      text: `${rule.safetyText}\n\nCe que cela pourrait être (pistes NON confirmées) :\n${rule.causes.map(c => `• ${c}`).join('\n')}\n\nMa recommandation : créez maintenant une demande de service — je peux orienter votre cas vers un professionnel disponible près de vous.`,
    };
  } else if (turnCount === 1) {
    reply = {
      mascot: 'thinking', safety: false, category: rule.category, done: false,
      text: `Je note ces symptômes. Pistes possibles (non confirmées) :\n${rule.causes.map(c => `• ${c}`).join('\n')}\n\nVérifications préliminaires sûres :\n${rule.checks.map(c => `• ${c}`).join('\n')}\n\nPour affiner : ce comportement apparaît-il au démarrage, en roulant ou au freinage ? Depuis combien de temps ?`,
    };
    if (rule.safety === 'caution') {
      reply.text += `\n\n${rule.safetyText}`;
      session.safety_flag = true;
    }
  } else {
    session.status = 'completed';
    session.summary = buildSummary(session, rule);
    reply = {
      mascot: 'explaining', safety: session.safety_flag, category: rule.category, done: true,
      text: `Merci, j’ai assez d’éléments pour une première orientation.\n\n${session.summary}\n\nSouhaitez-vous que je vous propose des professionnels adaptés, ou que je crée une demande de service ?`,
    };
  }

  session.messages.push({ id: `m-${Date.now()}-a`, role: 'ifix', mascot: reply.mascot, text: reply.text, created_at: new Date().toISOString() });
  session.updated_at = now;
  persist(sessions);
  return { ok: true, reply, session };
}

function buildSummary(session: IfixSession, rule: SymptomRule): string {
  const userMsgs = session.messages.filter(m => m.role === 'user').map(m => m.text);
  return [
    `Véhicule : ${session.vehicle_summary}`,
    `Symptômes rapportés par le client : ${userMsgs.join(' | ').slice(0, 400)}`,
    `Pistes envisagées (NON CONFIRMÉES — à valider par inspection professionnelle) : ${rule.causes.join('; ')}`,
    session.safety_flag ? 'CONSIGNES DE SÉCURITÉ : symptômes potentiellement dangereux signalés au client.' : 'Aucun signe d’alerte immédiate relevé.',
    'Assistant : IFIX AI (moteur de règles local — guide informationnel uniquement, ne remplace pas une inspection professionnelle).',
  ].join('\n');
}

export function recommendedProviders(session: IfixSession): ProviderInfo[] {
  return rankProvidersForCategory(session.category_guess ?? '1', 6);
}

/** Explicit consent action — nothing is ever shared without it. */
export function recordConsent(sessionId: string, decision: 'granted' | 'declined'): { ok: boolean; error?: string } {
  const sessions = allSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return { ok: false, error: 'Session introuvable.' };
  session.consent = decision;
  if (decision === 'declined') { session.shared_with_provider_id = null; session.shared_at = null; }
  session.updated_at = new Date().toISOString();
  persist(sessions);
  return { ok: true };
}

export function shareSummary(sessionId: string, providerId: string): { ok: boolean; error?: string; session?: IfixSession } {
  const sessions = allSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return { ok: false, error: 'Session introuvable.' };
  if (session.consent !== 'granted') return { ok: false, error: 'Consentement requis avant tout partage.' };
  if (!session.summary) session.summary = buildSummary(session, matchRule(session.messages.filter(m => m.role === 'user').map(m => m.text).join(' ')));
  session.shared_with_provider_id = providerId;
  session.shared_at = new Date().toISOString();
  session.updated_at = session.shared_at;
  persist(sessions);
  return { ok: true, session };
}

export function attachRequestToSession(sessionId: string, requestId: string) {
  const sessions = allSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) { session.request_id = requestId; session.updated_at = new Date().toISOString(); persist(sessions); }
}

export function resetIfixDemo() {
  saveState(K_SESSIONS, []);
}
