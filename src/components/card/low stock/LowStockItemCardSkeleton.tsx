import { Skeleton } from '@/components/ui/skeleton';

const LowStockItemCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-1 p-2 border-l-4 border-l-yellow-200">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
};

export default LowStockItemCardSkeleton;
