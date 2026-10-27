import React, { useEffect, useMemo, useState } from 'react';
import { PortalSidebar } from '../../components/PortalSidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Package, Plus, Trash2, Truck, X } from 'lucide-react';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { RevenueChart } from '../../components/ui/RevenueChart';
import {
  formatMoney,
  loadState,
  saveState,
  seedSellerOrders,
  seedSellerProducts,
  SellerOrder,
  SellerProduct,
} from '../../shared/portalStore';

const KEYS = { products: 'seller.products', orders: 'seller.orders' };

// ---------------- Orders list ----------------

export function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [filter, setFilter] = useState<'all' | SellerOrder['status']>('all');

  useEffect(() => {
    setOrders(loadState(KEYS.orders, seedSellerOrders));
  }, []);

  const setStatus = (id: number, status: SellerOrder['status']) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status } : o));
      saveState(KEYS.orders, next);
      return next;
    });
  };

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const filters: Array<'all' | SellerOrder['status']> = ['all', 'pending', 'processing', 'shipped', 'delivered'];

  return (
    <PortalSidebar title="Espace Vendeur">
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <p className="mt-1 text-sm text-slate-300">Traitez et suivez vos commandes clients.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'processing' ? 'En cours' : f === 'shipped' ? 'Expédiées' : 'Livrées'}
            <span className="ml-1.5 text-xs opacity-70">
              {f === 'all' ? orders.length : orders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Aucune commande dans cette catégorie.
          </div>
        )}
        {visible.map((order) => (
          <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link to={`/seller/orders/${order.id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                  {order.orderNumber}
                </Link>
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {order.customerName} • {new Date(order.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">{formatMoney(order.total)}</span>
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => setStatus(order.id, 'confirmed')}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setStatus(order.id, 'cancelled')}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    title="Annuler"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
              {order.status === 'processing' && (
                <button
                  onClick={() => setStatus(order.id, 'shipped')}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  <Truck className="mr-1 inline-block h-3.5 w-3.5" />
                  Expédier
                </button>
              )}
              <Link
                to={`/seller/orders/${order.id}`}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
    </PortalSidebar>
  );
}

// ---------------- Order detail ----------------

export function SellerOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[] | null>(null);

  useEffect(() => {
    setOrders(loadState(KEYS.orders, seedSellerOrders));
  }, []);

  const order = orders?.find((o) => o.id === Number(id));

  if (orders && !order) {
    return (
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">Commande introuvable.</p>
          <Link to="/seller/orders" className="mt-4 inline-block text-sm font-medium text-blue-600">
            ← Retour aux commandes
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </main>
    );
  }

  const setStatus = (status: SellerOrder['status']) => {
    setOrders((prev) => {
      const next = (prev ?? []).map((o) => (o.id === order.id ? { ...o, status } : o));
      saveState(KEYS.orders, next);
      return next;
    });
  };

  return (
    <PortalSidebar title="Espace Vendeur">
    <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate('/seller/orders')}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </button>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {order.customerName} • {new Date(order.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Qté</th>
                <th className="px-4 py-3">Prix unitaire</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm text-slate-900">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.qty}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatMoney(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    {formatMoney(item.unitPrice * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-100 bg-slate-50">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-slate-900">Total commande</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">{formatMoney(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => setStatus('processing')}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Check className="mr-1.5 inline-block h-4 w-4" />
              Accepter et préparer
            </button>
          )}
          {order.status === 'processing' && (
            <button
              onClick={() => setStatus('shipped')}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Truck className="mr-1.5 inline-block h-4 w-4" />
              Marquer comme expédiée
            </button>
          )}
          {order.status === 'shipped' && (
            <button
              onClick={() => setStatus('delivered')}
              className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Marquer comme livrée
            </button>
          )}
          {(order.status === 'pending' || order.status === 'processing') && (
            <button
              onClick={() => setStatus('cancelled')}
              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Annuler la commande
            </button>
          )}
        </div>
      </div>
    </main>
    </PortalSidebar>
  );
}

// ---------------- Inventory ----------------

export function SellerInventoryPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);

  useEffect(() => {
    setProducts(loadState(KEYS.products, seedSellerProducts));
  }, []);

  const changeStock = (id: number, delta: number) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
      saveState(KEYS.products, next);
      return next;
    });
  };

  const remove = (id: number) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveState(KEYS.products, next);
      return next;
    });
  };

  const lowStock = products.filter((p) => p.stock < 5);

  return (
    <PortalSidebar title="Espace Vendeur">
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white">
        <h1 className="text-2xl font-bold">Gestion du stock</h1>
        <p className="mt-1 text-sm text-slate-300">Réapprovisionnez vos produits rapidement.</p>
      </header>

      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ {lowStock.length} produit(s) en stock faible (&lt; 5) :{' '}
          {lowStock.map((p) => p.name).join(', ')}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">Produit</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Stock actuel</th>
              <th className="px-6 py-3">Ajuster</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Package className="h-5 w-5 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.sku}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-semibold ${
                      product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-amber-600' : 'text-green-600'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeStock(product.id, -1)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      −
                    </button>
                    <button
                      onClick={() => changeStock(product.id, 1)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      ＋
                    </button>
                    <button
                      onClick={() => changeStock(product.id, 10)}
                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                    >
                      +10
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => remove(product.id)}
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
    </PortalSidebar>
  );
}

// ---------------- Analytics ----------------

export function SellerAnalyticsPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [products, setProducts] = useState<SellerProduct[]>([]);

  useEffect(() => {
    setOrders(loadState(KEYS.orders, seedSellerOrders));
    setProducts(loadState(KEYS.products, seedSellerProducts));
  }, []);

  const revenueData = useMemo(
    () =>
      orders.map((o) => ({
        date: new Date(o.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        revenue: o.total,
      })),
    [orders]
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const conversion = orders.length ? Math.round((delivered / orders.length) * 100) : 0;

  const byCategory = useMemo(() => {
    const map: Record<string, { count: number; value: number }> = {};
    for (const p of products) {
      map[p.category] = map[p.category] || { count: 0, value: 0 };
      map[p.category].count += 1;
      map[p.category].value += p.price * p.stock;
    }
    return Object.entries(map).sort((a, b) => b[1].value - a[1].value);
  }, [products]);

  return (
    <PortalSidebar title="Espace Vendeur">
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="mt-1 text-sm text-slate-300">Analysez les performances de votre boutique.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Chiffre d'affaires</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatMoney(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Commandes livrées</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {delivered}/{orders.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Taux de livraison</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{conversion}%</p>
        </div>
      </section>

      <RevenueChart data={revenueData} title="Revenus par commande" />

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Valeur du stock par catégorie</h2>
        <div className="mt-4 space-y-3">
          {byCategory.map(([cat, info]) => {
            const max = byCategory[0]?.[1].value || 1;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{cat}</span>
                  <span className="text-slate-500">
                    {info.count} réf. • {formatMoney(info.value)}
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${Math.max(4, Math.round((info.value / max) * 100))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
    </PortalSidebar>
  );
}

// ---------------- New product form ----------------

export function SellerNewProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', sku: '', category: '', price: '', stock: '' });
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      setError('Le nom et un prix valide sont requis.');
      return;
    }
    const products = loadState<SellerProduct[]>(KEYS.products, seedSellerProducts);
    const nextId = products.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    const product: SellerProduct = {
      id: nextId,
      name: form.name.trim(),
      sku: form.sku.trim() || `SKU-${String(nextId).padStart(4, '0')}`,
      category: form.category.trim() || 'Divers',
      price: Math.round(Number(form.price) * 100),
      stock: Math.max(0, parseInt(form.stock || '0', 10)),
      status: 'draft',
    };
    const next = [...products, product];
    saveState(KEYS.products, next);
    navigate('/seller/products');
  };

  const field =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

  return (
    <PortalSidebar title="Espace Vendeur">
    <main className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <header className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white">
        <h1 className="text-2xl font-bold">Nouveau produit</h1>
        <p className="mt-1 text-sm text-slate-300">Ajoutez un produit à votre catalogue.</p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nom du produit *</label>
          <input
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex : Batterie Bosch S4 60Ah"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">SKU</label>
            <input
              className={field}
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="Généré automatiquement si vide"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Catégorie</label>
            <input
              className={field}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Ex : Batteries"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Prix (MAD) *</label>
            <input
              className={field}
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="850"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Stock initial</label>
            <input
              className={field}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="10"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="mr-2 inline-block h-4 w-4" />
          Enregistrer le produit
        </button>
      </form>
    </main>
    </PortalSidebar>
  );
}
