'use client';
import { Card, CardContent } from '@/shared/components/ui/card';
import { dateFormatter } from '@/shared/lib/formatters/dateFormatter';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import ActionBadge from '../components/ActionBadge';
import type { StockMovementAction } from '@/shared/types/stock-movement.type';

type Props = {
  productName: string;
  quantity: number;
  action: StockMovementAction;
  date: string;
  source?: string;
  reason?: string;
};

const TransactionCard = ({ productName, quantity, action, date, source, reason }: Props) => {
  const isIn = action === 'RESTOCK' || action === 'REFUND';

  return (
    <Card className="py-3 px-5 gap-0">
      <CardContent className="px-0 py-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <ActionBadge action={action} />
            <span className="text-base font-semibold text-gray-900 truncate">
              {nameFormatter(productName)}
            </span>
          </div>
          <span className={`text-sm font-bold whitespace-nowrap ${isIn ? 'text-green-600' : 'text-red-600'}`}>
            {isIn ? '+' : '-'}{quantity} items
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>{dateFormatter(new Date(date))}</span>
        </div>

        {source && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">Source: {source}</p>
        )}
        {reason && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">Reason: {reason}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
