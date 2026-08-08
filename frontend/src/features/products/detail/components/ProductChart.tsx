'use client';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import type { StockChartPoint } from '@/shared/types/product.type';

const RANGES = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: '' },
];

const WIDTH = 800;
const HEIGHT = 280;
const PAD_X = 10;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

type Props = {
  points: StockChartPoint[];
  range?: string;
  onRangeChange: (range: string) => void;
};

const ProductChart = ({ points, range = '', onRangeChange }: Props) => {
  const chart = useMemo(() => {
    if (points.length === 0) return null;

    const quantities = points.map((p) => p.quantity);
    let minY = Math.min(...quantities);
    let maxY = Math.max(...quantities);
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }

    const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const plotWidth = WIDTH - PAD_X * 2;

    const x = (i: number) =>
      points.length === 1 ? WIDTH / 2 : PAD_X + (i / (points.length - 1)) * plotWidth;
    const y = (v: number) => PAD_TOP + (1 - (v - minY) / (maxY - minY)) * plotHeight;

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.quantity)}`)
      .join(' ');
    const areaPath = `${linePath} L ${x(points.length - 1)} ${PAD_TOP + plotHeight} L ${x(
      0
    )} ${PAD_TOP + plotHeight} Z`;

    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
      const value = minY + ((maxY - minY) * i) / (tickCount - 1);
      return { value, y: y(value) };
    });

    const xTickCount = Math.min(5, points.length);
    const step = (points.length - 1) / Math.max(1, xTickCount - 1);
    const indices = Array.from({ length: xTickCount }, (_, i) => Math.round(i * step));
    const xTicks = indices.map((index) => ({ point: points[index], x: x(index) }));

    const lastIndex = points.length - 1;

    return {
      linePath,
      areaPath,
      yTicks,
      xTicks,
      lastDot: { x: x(lastIndex), y: y(points[lastIndex].quantity) },
    };
  }, [points]);

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

      {chart ? (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
          <defs>
            <linearGradient id="productChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {chart.yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_X}
                y1={t.y}
                x2={WIDTH - PAD_X}
                y2={t.y}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={4}
                y={t.y + 4}
                textAnchor="start"
                className="fill-muted-foreground text-[10px]"
              >
                {Math.round(t.value)}
              </text>
            </g>
          ))}

          <path d={chart.areaPath} fill="url(#productChartFill)" />
          <path
            d={chart.linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={chart.lastDot.x} cy={chart.lastDot.y} r={3.5} fill="var(--primary)" />

          {chart.xTicks.map((t, i) => (
            <text
              key={i}
              x={t.x}
              y={HEIGHT - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {format(new Date(t.point.date), 'd MMM')}
            </text>
          ))}
        </svg>
      ) : (
        <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
          No stock data available
        </div>
      )}
    </div>
  );
};

export default ProductChart;
