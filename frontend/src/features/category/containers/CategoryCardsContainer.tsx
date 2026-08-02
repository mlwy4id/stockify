'use client';
import { useRouter } from 'next/navigation';
import { useGetCategories } from '../hooks/queries/category.query';
import { useGetProducts } from '@/features/products/hooks/queries/product.query';
import EmptyCategories from '../components/EmptyCategories';
import CategoryCard from '../components/CategoryCard';
import CategoryCardsSkeleton from '../components/CategoryCardsSkeleton';
import type { Product } from '@/shared/types/product.type';
import { useEffect, useMemo } from 'react';

type Props = {
  setCategoriesDataAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const CategoryCardsContainer = ({ setCategoriesDataAvailability, onEdit, onDelete }: Props) => {
  const router = useRouter();
  const { isLoading, data } = useGetCategories();
  const { data: products } = useGetProducts();

  const categories = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );

  useEffect(() => {
    setCategoriesDataAvailability(categories.length > 0);
  }, [categories, setCategoriesDataAvailability]);
  const productCountByCategory = (products ?? []).reduce(
    (counts: Record<string, number>, product: Product) => {
      if (product.categoryId) counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
      return counts;
    },
    {}
  );

  if (isLoading) return <CategoryCardsSkeleton />;

  if (categories.length === 0) return <EmptyCategories />;

  return (
    <section className="flex-1 min-h-0 overflow-y-auto pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            productCount={productCountByCategory[category.id] ?? 0}
            onClick={(id) => router.push(`/products?category=${id}`)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryCardsContainer;
