import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, CreditCard, Smartphone, Trash2, CheckCircle2,
  X, Save, Shield, AlertCircle
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'orange_money' | 'inwi_money' | 'iam' | 'wafacash';
  label: string;
  isDefault: boolean;
  lastUsed?: string;
}

export const CustomerPaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm1',
      type: 'card',
      label: 'Visa •••• 4242',
      isDefault: true,
      lastUsed: '2024-03-15',
    },
    {
      id: 'pm2',
      type: 'orange_money',
      label: 'Orange Money - +212 6XX XXX XXX',
      isDefault: false,
      lastUsed: '2024-03-10',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    phone: '',
  });

  const handleAddMethod = () => {
    const method: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: newMethod.type as any,
      label: newMethod.type === 'card'
        ? `${newMethod.cardName} •••• ${newMethod.cardNumber.slice(-4)}`
        : `${newMethod.type === 'orange_money' ? 'Orange Money' : newMethod.type === 'inwi_money' ? 'inwi Money' : newMethod.type === 'iam' ? 'Maroc Telecom' : 'Wafacash'} - ${newMethod.phone}`,
      isDefault: paymentMethods.length === 0,
      lastUsed: new Date().toISOString().split('T')[0],
    };
    setPaymentMethods([...paymentMethods, method]);
    setShowAddModal(false);
    setNewMethod({ type: '', cardNumber: '', cardName: '', expiry: '', cvv: '', phone: '' });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
  };

  const handleDeleteMethod = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'orange_money': return <Smartphone className="w-6 h-6 text-orange-600" />;
      case 'inwi_money': return <Smartphone className="w-6 h-6 text-purple-600" />;
      case 'iam': return <Smartphone className="w-6 h-6 text-green-600" />;
      case 'wafacash': return <CreditCard className="w-6 h-6 text-red-600" />;
      default: return <CreditCard className="w-6 h-6 text-slate-600" />;
    }
  };

  const getMethodColor = (type: string) => {
    switch (type) {
      case 'card': return 'bg-blue-100';
      case 'orange_money': return 'bg-orange-100';
      case 'inwi_money': return 'bg-purple-100';
      case 'iam': return 'bg-green-100';
      case 'wafacash': return 'bg-red-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/customer/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Méthodes de paiement</h1>
              <p className="text-xs text-slate-500">{paymentMethods.length} méthode{paymentMethods.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Payment Methods List */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className={`bg-white rounded-2xl p-4 border-2 ${method.isDefault ? 'border-emerald-500' : 'border-slate-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getMethodColor(method.type)}`}>
                  {getMethodIcon(method.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-800">{method.label}</p>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Par défaut
                      </span>
                    )}
                  </div>
                  {method.lastUsed && (
                    <p className="text-xs text-slate-500">
                      Dernière utilisation : {new Date(method.lastUsed).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
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
              </div>
            </div>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Aucune méthode de paiement ajoutée</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
            >
              Ajouter une méthode
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Paiements 100% sécurisés</p>
              <p className="text-xs text-blue-700 mt-1">
                Toutes vos transactions sont cryptées et sécurisées. Vos informations de paiement ne sont jamais stockées sur nos serveurs.
              </p>
            </div>
          </div>
        </div>

        {/* Available Methods Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Méthodes disponibles</h3>
          <div className="space-y-2">
            {[
              { icon: <CreditCard className="w-4 h-4 text-blue-600" />, name: 'Carte bancaire', desc: 'Visa, Mastercard, CMI' },
              { icon: <Smartphone className="w-4 h-4 text-orange-600" />, name: 'Orange Money', desc: 'Paiement mobile' },
              { icon: <Smartphone className="w-4 h-4 text-purple-600" />, name: 'inwi Money', desc: 'Portefeuille mobile' },
              { icon: <Smartphone className="w-4 h-4 text-green-600" />, name: 'Maroc Telecom', desc: 'IAM Mobile Payment' },
              { icon: <CreditCard className="w-4 h-4 text-red-600" />, name: 'Wafacash', desc: 'Paiement en espèces' },
            ].map((method, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{method.name}</p>
                  <p className="text-xs text-slate-500">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Ajouter une méthode de paiement</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMethod({ type: '', cardNumber: '', cardName: '', expiry: '', cvv: '', phone: '' });
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
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="card">Carte bancaire</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="inwi_money">inwi Money</option>
                    <option value="iam">Maroc Telecom</option>
                    <option value="wafacash">Wafacash</option>
                  </select>
                </div>

                {newMethod.type === 'card' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Numéro de carte</label>
                      <input
                        type="text"
                        value={newMethod.cardNumber}
                        onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Nom sur la carte</label>
                      <input
                        type="text"
                        value={newMethod.cardName}
                        onChange={(e) => setNewMethod({ ...newMethod, cardName: e.target.value })}
                        placeholder="JOHN DOE"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Expiration</label>
                        <input
                          type="text"
                          value={newMethod.expiry}
                          onChange={(e) => setNewMethod({ ...newMethod, expiry: e.target.value })}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">CVV</label>
                        <input
                          type="text"
                          value={newMethod.cvv}
                          onChange={(e) => setNewMethod({ ...newMethod, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={3}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {(newMethod.type === 'orange_money' || newMethod.type === 'inwi_money' || newMethod.type === 'iam' || newMethod.type === 'wafacash') && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={newMethod.phone}
                      onChange={(e) => setNewMethod({ ...newMethod, phone: e.target.value })}
                      placeholder="+212 6XX XXX XXX"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleAddMethod}
                  disabled={!newMethod.type || (newMethod.type === 'card' && (!newMethod.cardNumber || !newMethod.cardName || !newMethod.expiry || !newMethod.cvv)) || (newMethod.type !== 'card' && !newMethod.phone)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
