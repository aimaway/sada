import React from 'react';
import { useDemo } from '../shared/DemoContext';
import { Play, Pause } from 'lucide-react';

export const DemoToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemo();

  return (
    <button
      onClick={toggleDemoMode}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 ${
        isDemoMode 
          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
          : 'bg-slate-700 text-white hover:bg-slate-800'
      }`}
      title={isDemoMode ? 'Mode Démo Activé' : 'Mode Production'}
    >
      {isDemoMode ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
      <span className="font-medium text-sm">
        {isDemoMode ? 'Démo' : 'Live'}
      </span>
    </button>
  );
};
