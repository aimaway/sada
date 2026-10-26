import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Star, Award, TrendingUp, CheckCircle } from 'lucide-react';

export const PremiumAccounts = () => {
  const navigate = useNavigate();
  const { setUser, setMechanicProfile } = useApp();

  const premiumAccounts = [
    {
      id: 'premium_client',
      type: 'client',
      name: 'Amine Khalid',
      avatar: '👨‍💼',
      role: 'Client Premium',
      jobs: 2500,
      rating: 5.0,
      color: 'from-emerald-500 to-teal-600',
      description: 'Client fidèle depuis 3 ans. 2500 interventions réalisées.',
      login: () => {
        setUser({
          id: 'u_c_premium',
          phone: '+212600000099',
          role: 'customer',
          full_name: 'Amine Khalid',
          status: 'active',
          language: 'fr',
          created_at: '2021-03-15',
        });
        navigate('/customer/home-enhanced');
      },
    },
    {
      id: 'premium_mechanic',
      type: 'mechanic',
      name: 'Ahmed Benali',
      avatar: '👨‍🔧',
      role: 'Mécanicien Expert',
      jobs: 3000,
      rating: 5.0,
      color: 'from-blue-500 to-indigo-600',
      description: '15 ans d\'expérience. 3000 interventions, note 5 étoiles.',
      login: () => {
        setUser({
          id: 'u_m_expert',
          phone: '+212600000088',
          role: 'mechanic',
          full_name: 'Ahmed Benali',
          status: 'active',
          language: 'fr',
          created_at: '2019-01-10',
        });
        setMechanicProfile({
          id: 'u_m_expert',
          user_id: 'u_m_expert',
          verification_status: 'approved',
          is_online: true,
        });
        navigate('/mechanic/profile-enhanced');
      },
    },
    {
      id: 'premium_tuner',
      type: 'tuner',
      name: 'Youssef "Speed" El Mansouri',
      avatar: '🏎️',
      role: 'Tuner Spécialiste',
      jobs: 1500,
      rating: 5.0,
      color: 'from-red-500 to-orange-600',
      description: 'Spécialiste Stage 1-3. 1500 préparations réussies.',
      login: () => {
        navigate('/tuner/speed-tuning-casa');
      },
    },
    {
      id: 'premium_seller',
      type: 'seller',
      name: 'Karim Tazi',
      avatar: '🏪',
      role: 'Vendeur Établi',
      jobs: 2000,
      rating: 5.0,
      color: 'from-purple-500 to-pink-600',
      description: 'AutoPièces Maroc. 2000 ventes, 5 étoiles.',
      login: () => {
        navigate('/seller/autopieces-maroc');
      },
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Comptes Premium
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Testez avec nos comptes de démonstration
          </h2>
          <p className="text-lg text-slate-400">
            4 comptes réels avec des profils complets et des évaluations 5 étoiles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105"
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{account.avatar}</div>
                <h3 className="text-xl font-bold text-white mb-1">{account.name}</h3>
                <p className="text-sm text-slate-300">{account.role}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Jobs réalisés</span>
                  <span className="text-lg font-bold text-white">{account.jobs.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Note</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm font-bold text-white ml-1">{account.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-4 text-center">{account.description}</p>

              <button
                onClick={account.login}
                className={`w-full py-3 bg-gradient-to-r ${account.color} text-white rounded-xl font-bold hover:opacity-90 transition-opacity`}
              >
                Se connecter
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Comment utiliser ces comptes ?
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Cliquez sur "Se connecter" pour accéder directement au compte premium. 
                Vous pourrez explorer toutes les fonctionnalités avec des données réalistes.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                  ✓ 5 étoiles
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  ✓ 250-3000 jobs
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                  ✓ Profils complets
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs">
                  ✓ Données réalistes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
