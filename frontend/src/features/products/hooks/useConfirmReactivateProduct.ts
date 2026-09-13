import type { Product } from '@/shared/types/product.type';
import { useReactivateProduct } from './queries/product.query';

export const useConfirmReactivateProduct = (product?: Product, onSuccess?: () => void) => {
  const { isPending, mutate } = useReactivateProduct(onSuccess);

  const confirmReactivate = () => {
    if (!product) return;
    mutate(product.id);
  };

  return { isPending, confirmReactivate };
};