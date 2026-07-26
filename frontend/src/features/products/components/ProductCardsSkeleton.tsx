'use client';
import { Skeleton } from '@/shared/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </div>
  );
};

const ProductCardsSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardsSkeleton;
