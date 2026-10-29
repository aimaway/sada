import React from 'react';
import type { IfixMascotState } from './ifixAi';

// ============================================
// IFIX AI — MASCOT COMPONENT (SVG, 10 states)
// ============================================
// Compact robotic automotive co-pilot: rounded white/charcoal capsule body,
// dark glossy visor with expressive cyan eyes, emerald + teal accents, headlight
// "cheeks", tire-tread base and a tiny diagnostic tablet in mechanic mode.
// Recognizable silhouette at small sizes; works on light and dark backgrounds.
// Brand palette lives here only (single source of truth for the character).

export const IFIX_COLORS = {
  shell: '#F4F7FA',
  shellShade: '#DDE5EC',
  charcoal: '#2B3440',
  visor: '#101820',
  eye: '#22D3EE',
  emerald: '#10B981',
  teal: '#14B8A6',
  amber: '#F59E0B',
  red: '#EF4444',
};

interface Props {
  state?: IfixMascotState;
  size?: number;
  className?: string;
  /** Show the IFIX wordmark under the character */
  wordmark?: boolean;
}


export function IfixMascot({ state = 'idle', size = 96, className = '', wordmark = false }: Props) {
  const uid = React.useId().replace(/[:]/g, '');
  const visorGrad = `visor-${uid}`;
  const bodyGrad = `body-${uid}`;

  // Per-state eyes & extras ------------------------------------------------
  let leftEye: React.ReactNode, rightEye: React.ReactNode, extras: React.ReactNode = null;
  const eyeBase = (cx: number, ry: number, fill = IFIX_COLORS.eye) => (
    <ellipse cx={cx} cy={44} rx={7} ry={ry} fill={fill}>
      <animate attributeName="ry" values={`${ry};${Math.max(1, ry * 0.2)};${ry}`} dur="4s" repeatCount="indefinite" />
    </ellipse>
  );

  switch (state) {
    case 'welcome':
      leftEye = eyeBase(37, 8); rightEye = eyeBase(63, 8);
      extras = (<g>
        {/* raised waving arm */}
        <rect x="76" y="52" width="7" height="18" rx="3.5" fill={IFIX_COLORS.charcoal} transform="rotate(-38 79 61)" />
        <circle cx="88" cy="48" r="4.5" fill={IFIX_COLORS.shell} stroke={IFIX_COLORS.charcoal} strokeWidth="1.5" />
        <path d="M40 52 Q50 58 60 52" stroke={IFIX_COLORS.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="82" cy="26" r="2" fill={IFIX_COLORS.emerald}><animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" /></circle>
        <circle cx="20" cy="30" r="1.5" fill={IFIX_COLORS.teal}><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" /></circle>
      </g>);
      break;
    case 'listening':
      leftEye = eyeBase(37, 6); rightEye = eyeBase(63, 6);
      extras = (<g>
        {/* antenna with pulsing tip + sound waves */}
        <line x1="50" y1="18" x2="50" y2="10" stroke={IFIX_COLORS.charcoal} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="8" r="3" fill={IFIX_COLORS.eye}><animate attributeName="r" values="3;4.5;3" dur="1.2s" repeatCount="indefinite" /></circle>
        <path d="M78 40 Q84 44 78 48" stroke={IFIX_COLORS.teal} strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M82 36 Q90 44 82 52" stroke={IFIX_COLORS.teal} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M40 53 Q50 57 60 53" stroke={IFIX_COLORS.eye} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>);
      break;
    case 'thinking':
      leftEye = <circle cx="37" cy="44" r="6" fill={IFIX_COLORS.eye} />;
      rightEye = <circle cx="63" cy="44" r="6" fill={IFIX_COLORS.eye} />;
      extras = (<g>
        <circle cx="37" cy="44" r="6" fill="none" stroke={IFIX_COLORS.emerald} strokeWidth="2" strokeDasharray="6 4">
          <animateTransform attributeName="transform" type="rotate" from="0 37 44" to="360 37 44" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <text x="72" y="24" fontSize="9" fill={IFIX_COLORS.charcoal} fontWeight="bold">?</text>
        <path d="M44 54 L56 54" stroke={IFIX_COLORS.eye} strokeWidth="2" strokeLinecap="round" />
      </g>);
      break;
    case 'explaining':
      leftEye = eyeBase(37, 7); rightEye = eyeBase(63, 7);
      extras = (<g>
        {/* presenting gesture toward a small dashboard card */}
        <rect x="74" y="34" width="22" height="16" rx="3" fill={IFIX_COLORS.charcoal} />
        <rect x="77" y="37" width="16" height="3" rx="1.5" fill={IFIX_COLORS.eye} />
        <rect x="77" y="42" width="10" height="2.5" rx="1.25" fill={IFIX_COLORS.teal} />
        <rect x="77" y="46" width="13" height="2" rx="1" fill={IFIX_COLORS.emerald} opacity="0.8" />
        <rect x="20" y="56" width="6" height="14" rx="3" fill={IFIX_COLORS.charcoal} transform="rotate(24 23 63)" />
        <path d="M42 53 Q50 59 58 53" stroke={IFIX_COLORS.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>);
      break;
    case 'success':
      leftEye = <path d="M31 44 L37 49 L43 42" stroke={IFIX_COLORS.eye} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      rightEye = <path d="M57 44 L63 49 L69 42" stroke={IFIX_COLORS.eye} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      extras = (<g>
        <circle cx="50" cy="8" r="6" fill={IFIX_COLORS.emerald} />
        <path d="M47.5 8 L49.5 10 L53 5.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 54 Q50 60 60 54" stroke={IFIX_COLORS.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="18" cy="24" r="1.6" fill={IFIX_COLORS.amber}><animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite" /></circle>
        <circle cx="82" cy="20" r="1.6" fill={IFIX_COLORS.teal}><animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite" /></circle>
      </g>);
      break;
    case 'concerned':
      leftEye = eyeBase(37, 5); rightEye = eyeBase(63, 5);
      extras = (<g>
        <line x1="30" y1="33" x2="43" y2="36" stroke={IFIX_COLORS.charcoal} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="70" y1="33" x2="57" y2="36" stroke={IFIX_COLORS.charcoal} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M44 55 Q50 52 56 55" stroke={IFIX_COLORS.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="74" y="26" fontSize="10" fill={IFIX_COLORS.charcoal} fontWeight="bold">…</text>
      </g>);
      break;
    case 'safety':
      leftEye = <path d="M31 41 L43 47 M43 41 L31 47" stroke={IFIX_COLORS.red} strokeWidth="2.6" strokeLinecap="round" />;
      rightEye = <path d="M57 41 L69 47 M69 41 L57 47" stroke={IFIX_COLORS.red} strokeWidth="2.6" strokeLinecap="round" />;
      extras = (<g>
        <path d="M50 4 L58 18 H42 Z" fill={IFIX_COLORS.amber} stroke={IFIX_COLORS.charcoal} strokeWidth="1.2" />
        <text x="50" y="16" fontSize="9" textAnchor="middle" fill={IFIX_COLORS.charcoal} fontWeight="bold">!</text>
        <rect x="10" y="40" width="4" height="10" rx="2" fill={IFIX_COLORS.red}><animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" /></rect>
        <rect x="86" y="40" width="4" height="10" rx="2" fill={IFIX_COLORS.red}><animate attributeName="opacity" values="0.2;1;0.2" dur="0.8s" repeatCount="indefinite" /></rect>
      </g>);
      break;
    case 'connecting':
      leftEye = eyeBase(37, 6); rightEye = eyeBase(63, 6);
      extras = (<g>
        {/* radar sweep */}
        <circle cx="50" cy="44" r="30" fill="none" stroke={IFIX_COLORS.teal} strokeWidth="1.4" opacity="0.35">
          <animate attributeName="r" values="24;34;24" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="76" cy="26" r="2.5" fill={IFIX_COLORS.emerald}><animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" /></circle>
        <circle cx="22" cy="22" r="2" fill={IFIX_COLORS.eye}><animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite" /></circle>
        <path d="M42 54 Q50 58 58 54" stroke={IFIX_COLORS.eye} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>);
      break;
    case 'mechanic':
      leftEye = eyeBase(37, 7); rightEye = eyeBase(63, 7);
      extras = (<g>
        {/* mechanic cap + diagnostic tablet */}
        <path d="M32 22 Q50 12 68 22 L68 25 H32 Z" fill={IFIX_COLORS.charcoal} />
        <rect x="44" y="16" width="12" height="5" rx="2" fill={IFIX_COLORS.emerald} />
        <rect x="72" y="52" width="18" height="13" rx="2.5" fill={IFIX_COLORS.charcoal} />
        <rect x="74.5" y="54.5" width="13" height="8" rx="1.5" fill={IFIX_COLORS.visor} />
        <path d="M76 60 L79 57 L81 59 L85 55.5" stroke={IFIX_COLORS.eye} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M42 53 Q50 58 58 53" stroke={IFIX_COLORS.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>);
      break;
    default: // idle
      leftEye = eyeBase(37, 7); rightEye = eyeBase(63, 7);
      break;
  }

  return (
    <span className={`inline-flex flex-col items-center ${className}`} role="img" aria-label={`IFIX AI — ${state}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={IFIX_COLORS.shell} />
            <stop offset="100%" stopColor={IFIX_COLORS.shellShade} />
          </linearGradient>
          <radialGradient id={visorGrad} cx="0.35" cy="0.3" r="1">
            <stop offset="0%" stopColor="#26313d" />
            <stop offset="100%" stopColor={IFIX_COLORS.visor} />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="50" cy="93" rx="26" ry="4" fill="#0f172a" opacity="0.12" />

        {extras && <g>{extras}</g>}

        {/* body capsule */}
        <rect x="22" y="20" width="56" height="60" rx="26" fill={`url(#${bodyGrad})`} stroke={IFIX_COLORS.charcoal} strokeWidth="2.5" />

        {/* visor */}
        <rect x="28" y="32" width="44" height="26" rx="13" fill={`url(#${visorGrad})`} stroke={IFIX_COLORS.charcoal} strokeWidth="1.5" />
        {/* visor gloss */}
        <path d="M33 36 Q50 32 66 36" stroke="#ffffff" strokeWidth="1.6" opacity="0.22" strokeLinecap="round" />

        {leftEye}
        {rightEye}

        {/* headlight cheeks */}
        <circle cx="26" cy="46" r="3.4" fill={IFIX_COLORS.amber} opacity="0.9" stroke={IFIX_COLORS.charcoal} strokeWidth="1.2" />
        <circle cx="74" cy="46" r="3.4" fill={IFIX_COLORS.red} opacity="0.85" stroke={IFIX_COLORS.charcoal} strokeWidth="1.2" />

        {/* chest dashboard strip */}
        <rect x="36" y="64" width="28" height="8" rx="4" fill={IFIX_COLORS.charcoal} />
        <circle cx="42" cy="68" r="1.8" fill={IFIX_COLORS.eye} />
        <circle cx="50" cy="68" r="1.8" fill={IFIX_COLORS.emerald} />
        <circle cx="58" cy="68" r="1.8" fill={IFIX_COLORS.teal} />

        {/* side arms */}
        <rect x="14" y="50" width="6" height="16" rx="3" fill={IFIX_COLORS.charcoal} />
        <rect x="80" y="50" width="6" height="16" rx="3" fill={IFIX_COLORS.charcoal} />

        {/* tire-tread feet */}
        <rect x="30" y="80" width="16" height="9" rx="4.5" fill={IFIX_COLORS.charcoal} />
        <rect x="54" y="80" width="16" height="9" rx="4.5" fill={IFIX_COLORS.charcoal} />
        <line x1="33" y1="84.5" x2="43" y2="84.5" stroke={IFIX_COLORS.shellShade} strokeWidth="1.4" />
        <line x1="57" y1="84.5" x2="67" y2="84.5" stroke={IFIX_COLORS.shellShade} strokeWidth="1.4" />
      </svg>
      {wordmark && (
        <span className="mt-1 select-none font-extrabold tracking-tight" style={{ fontSize: Math.max(11, size / 5.5) }}>
          <span style={{ color: IFIX_COLORS.charcoal }}>IFIX</span>
          <span style={{ color: IFIX_COLORS.emerald }}> AI</span>
        </span>
      )}
    </span>
  );
}

/** Compact avatar variant for chat bubbles / nav badges */
export function IfixAvatar({ size = 36, state = 'idle' }: { size?: number; state?: IfixMascotState }) {
  return <IfixMascot state={state} size={size} />;
}

export default IfixMascot;
