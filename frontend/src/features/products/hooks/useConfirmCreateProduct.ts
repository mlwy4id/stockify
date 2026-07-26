import type { CreateProduct } from '@/shared/types/product.type';
import { useCreateProduct } from './queries/product.query';

export const useConfirmCreateProduct = () => {
  const { mutate, isPending } = useCreateProduct();

  const confirmCreate = (product: CreateProduct) => {
    mutate(product);
  };

  return { confirmCreate, isPending };
};
