'use client';
import { Badge } from '@/shared/components/ui/badge';

type Props = {
  status: string;
};

const badgeVariants: Record<string, string> = {
  In_Stock: 'bg-green-500',
  Low_Stock: 'bg-yellow-500',
  Out_Of_Stock: 'bg-red-500',
};

const ItemBadge = ({ status }: Props) => {
  return <Badge className={`${badgeVariants[status]} h-6 min-w-24`}>{status.split("_").join(" ")}</Badge>;
};

export default ItemBadge;
