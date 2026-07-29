import type { Product } from '@/shared/types/product.type';
import { useArchiveProduct } from './queries/product.query';

export const useConfirmArchiveProduct = (product: Product, onSuccess?: () => void) => {
  const { isPending, mutate } = useArchiveProduct(onSuccess);

  const confirmArchive = () => {
    mutate(product.id);
  };

  return { isPending, confirmArchive };
};
