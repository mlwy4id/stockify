'use client';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent } from '@/shared/components/ui/card';

const CategoryCardSkeleton = () => {
  return (
    <Card className="py-4 px-6 gap-0">
      <CardContent className="px-0 py-0 flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  );
};

const CategoryCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default CategoryCardsSkeleton;
