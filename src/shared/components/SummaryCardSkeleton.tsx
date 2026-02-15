import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

const SummaryCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-6 w-2/5" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-1/4" />
      </CardContent>
    </Card>
  );
};

export default SummaryCardSkeleton;
