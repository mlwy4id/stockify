'use client';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/shared/lib/utils';
import type { SoldBrokenRatioRange } from '@/shared/types/product.type';

const RANGES = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '' },
];

type Props = {
  ratio: SoldBrokenRatioRange[];
  range?: string;
  onRangeChange: (range: string) => void;
};

const RatioTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-xs shadow">
      <p className="font-medium">{payload[0].name}</p>
      <p>{`${payload[0].value} items`}</p>
    </div>
  );
};

const ProductRatioChart = ({ ratio, range = '', onRangeChange }: Props) => {
  const selected = useMemo(
    () => ratio.find((r) => r.range === (range || 'all')),
    [ratio, range]
  );

  const data = selected
    ? [
        { name: 'Sold', value: selected.totalSold },
        { name: 'Broken', value: selected.totalBroken },
      ]
    : [];

  const hasData = data.some((d) => d.value > 0);

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
            <span className="font-medium text-success">{selected.soldPercentage}%</span>{' '}
            <span className="text-muted-foreground">sold /</span>{' '}
            <span className="font-medium text-danger">{selected.brokenPercentage}%</span>{' '}
            <span className="text-muted-foreground">broken</span>
          </span>
        )}
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
              strokeWidth={0}
            >
              <Cell fill="var(--success)" />
              <Cell fill="var(--danger)" />
            </Pie>
            <Tooltip content={<RatioTooltip />} />
            <Legend
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
          No data
        </div>
      )}
    </div>
  );
};

export default ProductRatioChart;
