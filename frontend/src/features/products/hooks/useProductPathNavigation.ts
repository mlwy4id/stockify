import { useRouter } from 'next/navigation';

export const useProductPathNavigation = () => {
  const router = useRouter();

  return {
    toProducts: () => router.push('/inventory'),
    toCreateProduct: () => router.push('/inventory/new'),
    toEditProduct: (id: string) => router.push(`/inventory/${id}/edit`),
    toArchiveProduct: (id: string) => router.push(`/inventory/${id}/delete`),
  };
};
