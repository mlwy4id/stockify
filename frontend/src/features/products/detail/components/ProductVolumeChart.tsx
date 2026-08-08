'use client';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/shared/lib/utils';
import type { VolumeRange } from '@/shared/types/product.type';

const RANGES = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '' },
];

type Props = {
  volume: VolumeRange[];
  range?: string;
  onRangeChange: (range: string) => void;
};

const VolumeTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-xs shadow">
      <p className="font-medium">{label}</p>
      <p>{`${payload[0].value} items`}</p>
    </div>
  );
};

const ProductVolumeChart = ({ volume, range = '', onRangeChange }: Props) => {
  const selected = useMemo(
    () => volume.find((v) => v.range === (range || 'all')),
    [volume, range]
  );

  const data = selected
    ? [
        { name: 'In', value: selected.totalIn },
        { name: 'Out', value: selected.totalOut },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
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
        {selected && (
          <span className="text-sm">
            <span className="font-medium text-success">+{selected.totalIn} in</span>{' '}
            <span className="text-muted-foreground">/</span>{' '}
            <span className="font-medium text-danger">-{selected.totalOut} out</span>
          </span>
        )}
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<VolumeTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={90}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.name === 'In' ? 'var(--success)' : 'var(--danger)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
          No data
        </div>
      )}
    </div>
  );
};

export default ProductVolumeChart;
