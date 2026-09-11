'use client';
import { useMemo } from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';

type Props = {
  name: string;
  imageUrl?: string | null;
  categoryId?: string | null;
  currentStock: number;
  stockThreshold?: number;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ProductDetailCard = ({
  name,
  imageUrl,
  categoryId,
  currentStock,
  stockThreshold,
}: Props) => {
  const { data: categories } = useGetCategories();
  const initials = getInitials(name);

  const categoryName = useMemo(() => {
    if (!categoryId) return null;
    return categories?.find((category) => category.id === categoryId)?.name ?? null;
  }, [categories, categoryId]);

  return (
    <Card className="flex-row items-center gap-4 bg-white p-4 lg:min-w-xl">
      {imageUrl ? (
        <div className="flex w-40 h-30 rounded-md overflow-hidden bg-primary-subtle shrink-0">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="flex w-20 h-20 rounded-md items-center justify-center bg-primary-subtle text-lg font-bold text-primary select-none shrink-0">
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-tight truncate">{nameFormatter(name)}</h1>
        {categoryName && (
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary-subtle text-primary">
              {nameFormatter(categoryName)}
            </span>
          </div>
        )}
      </div>

      <div className="ml-auto hidden md:flex items-center gap-6 lg:gap-10 pl-4 lg:pl-6 border-l border-border shrink-0">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="size-3.5" />
            Stok Saat Ini
          </p>
          <p className="mt-1 text-lg font-semibold text-primary whitespace-nowrap">
            {currentStock} item
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="size-3.5" />
            Ambang Stok
          </p>
          <p className="mt-1 text-lg font-semibold text-warning whitespace-nowrap">
            {stockThreshold ? `${stockThreshold} item` : 'Belum diatur'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProductDetailCard;
