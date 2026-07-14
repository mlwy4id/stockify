import { useRouter } from 'next/navigation';

export const useInventoryPathNavigation = () => {
  const router = useRouter();

  return {
    toInventory: () => router.push('/inventory'),
    toCreateItem: () => router.push('/inventory/new'),
    toEditItem: (id: string) => router.push(`/inventory/${id}/edit`),
    toDeleteItem: (id: string) => router.push(`/inventory/${id}/delete`),
  };
};
