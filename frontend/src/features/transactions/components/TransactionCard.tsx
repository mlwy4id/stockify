'use client';
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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-gray-900">{nameFormatter(productName)}</span>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            {isIn ? '+' : '-'}
            {quantity} items
          </span>
          <span>•</span>
          <span>{dateFormatter(new Date(date))}</span>
          {source && (
            <>
              <span>•</span>
              <span className="text-gray-400">{source}</span>
            </>
          )}
        </div>

        {reason && <span className="text-xs text-gray-400">{reason}</span>}
      </div>

      <ActionBadge action={action} />
    </div>
  );
};

export default TransactionCard;
