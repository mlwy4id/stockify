import { useGetProduct } from './queries/product.query';

export const useCurrentProduct = (id?: string) => {
  const { isLoading, data: product } = useGetProduct(id ?? '');

  return { isLoading, product };
};
