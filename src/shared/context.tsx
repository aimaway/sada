import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
  setUser: (user: User | null) => void;
  mechanicProfile: MechanicProfile | null;
  setMechanicProfile: (profile: MechanicProfile | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  const [user, setUser] = useState<User | null>(null);
  const [mechanicProfile, setMechanicProfile] = useState<MechanicProfile | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setMechanicProfile(null);
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
