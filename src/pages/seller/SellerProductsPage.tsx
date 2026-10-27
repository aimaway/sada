import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Batterie Bosch S4 60Ah', sku: 'BAT-BOSCH-S4-60', price: 85000, stock: 15, status: 'active', category: 'Batteries' },
  { id: 2, name: 'Huile moteur Total 5W-30 5L', sku: 'OIL-TOTAL-5W30-5L', price: 32000, stock: 45, status: 'active', category: 'Huiles' },
  { id: 3, name: 'Filtre à huile Mann W712/75', sku: 'FIL-MANN-W712', price: 6500, stock: 3, status: 'active', category: 'Filtres' },
  { id: 4, name: 'Plaquettes de frein Brembo', sku: 'FRE-BREMBO-P85', price: 45000, stock: 0, status: 'active', category: 'Freins' },
  { id: 5, name: 'Kit distribution Gates', sku: 'DIS-GATES-K01', price: 125000, stock: 8, status: 'draft', category: 'Distribution' },
];

export function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = mockProducts.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value / 100);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white">
          <h1 className="text-2xl font-bold">Catalogue Produits</h1>
          <p className="mt-2 text-sm text-slate-300">Gérez vos produits et votre inventaire</p>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <Link
            to="/seller/products/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 inline-block h-4 w-4" />
            Ajouter un produit
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Produit</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Catégorie</th>
                  <th className="px-6 py-3">Prix</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                          📦
                        </div>
                        <span className="text-sm font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.status === 'active' ? 'Actif' : product.status === 'draft' ? 'Brouillon' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
                          <Search className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg bg-amber-50 p-2 text-amber-600 hover:bg-amber-100">
                          <Filter className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
