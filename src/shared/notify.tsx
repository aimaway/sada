import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * Structured toast notifications.
 *
 * Replaces the native `toast()` calls that were scattered across ~30 portal
 * screens: native alerts block the JS thread, look broken on mobile/PWA and
 * cannot be styled or localized. `<ToastHost />` is mounted once in App;
 * anywhere in the tree you can call:
 *
 *   const toast = useToast();
 *   toast('Compte supprimé (simulation)');          // info
 *   toast('Erreur réseau', { type: 'error' });      // error
 */

export type ToastType = 'info' | 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

type ToastFn = (message: string, opts?: { type?: ToastType }) => void;

const ToastContext = createContext<ToastFn | null>(null);

let seq = 0;

const STYLES: Record<ToastType, string> = {
  info: 'bg-slate-800 text-white',
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback<ToastFn>((message, opts) => {
    const id = ++seq;
    const type: ToastType = opts?.type ?? 'info';
    setItems((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast host — fixed, above everything, pointer-events off except buttons */}
      <div className="fixed inset-x-0 bottom-20 z-[9999] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={`max-w-md w-full rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${STYLES[t.type]} animate-[fadeIn_150ms_ease-out]`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Defensive fallback so legacy code paths never crash if the provider
    // is missing (e.g. isolated component tests).
    return (message) => {
      // eslint-disable-next-line no-console
      console.warn('[toast] ToastProvider missing:', message);
    };
  }
  return ctx;
}
