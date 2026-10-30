import React, { useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { mockMechanicData } from '../data/mockDataGlobal';
import {
  ArrowLeft, CreditCard, Smartphone, Plus, Trash2, CheckCircle2,
  X, Save, Shield, AlertCircle, DollarSign, TrendingUp, TrendingDown
} from 'lucide-react';

export const MechanicPayouts: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const wallet = mockMechanicData.wallet;

  const [payoutMethods, setPayoutMethods] = useState([
    {
      id: 'pm1',
      type: 'bank',
      label: 'Virement bancaire - CIH Bank',
      accountNumber: '****4242',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'orange_money',
      label: 'Orange Money - +212 6XX XXX XXX',
      accountNumber: '+212 6XX XXX XXX',
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: '',
    bankName: '',
    accountNumber: '',
    phone: '',
  });

  const [payoutHistory] = useState([
    {
      id: 'po1',
      date: '2024-03-15',
      amount: 50000,
      method: 'Virement bancaire',
      status: 'completed',
    },
    {
      id: 'po2',
      date: '2024-03-01',
      amount: 35000,
      method: 'Orange Money',
      status: 'completed',
    },
    {
      id: 'po3',
      date: '2024-02-15',
      amount: 45000,
      method: 'Virement bancaire',
      status: 'completed',
    },
  ]);

  const handleAddMethod = () => {
    const method = {
      id: `pm${Date.now()}`,
      type: newMethod.type,
      label: newMethod.type === 'bank'
        ? `Virement bancaire - ${newMethod.bankName}`
        : `${newMethod.type === 'orange_money' ? 'Orange Money' : newMethod.type === 'inwi_money' ? 'inwi Money' : 'Maroc Telecom'} - ${newMethod.phone}`,
      accountNumber: newMethod.type === 'bank' ? newMethod.accountNumber : newMethod.phone,
      isDefault: payoutMethods.length === 0,
    };
    setPayoutMethods([...payoutMethods, method]);
    setShowAddModal(false);
    setNewMethod({ type: '', bankName: '', accountNumber: '', phone: '' });
  };

  const handleSetDefault = (id: string) => {
    setPayoutMethods(payoutMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
  };

  const handleDeleteMethod = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      setPayoutMethods(payoutMethods.filter(pm => pm.id !== id));
    }
  };

  const handleRequestPayout = () => {
    if (wallet.balance < wallet.minBalance) {
      toast(`Solde insuffisant. Minimum requis : ${(wallet.minBalance / 100).toFixed(0)} MAD`);
      return;
    }
    toast(`Demande de retrait de ${(wallet.balance / 100).toFixed(0)} MAD envoyée !`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mechanic/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Configuration des paiements</h1>
              <p className="text-xs text-slate-500">Gérez vos méthodes de retrait</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
          <p className="text-sm opacity-90 mb-1">Solde disponible</p>
          <p className="text-4xl font-bold">{(wallet.balance / 100).toFixed(0)} <span className="text-lg font-normal opacity-80">MAD</span></p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${Math.min(100, (wallet.balance / (wallet.minBalance * 4)) * 100)}%` }}
              />
            </div>
            <span className="text-xs opacity-80">Min: {(wallet.minBalance / 100).toFixed(0)} MAD</span>
          </div>
          <button
            onClick={handleRequestPayout}
            disabled={wallet.balance < wallet.minBalance}
            className="w-full mt-4 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Demander un retrait
          </button>
        </div>

        {/* Payout Methods */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Méthodes de retrait</h3>
          <div className="space-y-2">
            {payoutMethods.map((method) => (
              <div key={method.id} className={`p-3 rounded-xl border-2 ${method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    method.type === 'bank' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {method.type === 'bank' ? (
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{method.label}</p>
                    <p className="text-xs text-slate-500">{method.accountNumber}</p>
                  </div>
                  {method.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Par défaut
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-xs text-blue-600 font-medium hover:text-blue-700"
                    >
                      Définir par défaut
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Historique des retraits</h3>
          <div className="space-y-2">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{payout.method}</p>
                    <p className="text-xs text-slate-500">{new Date(payout.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">-{(payout.amount / 100).toFixed(0)} MAD</p>
                  <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                    {payout.status === 'completed' ? 'Complété' : 'En cours'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Paiements sécurisés</p>
              <p className="text-xs text-blue-700 mt-1">
                Tous les retraits sont traités sous 24-48h. Vos informations bancaires sont cryptées et sécurisées.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Ajouter une méthode de retrait</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMethod({ type: '', bankName: '', accountNumber: '', phone: '' });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Type de méthode</label>
                  <select
                    value={newMethod.type}
                    onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="bank">Virement bancaire</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="inwi_money">inwi Money</option>
                    <option value="iam">Maroc Telecom</option>
                  </select>
                </div>

                {newMethod.type === 'bank' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Nom de la banque</label>
                      <input
                        type="text"
                        value={newMethod.bankName}
                        onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                        placeholder="Ex: CIH Bank, Attijariwafa Bank"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Numéro de compte</label>
                      <input
                        type="text"
                        value={newMethod.accountNumber}
                        onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                        placeholder="RIB ou numéro de compte"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}

                {(newMethod.type === 'orange_money' || newMethod.type === 'inwi_money' || newMethod.type === 'iam') && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={newMethod.phone}
                      onChange={(e) => setNewMethod({ ...newMethod, phone: e.target.value })}
                      placeholder="+212 6XX XXX XXX"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleAddMethod}
                  disabled={!newMethod.type}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Ajouter la méthode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
