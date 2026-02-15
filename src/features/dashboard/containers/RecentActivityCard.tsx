import ActivityCard from '../components/ActivityCard';
import EmptyRecentActivity from '../components/EmptyRecentActivity';
import { Card, CardContent, CardHeader } from '@/shared/components';
import type { Transaction } from '@/shared/types';
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
          <EmptyRecentActivity />
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
