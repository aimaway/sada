import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Banknote, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const ClientWallet: React.FC = () => {
  const navigate = useNavigate();
  const [balance] = useState(25000); // 250 MAD en centimes
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'card',
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Carte bancaire',
      subtitle: 'Visa, Mastercard, CMI',
      color: 'from-blue-500 to-blue-600',
      fee: '0 MAD',
      delay: 'Instantané',
    },
    {
      id: 'orange',
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Orange Money',
      subtitle: 'Paiement mobile sécurisé',
      color: 'from-orange-500 to-orange-600',
      fee: '0 MAD',
      delay: 'Instantané',
    },
    {
      id: 'inwi',
      icon: <Smartphone className="w-6 h-6" />,
      title: 'inwi Money',
      subtitle: 'Portefeuille mobile',
      color: 'from-purple-500 to-purple-600',
      fee: '0 MAD',
      delay: 'Instantané',
    },
    {
      id: 'iam',
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Maroc Telecom',
      subtitle: 'IAM Mobile Payment',
      color: 'from-green-500 to-green-600',
      fee: '0 MAD',
      delay: 'Instantané',
    },
    {
      id: 'wafacas',
      icon: <Banknote className="w-6 h-6" />,
      title: 'Wafacash',
      subtitle: 'Paiement en espèces',
      color: 'from-red-500 to-red-600',
      fee: '10 MAD',
      delay: '24-48h',
    },
  ];

  const transactions = [
    { id: 1, type: 'credit', amount: 50000, label: 'Rechargement Orange Money', date: '2024-03-15', status: 'completed' },
    { id: 2, type: 'debit', amount: 15000, label: 'Paiement réparation - Ahmed B.', date: '2024-03-14', status: 'completed' },
    { id: 3, type: 'credit', amount: 25000, label: 'Rechargement Carte', date: '2024-03-10', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Mon Portefeuille</h1>
        </div>
        
        {/* Balance Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
          <p className="text-sm opacity-90 mb-1">Solde disponible</p>
          <p className="text-4xl font-bold">{(balance / 100).toFixed(0)} <span className="text-lg font-normal opacity-80">MAD</span></p>
          <button
            onClick={() => setShowAddMoney(true)}
            className="mt-4 w-full py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
          >
            + Ajouter de l'argent
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 text-sm">Paiements 100% sécurisés</h3>
              <p className="text-xs text-blue-700 mt-1">
                Toutes les transactions sont cryptées et monitorées. Vos données sont protégées.
              </p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">Historique des transactions</h2>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'credit' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{tx.label}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{(tx.amount / 100).toFixed(0)} MAD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Ajouter de l'argent</h2>
                <button onClick={() => setShowAddMoney(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  ✕
                </button>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Montant (MAD)</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full p-4 border border-slate-200 rounded-xl text-2xl font-bold text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">Choisir une méthode</h3>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center text-white`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-slate-800">{method.title}</p>
                        <p className="text-xs text-slate-500">{method.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Frais: {method.fee}</p>
                        <p className="text-xs text-slate-500">{method.delay}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Wafacash Instructions */}
              {selectedMethod === 'wafacas' && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-800 text-sm mb-2">Procédure Wafacash :</h4>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Rendez-vous dans une agence Wafacash</li>
                    <li>Indiquez le code : <strong>MECA2024</strong></li>
                    <li>Précisez le montant à recharger</li>
                    <li>Conservez le reçu jusqu'à confirmation</li>
                    <li>Le crédit apparaîtra sous 24-48h</li>
                  </ol>
                </div>
              )}

              {/* Confirm Button */}
              <button
                disabled={!selectedMethod}
                className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer le rechargement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
