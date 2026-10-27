import React from 'react';
import { Link } from 'react-router-dom';

type ProductCardProps = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'inactive' | 'archived';
  imageUrl?: string;
  category?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const statusConfig = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  inactive: { label: 'Inactif', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Archivé', color: 'bg-red-100 text-red-700' },
};

export function ProductCard({
  id,
  name,
  sku,
  price,
  stock,
  status,
  imageUrl,
  category,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const formatPrice = (value: number) =>
    new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 2,
    }).format(value / 100);

  const statusInfo = statusConfig[status];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        {/* Image */}
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">
              📦
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {name}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">SKU: {sku}</p>
              {category && (
                <p className="mt-1 text-xs text-slate-600">{category}</p>
              )}
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-slate-900">
                {formatPrice(price)}
              </p>
              <p className="text-xs text-slate-500">
                Stock: {stock} unité{stock > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                >
                  Modifier
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
