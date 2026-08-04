'use client';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';

type TopMover = {
  productId: string;
  productName: string;
  totalIn: number;
  totalOut: number;
};

type Props = {
  topMovers: TopMover[];
};

const TopMoversCard = ({ topMovers }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex flex-row items-center gap-2 border-b">
        <TrendingUp size={20} className="text-primary" />
        <h1>Top Movers</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {topMovers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No stock-out activity yet</p>
        ) : (
          topMovers.map((mover, index) => (
            <div
              key={mover.productId}
              className="flex items-center justify-between p-2 border-l-4 border-l-primary hover:bg-primary-subtle"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-bold text-muted-foreground w-5">{index + 1}</span>
                <p className="text-sm font-semibold text-foreground truncate">
                  {nameFormatter(mover.productName)}
                </p>
              </div>
              <p className="text-sm font-semibold text-neutral-action min-w-16 text-left">
                -{mover.totalOut} items
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TopMoversCard;
