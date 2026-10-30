import React, { createContext, useContext, useState, useEffect, useCallback, type Dispatch, type SetStateAction, type ReactNode } from 'react';

// Session persistence: the auth context used to live only in SPA memory, so any
// page refresh (or returning to the PWA) silently logged the user out and sent
// them back to the landing page. The session is now mirrored to localStorage
// under `tomobily_app_session` and rehydrated on mount.
const SESSION_KEY = 'tomobily_app_session';

function readPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (u && typeof u.id === 'string' && typeof u.role === 'string') return u as User;
    return null;
  } catch {
    return null;
  }
}

function writePersistedUser(u: User | null) {
  try {
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable (private mode) — session stays in memory only */
  }
}

export type Language = 'fr' | 'ar';

interface User {
  id: string;
  phone: string;
  role: 'customer' | 'mechanic' | 'admin' | 'seller' | 'tuner';
  full_name: string;
  status: string;
  language: Language;
  created_at: string;
}

interface MechanicProfile {
  id: string;
  user_id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_online: boolean;
  [key: string]: any;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  mechanicProfile: MechanicProfile | null;
  setMechanicProfile: (profile: MechanicProfile | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  // Rehydrate the session synchronously on first render so protected routes
  // survive a page refresh (no flash of logged-out state).
  const [user, setUserState] = useState<User | null>(() => readPersistedUser());
  const [mechanicProfile, setMechanicProfile] = useState<MechanicProfile | null>(null);

  // Keep the exposed setter API-compatible (accepts value or updater) while
  // mirroring every change to localStorage.
  const setUser: Dispatch<SetStateAction<User | null>> = useCallback((update) => {
    setUserState((prev) => {
      const next = typeof update === 'function' ? (update as (p: User | null) => User | null)(prev) : update;
      writePersistedUser(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setMechanicProfile(null);
  }, [setUser]);

  // Log out cleanly if the session is cleared/changed from another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) setUserState(readPersistedUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      user,
      setUser,
      mechanicProfile,
      setMechanicProfile,
      isAuthenticated: !!user,
      logout,
    }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ------------------------------------------------------------
// Demo/test-phase identity resolution (documented in DEMO_MODE.md)
// The lightweight login screens create users with ids like 'u_new' /
// 'u_new_m' that don't exist in the unified mock dataset. Marketplace
// pages need a canonical seeded identity so the customer↔provider loop
// works end-to-end during development. Real auth will replace this.
// ------------------------------------------------------------
import { mockUsers } from './unifiedMockData';

export function resolveDemoIdentity(user: User | null): User | null {
  if (!user) return null;
  if (user.role === 'customer') {
    const known = (mockUsers as any).customers?.find((c: any) => c.id === user.id);
    if (known) return { ...user, full_name: known.full_name };
    // unknown/new customer -> fall back to seeded demo customer for marketplace flow
    const fallback = (mockUsers as any).customers?.find((c: any) => c.id === 'u_c1');
    return fallback ? { ...user, id: fallback.id, full_name: fallback.full_name } : user;
  }
  if (user.role === 'mechanic') {
    const known = (mockUsers as any).mechanics?.find((m: any) => m.id === user.id);
    if (known) return { ...user, full_name: known.full_name };
    const fallback = (mockUsers as any).mechanics?.find((m: any) => m.id === 'u_m1');
    return fallback ? { ...user, id: fallback.id, full_name: fallback.full_name } : user;
  }
  return user;
}
