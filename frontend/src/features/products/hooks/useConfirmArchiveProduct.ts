import type { Product } from '@/shared/types/product.type';
import { useArchiveProduct } from './queries/product.query';

export const useConfirmArchiveProduct = (product: Product) => {
  const { isPending, mutate } = useArchiveProduct();

  const confirmArchive = () => {
    mutate(product.id);
  };

  return { isPending, confirmArchive };
};
