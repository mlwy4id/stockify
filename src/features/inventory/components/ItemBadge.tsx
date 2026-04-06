import { Badge } from '@/shared/components';
import { STATUS_LABEL } from '@/shared/const/status';

type Props = {
  status: string;
};

const badgeVariants: Record<string, string> = {
  InStock: 'bg-green-500',
  LowStock: 'bg-yellow-500',
  OutOfStock: 'bg-red-500',
};

const ItemBadge = ({ status }: Props) => {
  return <Badge className={`${badgeVariants[status]} h-6 min-w-24`}>{STATUS_LABEL[status]}</Badge>;
};

export default ItemBadge;
