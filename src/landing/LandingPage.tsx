import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Button } from '../shared/components';
import { Wrench, MapPin, Shield, Star, Clock } from 'lucide-react';

export default function LandingPage() {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">MécaCasablanca</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 rounded-lg">
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <Button size="sm" onClick={() => navigate('/customer/login')}>Commencer</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-3.5 h-3.5" /> Casablanca
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Votre mécanicien vient chez vous
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Proposez votre prix. Choisissez votre mécanicien. Réparation à domicile à Casablanca.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/customer/login')}>Pour les clients →</Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/mechanic/login')}>Pour les mécaniciens</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4">🎮 Mode Démo</span>
            <h2 className="text-2xl font-bold text-white mb-2">Tester l'application</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { emoji: '👤', title: 'Client', desc: 'Nouveau ou existant', color: 'bg-emerald-600', route: '/customer/login' },
              { emoji: '🔧', title: 'Mécanicien', desc: 'Approuvé ou nouveau', color: 'bg-blue-600', route: '/mechanic/login' },
              { emoji: '🏪', title: 'Vendeur', desc: 'Boutique & partenariats', color: 'bg-purple-600', route: '/seller/login' },
              { emoji: '🛡️', title: 'Admin', desc: 'Panneau admin', color: 'bg-slate-600', route: '/admin/login' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-700/50 rounded-2xl p-5 border border-slate-600">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                <button onClick={() => navigate(item.route)} className={`w-full ${item.color} text-white rounded-xl py-2 text-sm font-medium hover:opacity-90 transition-opacity`}>
                  Connexion
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs">© 2024 MécaCasablanca</p>
        </div>
      </footer>
    </div>
  );
}
