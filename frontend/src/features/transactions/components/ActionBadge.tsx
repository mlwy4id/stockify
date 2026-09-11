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

const actionLabels: Record<StockMovementAction, string> = {
  RESTOCK: 'Restok',
  SOLD: 'Terjual',
  REFUND: 'Retur',
  BROKEN: 'Rusak',
};

const ActionBadge = ({ action }: Props) => {
  return (
    <Badge className={`${badgeVariants[action]} h-6 min-w-18`}>
      {actionLabels[action]}
    </Badge>
  );
};

export default ActionBadge;
