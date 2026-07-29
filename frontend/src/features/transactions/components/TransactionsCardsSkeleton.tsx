'use client';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent } from '@/shared/components/ui/card';

const TransactionCardSkeleton = () => {
  return (
    <Card className="py-3 px-5 gap-0">
      <CardContent className="px-0 py-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionsCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <TransactionCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default TransactionsCardsSkeleton;
