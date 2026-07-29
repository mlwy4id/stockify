'use client';
import { Badge } from '@/shared/components/ui/badge';
import type { StockMovementAction } from '@/shared/types/stock-movement.type';

type Props = {
  action: StockMovementAction;
};

const badgeVariants: Record<StockMovementAction, string> = {
  RESTOCK: 'bg-green-500',
  SOLD: 'bg-red-500',
  REFUND: 'bg-yellow-500',
  BROKEN: 'bg-orange-500',
};

const ActionBadge = ({ action }: Props) => {
  return (
    <Badge className={`${badgeVariants[action]} h-6 min-w-18`}>
      {action.charAt(0) + action.slice(1).toLowerCase()}
    </Badge>
  );
};

export default ActionBadge;
