import type { CreateProduct } from '@/shared/types/product.type';
import { useCreateProduct } from './queries/product.query';

export const useConfirmCreateProduct = (onSuccess?: () => void) => {
  const { mutate, isPending } = useCreateProduct(onSuccess);

  const confirmCreate = (product: CreateProduct) => {
    mutate(product);
  };

  return { confirmCreate, isPending };
};
