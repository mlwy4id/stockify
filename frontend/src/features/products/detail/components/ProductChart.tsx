'use client';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { StockChartPoint } from '@/shared/types/product.type';

const RANGES = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '' },
];

type Props = {
  points: StockChartPoint[];
  range?: string;
  onRangeChange: (range: string) => void;
};

const ProductChart = ({ points, range = '', onRangeChange }: Props) => {
  const data = useMemo(
    () =>
      points.map((p) => ({
        date: new Date(p.date),
        quantity: p.quantity,
      })),
    [points]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => onRangeChange(r.value)}
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer',
              range === r.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-primary-subtle hover:text-primary'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="productChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(value as Date, 'd MMM')}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              width="auto"
            />
            <Tooltip
              labelFormatter={(label) => format(new Date(String(label)), 'd MMM yyyy')}
              formatter={(value) => [`${value} items`, 'Stock']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '0.5rem',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="quantity"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#productChartFill)"
              dot={data.length === 1}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
          No stock data available
        </div>
      )}
    </div>
  );
};

export default ProductChart;
