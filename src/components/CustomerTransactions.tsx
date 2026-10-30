import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { mockClientData } from '../data/mockDataGlobal';
import {
  ArrowLeft, TrendingUp, TrendingDown, Filter, Download, Search,
  Calendar, CreditCard, ArrowRight
} from 'lucide-react';

export const CustomerTransactions: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allTransactions = [
    ...mockClientData.wallet.transactions,
    {
      id: 'TXN-003',
      date: '2024-03-05',
      type: 'debit' as const,
      amount: 25000,
      description: 'Paiement tuning - Speed Tuning',
      status: 'completed' as const,
    },
    {
      id: 'TXN-004',
      date: '2024-03-01',
      type: 'credit' as const,
      amount: 10000,
      description: 'Remboursement - Annulation',
      status: 'completed' as const,
    },
    {
      id: 'TXN-005',
      date: '2024-02-28',
      type: 'debit' as const,
      amount: 48000,
      description: 'Paiement réparation - Karim T.',
      status: 'completed' as const,
    },
  ];

  const filteredTransactions = allTransactions.filter((tx) => {
    if (filter === 'credit' && tx.type !== 'credit') return false;
    if (filter === 'debit' && tx.type !== 'debit') return false;
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalCredits = allTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = allTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/customer/profile')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Historique transactions</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">Entrées</p>
            <p className="text-sm font-bold text-emerald-600">+{(totalCredits / 100).toFixed(0)} MAD</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">Sorties</p>
            <p className="text-sm font-bold text-red-600">-{(totalDebits / 100).toFixed(0)} MAD</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <CreditCard className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-600">Solde</p>
            <p className="text-sm font-bold text-blue-600">{(mockClientData.wallet.balance / 100).toFixed(0)} MAD</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une transaction..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'credit', label: 'Entrées' },
              { id: 'debit', label: 'Sorties' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'credit' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{tx.description}</p>
                    <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{(tx.amount / 100).toFixed(0)} MAD
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Aucune transaction trouvée</p>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={() => toast('Export CSV en cours...')}
          className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exporter en CSV
        </button>
      </div>
    </div>
  );
};
