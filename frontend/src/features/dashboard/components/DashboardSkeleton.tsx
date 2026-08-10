'use client';
import LowStockItemCardSkeleton from './LowStockItemCardSkeleton';
import SummaryCardSkeleton from '@/shared/components/SummaryCardSkeleton';
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center gap-2 border-b">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <LowStockItemCardSkeleton key={i} />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardSkeleton;
