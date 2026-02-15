import type { Item } from '@/shared/types';
import { useDeleteInventoryItem } from './queries/inventory.query';

export const useConfirmDeleteItem = (item: Item) => {
  const { isPending, mutate } = useDeleteInventoryItem();

  const confirmDelete = () => {
    mutate(item.id);
  };

  return { isPending, confirmDelete };
};
