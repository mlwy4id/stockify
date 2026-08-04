'use client';
import { Badge } from '@/shared/components/ui/badge';
import type { StockMovementAction } from '@/shared/types/stock-movement.type';

type Props = {
  action: StockMovementAction;
};

const badgeVariants: Record<StockMovementAction, string> = {
  RESTOCK: 'bg-success',
  SOLD: 'bg-danger',
  REFUND: 'bg-success',
  BROKEN: 'bg-danger',
};

const ActionBadge = ({ action }: Props) => {
  return (
    <Badge className={`${badgeVariants[action]} h-6 min-w-18`}>
      {action.charAt(0) + action.slice(1).toLowerCase()}
    </Badge>
  );
};

export default ActionBadge;
