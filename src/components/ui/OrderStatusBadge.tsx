import React from 'react';

type OrderStatusBadgeProps = {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  size?: 'sm' | 'md';
};

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-700', icon: '✓' },
  processing: { label: 'En cours', color: 'bg-purple-100 text-purple-700', icon: '⚙️' },
  shipped: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-700', icon: '🚚' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: '✓' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: '✕' },
  refunded: { label: 'Remboursée', color: 'bg-orange-100 text-orange-700', icon: '↩' },
};

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
