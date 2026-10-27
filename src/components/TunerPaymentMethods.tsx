import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const TunerPaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pm1',
      type: 'card',
      label: 'Visa •••• 4242',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'orange_money',
      label: 'Orange Money - +212 6XX XXX XXX',
      isDefault: false,
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
    const method = {
      id: `pm${Date.now()}`,
      type: newMethod.type,
      label: newMethod.type === 'card' 
        ? `${newMethod.cardName} •••• ${newMethod.cardNumber.slice(-4)}`
        : `${newMethod.type === 'orange_money' ? 'Orange Money' : newMethod.type === 'inwi_money' ? 'inwi Money' : 'Maroc Telecom'} - ${newMethod.phone}`,
      isDefault: paymentMethods.length === 0,
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

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Méthodes de paiement</h1>
        </div>
        <p className="text-sm text-slate-600">Gérez vos méthodes de paiement pour les rechargements</p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter une méthode de paiement
        </button>

        {/* Payment Methods List */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  method.type === 'card' ? 'bg-blue-100' :
                  method.type === 'orange_money' ? 'bg-orange-100' :
                  method.type === 'inwi_money' ? 'bg-purple-100' :
                  'bg-green-100'
                }`}>
                  {method.type === 'card' ? (
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Smartphone className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-800">{method.label}</p>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-xs text-red-600 font-medium hover:text-red-700"
                      >
                        Définir par défaut
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMethod(method.id)}
                      className="text-xs text-slate-500 hover:text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Aucune méthode de paiement ajoutée</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
            >
              Ajouter une méthode
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Paiements sécurisés</p>
              <p className="text-xs text-blue-700 mt-1">
                Toutes vos transactions sont cryptées et sécurisées. Vos informations de paiement ne sont jamais stockées sur nos serveurs.
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
                <h2 className="text-xl font-bold text-slate-800">Ajouter une méthode de paiement</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMethod({ type: '', cardNumber: '', cardName: '', expiry: '', cvv: '', phone: '' });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Type de méthode</label>
                  <select
                    value={newMethod.type}
                    onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="card">Carte bancaire</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="inwi_money">inwi Money</option>
                    <option value="maroc_telecom">Maroc Telecom</option>
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
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Nom sur la carte</label>
                      <input
                        type="text"
                        value={newMethod.cardName}
                        onChange={(e) => setNewMethod({ ...newMethod, cardName: e.target.value })}
                        placeholder="JOHN DOE"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
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
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
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
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {(newMethod.type === 'orange_money' || newMethod.type === 'inwi_money' || newMethod.type === 'maroc_telecom') && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={newMethod.phone}
                      onChange={(e) => setNewMethod({ ...newMethod, phone: e.target.value })}
                      placeholder="+212 6XX XXX XXX"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleAddMethod}
                  disabled={!newMethod.type || (newMethod.type === 'card' && (!newMethod.cardNumber || !newMethod.cardName || !newMethod.expiry || !newMethod.cvv)) || (newMethod.type !== 'card' && !newMethod.phone)}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
