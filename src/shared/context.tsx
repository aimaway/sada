import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'fr' | 'ar';

interface User {
  id: string;
  phone: string;
  role: 'customer' | 'mechanic' | 'admin' | 'seller';
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
