import { Badge } from './ui/badge';

type Props = {
  action: string;
};

const badgeVariants: Record<string, string> = {
  Restock: 'bg-green-500',
  Sold: 'bg-red-500',
};

const ActionBadge = ({ action }: Props) => {
  return <Badge className={`${badgeVariants[action]}`}>{action}</Badge>;
};

export default ActionBadge;
