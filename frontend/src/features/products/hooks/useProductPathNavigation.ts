import { useRouter } from 'next/navigation';

export const useProductPathNavigation = () => {
  const router = useRouter();

  return {
    toProducts: () => router.push('/products'),
    toCreateProduct: () => router.push('/products/new'),
    toEditProduct: (id: string) => router.push(`/products/${id}/edit`),
    toArchiveProduct: (id: string) => router.push(`/products/${id}/delete`),
  };
};
