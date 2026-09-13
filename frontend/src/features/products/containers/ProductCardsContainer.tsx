'use client';
import { useGetProducts } from '../hooks/queries/product.query';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';
import EmptyProductCards from '../components/EmptyProductCards';
import type { Product } from '@/shared/types/product.type';
import SearchNotFound from '@/shared/components/filters/SearchNotFound';
import ProductCard from '../components/ProductCard';
import ProductCardsSkeleton from '../components/ProductCardsSkeleton';
import { useEffect, useMemo } from 'react';

type Props = {
  searchValue: string;
  categoryId?: string | null;
  status: string;
  setProductsDataAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onReactivate: (id: string) => void;
};

const ProductCardsContainer = ({
  searchValue,
  categoryId,
  status,
  setProductsDataAvailability,
  onEdit,
  onArchive,
  onReactivate,
}: Props) => {
  const { isLoading, data } = useGetProducts(status);
  const { data: categories } = useGetCategories();

  const products = useMemo(() => data ?? [], [data]);

  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    (categories ?? []).forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  useEffect(() => {
    setProductsDataAvailability(products.length > 0);
  }, [products, setProductsDataAvailability]);

  if (isLoading) return <ProductCardsSkeleton />;

  if (products.length === 0) {
    if (status === 'archived')
      return <SearchNotFound message="Tidak ada produk yang diarsipkan" />;
    return <EmptyProductCards />;
  }

  const filteredProducts = products.filter(
    (p: Product) =>
      (!categoryId || p.categoryId === categoryId) &&
      p.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  if (filteredProducts.length === 0) return <SearchNotFound message="Produk tidak ditemukan" />;

  return (
    <section className="flex min-h-0 overflow-y-auto justify-center lg:justify-start">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            quantity={product.quantity}
            categoryName={product.categoryId ? categoryNames.get(product.categoryId) : null}
            isArchived={product.isArchived}
            onEdit={onEdit}
            onArchive={onArchive}
            onReactivate={onReactivate}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCardsContainer;
