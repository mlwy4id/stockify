import SummaryCardSkeleton from './SummaryCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import ActivityCardSkeleton from './ActivityCardSkeleton';
import LowStockItemCardSkeleton from './LowStockItemCardSkeleton';

const DashboardSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-2 border-b">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-36" />
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <LowStockItemCardSkeleton key={i} />
          ))}
        </CardContent>

        <CardFooter>
          <Skeleton className="h-8 w-32 rounded-md" />
        </CardFooter>
      </Card>

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-2 border-b">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSkeleton;
