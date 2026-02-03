import { Skeleton } from '@/components/ui/skeleton';

const ActivityCardSkeleton = () => {
  return (
    <div className="flex justify-between items-center gap-1 p-2 border-l-4 border-l-slate-200">
      <div className="flex items-start gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />

        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <Skeleton className="h-4 w-20" />
    </div>
  );
};

export default ActivityCardSkeleton;
