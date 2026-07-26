import { useParams } from 'next/navigation';
import { useGetProduct } from './queries/product.query';

export const useCurrentProduct = () => {
  const params = useParams<{ id: string }>();
  const { isLoading, data: product } = useGetProduct(params?.id ?? '');

  return { isLoading, product };
};
