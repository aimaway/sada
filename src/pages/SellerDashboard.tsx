import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Plus,
  Eye,
  BarChart3,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { RevenueChart } from '../components/ui/RevenueChart';
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge';
import { useApp } from '../shared/context';

type DashboardData = {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueData: Array<{ date: string; revenue: number }>;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
};

export function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // TODO: Fetch real data from API
    // For now, use mock data
    const mockData: DashboardData = {
      totalOrders: 156,
      totalSales: 4580000, // 45,800 MAD in cents
      pendingOrders: 12,
      lowStockProducts: 8,
      revenueData: [
        { date: '01/03', revenue: 125000 },
        { date: '02/03', revenue: 198000 },
        { date: '03/03', revenue: 156000 },
        { date: '04/03', revenue: 234000 },
        { date: '05/03', revenue: 189000 },
        { date: '06/03', revenue: 267000 },
        { date: '07/03', revenue: 312000 },
      ],
      recentOrders: [
        {
          id: 1,
          orderNumber: 'CMD-2024-001',
          customerName: 'Amine Khalid',
          total: 35000,
          status: 'pending',
          date: '2024-03-15',
        },
        {
          id: 2,
          orderNumber: 'CMD-2024-002',
          customerName: 'Sara Mansouri',
          total: 48000,
          status: 'processing',
          date: '2024-03-14',
        },
        {
          id: 3,
          orderNumber: 'CMD-2024-003',
          customerName: 'Youssef Rachidi',
          total: 12500,
          status: 'shipped',
          date: '2024-03-13',
        },
        {
          id: 4,
          orderNumber: 'CMD-2024-004',
          customerName: 'Fatima Zahra',
          total: 67000,
          status: 'delivered',
          date: '2024-03-12',
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(value / 100);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-sm text-slate-600">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white sm:p-8">
          <p className="text-sm text-blue-200">Espace professionnel</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Espace Vendeur</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Gérez vos produits, vos commandes et votre activité.
          </p>
        </header>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Commandes"
            value={data.totalOrders}
            subtitle="Total des commandes"
            icon={<ShoppingCart className="h-5 w-5" />}
            color="blue"
          />
          <StatCard
            title="Ventes"
            value={formatMoney(data.totalSales)}
            subtitle="Chiffre d'affaires total"
            icon={<DollarSign className="h-5 w-5" />}
            color="green"
          />
          <StatCard
            title="En attente"
            value={data.pendingOrders}
            subtitle="Commandes à traiter"
            icon={<AlertCircle className="h-5 w-5" />}
            color="orange"
          />
          <StatCard
            title="Stock faible"
            value={data.lowStockProducts}
            subtitle="Produits à réapprovisionner"
            icon={<Package className="h-5 w-5" />}
            color="red"
          />
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Revenue Chart */}
          <div className="xl:col-span-2">
            <RevenueChart data={data.revenueData} title="Analyse des ventes" />
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Actions rapides</h2>
            <div className="mt-4 grid gap-3">
              <Link
                to="/seller/products/new"
                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus className="mr-2 inline-block h-4 w-4" />
                Ajouter un produit
              </Link>
              <Link
                to="/seller/orders"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Eye className="mr-2 inline-block h-4 w-4" />
                Voir les commandes
              </Link>
              <Link
                to="/seller/inventory"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Package className="mr-2 inline-block h-4 w-4" />
                Gérer le stock
              </Link>
              <Link
                to="/seller/analytics"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <BarChart3 className="mr-2 inline-block h-4 w-4" />
                Voir les statistiques
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Commandes récentes</h2>
            <Link
              to="/seller/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Voir tout →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Commande</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Statut</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <Link
                        to={`/seller/orders/${order.id}`}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-sm text-slate-600">{order.customerName}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-slate-900">
                      {formatMoney(order.total)}
                    </td>
                    <td className="py-3 pr-4">
                      <OrderStatusBadge status={order.status as any} size="sm" />
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
