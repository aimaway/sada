import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMechanicData } from '../data/mockDataGlobal';
import {
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, CheckCircle2, Clock,
  Star, Award, Target, BarChart3, Calendar
} from 'lucide-react';

export const MechanicStats: React.FC = () => {
  const navigate = useNavigate();
  const stats = mockMechanicData.stats;

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const weeklyData = [
    { label: 'Lun', jobs: 8, earnings: 2400 },
    { label: 'Mar', jobs: 12, earnings: 3600 },
    { label: 'Mer', jobs: 6, earnings: 1800 },
    { label: 'Jeu', jobs: 10, earnings: 3000 },
    { label: 'Ven', jobs: 14, earnings: 4200 },
    { label: 'Sam', jobs: 9, earnings: 2700 },
    { label: 'Dim', jobs: 5, earnings: 1500 },
  ];

  const monthlyData = [
    { label: 'Jan', jobs: 85, earnings: 25500 },
    { label: 'Fév', jobs: 92, earnings: 27600 },
    { label: 'Mar', jobs: 78, earnings: 23400 },
    { label: 'Avr', jobs: 105, earnings: 31500 },
    { label: 'Mai', jobs: 112, earnings: 33600 },
    { label: 'Jun', jobs: 98, earnings: 29400 },
  ];

  const data = timeRange === 'week' ? weeklyData : timeRange === 'month' ? monthlyData : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/mechanic/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Statistiques</h1>
            <p className="text-xs text-slate-500">Votre performance en détail</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Time Range Selector */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex gap-2">
            {[
              { id: 'week', label: 'Semaine' },
              { id: 'month', label: 'Mois' },
              { id: 'year', label: 'Année' },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  timeRange === range.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4">
            <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
            <p className="text-xs opacity-90">Jobs totaux</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-4">
            <DollarSign className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{(stats.totalEarned / 100).toLocaleString()}</p>
            <p className="text-xs opacity-90">MAD gagnés</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4">
            <Target className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.acceptanceRate}%</p>
            <p className="text-xs opacity-90">Taux d'acceptation</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-4">
            <Star className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.averageRating}</p>
            <p className="text-xs opacity-90">Note moyenne</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Performance
          </h3>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-12">{item.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.jobs / Math.max(...data.map(d => d.jobs))) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.jobs}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-800 w-20 text-right">
                  {(item.earnings / 100).toFixed(0)} MAD
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Métriques de performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-700">Temps de réponse moyen</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{stats.responseTime} min</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-slate-700">Taux de complétion</span>
              </div>
              <span className="text-sm font-bold text-slate-800">98%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-red-600" />
                <span className="text-sm text-slate-700">Commission payée</span>
              </div>
              <span className="text-sm font-bold text-red-600">-{(stats.totalCommission / 100).toLocaleString()} MAD</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-slate-700">Gains nets</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                +{((((stats.totalEarned - stats.totalCommission) / 100)).toLocaleString())} MAD
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Réalisations
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-xs font-medium text-slate-800">Top 10%</p>
              <p className="text-[10px] text-slate-500">Mécaniciens</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <p className="text-xs font-medium text-slate-800">5 étoiles</p>
              <p className="text-[10px] text-slate-500">50+ avis</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🚀</div>
              <p className="text-xs font-medium text-slate-800">Rapide</p>
              <p className="text-[10px] text-slate-500">&lt;2 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
