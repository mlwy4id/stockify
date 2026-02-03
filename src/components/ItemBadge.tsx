import { Badge } from './ui/badge';

type Props = {
  status: string;
};

const badgeVariants: Record<string, string> = {
  'In Stock': 'bg-green-500',
  'Low Stock': 'bg-yellow-500',
  'Out of Stock': 'bg-red-500',
};

const ItemBadge = ({ status }: Props) => {
  return <Badge className={`${badgeVariants[status]} h-6 min-w-24`}>{status}</Badge>;
};

export default ItemBadge;
