'use client';
import { Skeleton } from '@/shared/components/ui/skeleton';

const TransactionsTableSkeleton = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b bg-muted/50 px-2 py-3 flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20 hidden lg:block" />
        <Skeleton className="h-4 w-20 hidden lg:block" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b px-2 py-3 last:border-0">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28 hidden lg:block" />
          <Skeleton className="h-4 w-32 hidden lg:block" />
        </div>
      ))}
    </div>
  );
};

const TransactionsCardsSkeleton = () => {
  return <TransactionsTableSkeleton />;
};

export default TransactionsCardsSkeleton;
