import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Persist the global demo/live toggle so a refresh (or a new tab) keeps the
// same data source. Default = demo ON (offline-friendly).
const DEMO_KEY = 'tomobily_demo_mode';
function readDemoFlag(): boolean {
  try { return localStorage.getItem(DEMO_KEY) !== 'live'; } catch { return true; }
}

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(readDemoFlag); // Activé par défaut

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      try { localStorage.setItem(DEMO_KEY, next ? 'demo' : 'live'); } catch {}
      return next;
    });
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider');
  }
  return context;
};
