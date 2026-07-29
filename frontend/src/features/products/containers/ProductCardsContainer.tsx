'use client';
import { useGetProducts } from '../hooks/queries/product.query';
import EmptyProductCards from '../components/EmptyProductCards';
import type { Product } from '@/shared/types/product.type';
import SearchNotFound from '@/shared/components/filters/SearchNotFound';
import ProductCard from '../components/ProductCard';
import ProductCardsSkeleton from '../components/ProductCardsSkeleton';

type Props = {
  searchValue: string;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
};

const ProductCardsContainer = ({ searchValue, onEdit, onArchive }: Props) => {
  const { isLoading, data } = useGetProducts();

  const products = data ?? [];

  if (isLoading) return <ProductCardsSkeleton />;

  if (products.length === 0) return <EmptyProductCards />;

  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  if (filteredProducts.length === 0) return <SearchNotFound message="No products found" />;

  return (
    <section>
      <div className="flex flex-col gap-2">
        {filteredProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            quantity={product.quantity}
            onEdit={onEdit}
            onArchive={onArchive}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCardsContainer;
