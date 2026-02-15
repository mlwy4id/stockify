import { Badge } from '@/shared/components';

type Props = {
  action: string;
};

const badgeVariants: Record<string, string> = {
  Restock: 'bg-green-500',
  Sold: 'bg-red-500',
};

const ActionBadge = ({ action }: Props) => {
  return <Badge className={`${badgeVariants[action]} h-6 min-w-18`}>{action}</Badge>;
};

export default ActionBadge;
