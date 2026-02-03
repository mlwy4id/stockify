import { Skeleton } from '@/components/ui/skeleton';

const TransactionCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-44" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </div>
  );
};

const TransactionsCardsSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <TransactionCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default TransactionsCardsSkeleton;
