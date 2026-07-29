import type { Product, UpdateProduct } from '@/shared/types/product.type';
import { useUpdateProduct } from './queries/product.query';

export const useConfirmUpdateProduct = (product: Product, onSuccess?: () => void) => {
  const { mutate, isPending } = useUpdateProduct(onSuccess);

  const confirmUpdate = (updatedProduct: UpdateProduct) => {
    mutate({ id: product.id, ...updatedProduct });
  };

  return { confirmUpdate, isPending };
};
