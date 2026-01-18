import { Badge } from './ui/badge';

type Props = {
  status: string;
};

const badgeVariants: Record<string, string> = {
  'In Stock': 'bg-blue-500',
  'Low Stock': 'bg-yellow-500',
  'Out of Stock': 'bg-red-500',
};

const ItemBadge = ({ status }: Props) => {
  return <Badge className={`${badgeVariants[status]}`}>{status}</Badge>;
};

export default ItemBadge;
