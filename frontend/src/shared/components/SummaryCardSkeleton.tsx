'use client';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

const SummaryCardSkeleton = () => {
  return (
    <Card className="flex-row items-stretch gap-0 overflow-hidden bg-white p-0">
      <div className="w-1.5 shrink-0 bg-accent" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 py-4 pl-4 pr-5">
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-2/5" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-10 w-1/4" />
        </CardContent>
      </div>
    </Card>
  );
};

export default SummaryCardSkeleton;
