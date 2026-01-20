import ActivityCard from '@/components/card/ActivityCard';
import EmptyRecentTransaction from '@/components/card/EmptyRecentTransaction';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Transaction } from '@/types/transaction.type';
import { LuClock } from 'react-icons/lu';

type Props = {
  recentTransactions: Transaction[];
};

const RecentActivityCard = ({ recentTransactions }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex items-center border-b">
        <LuClock size={20} stroke="blue" />
        <h1>Recent Activity</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 h-full">
        {recentTransactions.length === 0 ? (
          <EmptyRecentTransaction />
        ) : (
          recentTransactions.map((transaction) => (
            <ActivityCard
              key={transaction.id}
              transactionType={transaction.action}
              quantity={transaction.quantity}
              createdAt={transaction.createdAt}
              itemName={transaction.item.name}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
