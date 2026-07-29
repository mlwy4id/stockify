'use client';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

const ProductCardSkeleton = () => {
  return (
    <Card className={cn('w-xs', 'py-4 px-8 gap-3 items-center justify-center')}>
      <CardHeader className="flex w-full h-32 rounded-md items-center justify-center">
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent className="px-0 flex flex-col items-center gap-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-14" />
      </CardContent>
      <Skeleton className="absolute top-2 right-2 size-4" />
    </Card>
  );
};

const ProductCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardsSkeleton;
