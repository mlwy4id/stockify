'use client';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import type { Product } from '@/shared/types/product.type';

type Props = {
  products: Product[];
};

const ProductsOption = ({ products }: Props) => {
  return (
    <>
      {products.map((product: Product) => (
        <option key={product.id} value={product.id}>
          {nameFormatter(product.name)}
        </option>
      ))}
    </>
  );
};

export default ProductsOption;
