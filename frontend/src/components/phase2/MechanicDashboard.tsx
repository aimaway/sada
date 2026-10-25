import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, TrendingUp, DollarSign, Clock, Star, BarChart3 } from 'lucide-react';

// Mock data for demo
const mockDashboard = {
  totalProfileViews: 1245,
  totalRequestViews: 3420,
  totalOffersSent: 234,
  totalOffersAccepted: 189,
  totalJobsCompleted: 234,
  totalEarned: 5850000, // in centimes (58,500 MAD)
  totalCommissionPaid: 585000, // in centimes (5,850 MAD)
  acceptanceRate: 80.8,
  averageRating: 4.8,
  responseTimeAvg: 3.2,
};

const mockRecentStats = [
  { date: '2024-03-15', profileViews: 45, requestViews: 120, offersSent: 8, offersAccepted: 7, jobsCompleted: 7, totalEarned: 175000, commissionPaid: 17500 },
  { date: '2024-03-14', profileViews: 38, requestViews: 95, offersSent: 6, offersAccepted: 5, jobsCompleted: 5, totalEarned: 125000, commissionPaid: 12500 },
  { date: '2024-03-13', profileViews: 52, requestViews: 140, offersSent: 10, offersAccepted: 9, jobsCompleted: 9, totalEarned: 225000, commissionPaid: 22500 },
  { date: '2024-03-12', profileViews: 41, requestViews: 110, offersSent: 7, offersAccepted: 6, jobsCompleted: 6, totalEarned: 150000, commissionPaid: 15000 },
  { date: '2024-03-11', profileViews: 35, requestViews: 88, offersSent: 5, offersAccepted: 4, jobsCompleted: 4, totalEarned: 100000, commissionPaid: 10000 },
];

export const MechanicDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Dashboard Mécanicien</h1>
            <p className="text-sm opacity-90">Statistiques et performance</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm opacity-90">Gains totaux</span>
            </div>
            <p className="text-2xl font-bold">
              {(mockDashboard.totalEarned / 100).toLocaleString()} MAD
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm opacity-90">Taux d'acceptation</span>
            </div>
            <p className="text-2xl font-bold">{mockDashboard.acceptanceRate}%</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-600">Vues profil</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {mockDashboard.totalProfileViews.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-slate-600">Vues demandes</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {mockDashboard.totalRequestViews.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-slate-600">Note moyenne</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{mockDashboard.averageRating}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-slate-600">Temps réponse</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{mockDashboard.responseTimeAvg} min</p>
          </div>
        </div>

        {/* Offers Stats */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Offres envoyées</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Offres envoyées</span>
              <span className="font-bold text-slate-800">{mockDashboard.totalOffersSent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Offres acceptées</span>
              <span className="font-bold text-green-600">{mockDashboard.totalOffersAccepted}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-sm font-medium text-slate-700">Taux de conversion</span>
              <span className="text-lg font-bold text-blue-600">
                {((mockDashboard.totalOffersAccepted / mockDashboard.totalOffersSent) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Activité récente</h3>
          <div className="space-y-3">
            {mockRecentStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {new Date(stat.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {stat.jobsCompleted} jobs • {(stat.totalEarned / 100).toFixed(0)} MAD
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    {stat.offersAccepted}/{stat.offersSent}
                  </p>
                  <p className="text-xs text-slate-500">offres</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Summary */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
          <h3 className="font-semibold text-slate-800 mb-3">Résumé commission</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Gains bruts</span>
              <span className="font-medium text-slate-800">
                {(mockDashboard.totalEarned / 100).toLocaleString()} MAD
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Commission plateforme (10%)</span>
              <span className="font-medium text-red-600">
                -{(mockDashboard.totalCommissionPaid / 100).toLocaleString()} MAD
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
              <span className="text-sm font-medium text-slate-700">Gains nets</span>
              <span className="text-xl font-bold text-emerald-600">
                {((mockDashboard.totalEarned - mockDashboard.totalCommissionPaid) / 100).toLocaleString()} MAD
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/mechanic/public-profile')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
          >
            <Eye className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-medium text-slate-800">Voir profil public</p>
          </button>
          <button
            onClick={() => navigate('/mechanic/wallet')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm font-medium text-slate-800">Portefeuille</p>
          </button>
        </div>
      </div>
    </div>
  );
};
