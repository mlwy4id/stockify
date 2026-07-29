'use client';
import ActivityCard from '../components/ActivityCard';
import EmptyRecentActivity from '../components/EmptyRecentActivity';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Clock } from 'lucide-react';

type RecentActivity = {
  id: string;
  action: string;
  quantity: string;
  createdAt: Date;
  item: { id: string; name: string };
};

type Props = {
  recentTransactions: RecentActivity[];
};

const RecentActivityCard = ({ recentTransactions }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex items-center border-b">
        <Clock size={20} stroke="blue" />
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
