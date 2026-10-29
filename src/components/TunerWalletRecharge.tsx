import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockTunerData } from '../data/mockDataGlobal';

export const TunerWalletRecharge: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showWafacashInstructions, setShowWafacashInstructions] = useState(false);

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
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Wafacash',
      subtitle: 'Paiement en espèces',
      color: 'from-red-500 to-red-600',
      fee: '10 MAD',
      delay: '24-48h',
    },
  ];

  const handleRecharge = () => {
    if (!amount || !selectedMethod) return;

    if (selectedMethod === 'wafacas') {
      setShowWafacashInstructions(true);
    } else {
      // Simulate payment processing
      alert(`Rechargement de ${amount} MAD via ${paymentMethods.find(m => m.id === selectedMethod)?.title} en cours...`);
      setTimeout(() => {
        alert('Rechargement réussi !');
        navigate('/tuner/dashboard');
      }, 2000);
    }
  };

  if (showWafacashInstructions) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setShowWafacashInstructions(false)} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Procédure Wafacash</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Instructions de rechargement</p>
                <p className="text-xs text-amber-700 mt-1">
                  Suivez ces étapes pour recharger votre portefeuille via Wafacash
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4">Étapes à suivre :</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Rendez-vous dans une agence Wafacash</p>
                  <p className="text-xs text-slate-600 mt-1">Trouvez l'agence la plus proche de vous</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Indiquez le code : <strong className="text-red-600">TUNER2024</strong></p>
                  <p className="text-xs text-slate-600 mt-1">Ce code identifie votre compte TomoBily</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Précisez le montant : <strong className="text-red-600">{amount} MAD</strong></p>
                  <p className="text-xs text-slate-600 mt-1">Montant à recharger sur votre portefeuille</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Conservez le reçu jusqu'à confirmation</p>
                  <p className="text-xs text-slate-600 mt-1">Le reçu est votre preuve de paiement</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Le crédit apparaîtra sous 24-48h</p>
                  <p className="text-xs text-slate-600 mt-1">Vous recevrez une notification une fois le rechargement effectué</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Frais de transaction</p>
                <p className="text-xs text-blue-700 mt-1">
                  Des frais de 10 MAD seront appliqués pour cette méthode de paiement
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              alert('Demande de rechargement enregistrée ! Vous recevrez une confirmation sous 24-48h.');
              navigate('/tuner/dashboard');
            }}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
          >
            J'ai effectué le paiement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Recharger le portefeuille</h1>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
          <p className="text-sm opacity-90 mb-1">Solde actuel</p>
          <p className="text-4xl font-bold">{(mockTunerData.wallet.balance / 100).toFixed(0)} <span className="text-lg font-normal opacity-80">MAD</span></p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Montant à recharger (MAD)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="w-full p-4 pr-16 border-2 border-slate-200 rounded-xl text-2xl font-bold text-center focus:ring-2 focus:ring-red-500 outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">MAD</span>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200"
              >
                {amt} MAD
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Choisir une méthode</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-red-500 bg-red-50'
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
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Paiements 100% sécurisés</p>
              <p className="text-xs text-blue-700 mt-1">
                Toutes les transactions sont cryptées et monitorées. Vos données sont protégées.
              </p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleRecharge}
          disabled={!amount || !selectedMethod}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmer le rechargement
        </button>
      </div>
    </div>
  );
};
