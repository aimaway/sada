import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, Download, Plus, CheckCircle2 } from 'lucide-react';

// Mock data for demo
const mockRecurringPlans = [
  {
    id: 1,
    name: 'Entretien mensuel - Toyota Hilux',
    serviceType: 'oil_change',
    frequency: 'monthly',
    nextServiceDate: '2024-04-15',
    nextServiceMileage: 95000,
    pricePerService: 35000,
    discountPercent: 10,
    isActive: true,
    lastServiceDate: '2024-03-15',
    lastServiceMileage: 90000,
  },
  {
    id: 2,
    name: 'Vérification freins - Fleet',
    serviceType: 'brake_check',
    frequency: 'quarterly',
    nextServiceDate: '2024-06-01',
    nextServiceMileage: null,
    pricePerService: 25000,
    discountPercent: 15,
    isActive: true,
    lastServiceDate: '2024-03-01',
    lastServiceMileage: 88000,
  },
];

const mockInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-202403-0001',
    periodStart: '2024-03-01',
    periodEnd: '2024-03-31',
    items: [
      { description: 'Vidange Toyota Hilux', quantity: 1, unitPrice: 35000, total: 35000 },
      { description: 'Vérification freins Fleet (3 véhicules)', quantity: 3, unitPrice: 25000, total: 75000 },
    ],
    subtotal: 110000,
    taxAmount: 22000,
    total: 132000,
    status: 'paid',
    dueDate: '2024-04-30',
    paidAt: '2024-04-15',
  },
  {
    id: 2,
    invoiceNumber: 'INV-202402-0001',
    periodStart: '2024-02-01',
    periodEnd: '2024-02-29',
    items: [
      { description: 'Vidange Toyota Hilux', quantity: 1, unitPrice: 35000, total: 35000 },
    ],
    subtotal: 35000,
    taxAmount: 7000,
    total: 42000,
    status: 'paid',
    dueDate: '2024-03-31',
    paidAt: '2024-03-20',
  },
];

export const RecurringPlansDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const serviceTypes = {
    oil_change: { label: 'Vidange', icon: '🛢️' },
    brake_check: { label: 'Vérification freins', icon: '🔧' },
    tire_rotation: { label: 'Permutation pneus', icon: '🛞' },
    battery_check: { label: 'Vérification batterie', icon: '🔋' },
    full_inspection: { label: 'Inspection complète', icon: '🔍' },
  };

  const frequencies = {
    weekly: 'Hebdomadaire',
    biweekly: 'Bi-mensuel',
    monthly: 'Mensuel',
    quarterly: 'Trimestriel',
    yearly: 'Annuel',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Plans Récurrents & Factures</h1>
            <p className="text-sm text-slate-500">Gérez vos entretiens programmés</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Recurring Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Plans récurrents</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Nouveau plan
            </button>
          </div>

          <div className="space-y-3">
            {mockRecurringPlans.map((plan) => (
              <div key={plan.id} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{plan.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {serviceTypes[plan.serviceType as keyof typeof serviceTypes]?.icon}{' '}
                      {serviceTypes[plan.serviceType as keyof typeof serviceTypes]?.label} •{' '}
                      {frequencies[plan.frequency as keyof typeof frequencies]}
                    </p>
                  </div>
                  {plan.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Actif
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                      Inactif
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Prochain service</p>
                    <p className="font-medium text-slate-800">
                      {new Date(plan.nextServiceDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Prix par service</p>
                    <p className="font-medium text-slate-800">
                      {(plan.pricePerService / 100).toFixed(0)} MAD
                      {plan.discountPercent > 0 && (
                        <span className="ml-1 text-xs text-green-600">
                          (-{plan.discountPercent}%)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Dernier service</p>
                    <p className="font-medium text-slate-800">
                      {new Date(plan.lastServiceDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Kilométrage</p>
                    <p className="font-medium text-slate-800">
                      {plan.lastServiceMileage?.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Factures</h2>

          <div className="space-y-3">
            {mockInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-800">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(invoice.periodStart).toLocaleDateString('fr-FR')} -{' '}
                      {new Date(invoice.periodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status === 'paid' && 'Payée'}
                    {invoice.status === 'sent' && 'Envoyée'}
                    {invoice.status === 'overdue' && 'En retard'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="text-xl font-bold text-slate-800">
                      {(invoice.total / 100).toFixed(0)} MAD
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Nouveau plan récurrent</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nom du plan</label>
                  <input
                    type="text"
                    placeholder="Ex: Entretien mensuel - Toyota Hilux"
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Type de service</label>
                  <select className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
                    {Object.entries(serviceTypes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.icon} {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Fréquence</label>
                  <select className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
                    {Object.entries(frequencies).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Prix par service (MAD)</label>
                  <input
                    type="number"
                    placeholder="350"
                    className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    // In production: Call API
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Créer le plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
