import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type RevenuePoint = {
  date: string;
  revenue: number;
};

type RevenueChartProps = {
  data: RevenuePoint[];
  title?: string;
  currency?: string;
  height?: number;
};

export function RevenueChart({
  data,
  title = 'Revenus',
  currency = 'MAD',
  height = 256,
}: RevenueChartProps) {
  const formatMoney = (value: number) =>
    new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value / 100);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>

      {data.length === 0 ? (
        <div
          className="flex items-center justify-center text-sm text-slate-500"
          style={{ height: height - 40 }}
        >
          Aucune donnée de revenu disponible pour cette période.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0878f9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0878f9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5edf5" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6c7f98' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#6c7f98' }}
              tickFormatter={(value) => formatMoney(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5edf5',
                borderRadius: '12px',
                padding: '12px',
              }}
              formatter={(value: number) => [formatMoney(value), 'Revenu']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0878f9"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
