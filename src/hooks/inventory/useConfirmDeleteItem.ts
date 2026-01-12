import type { Item } from 'src/types/inventory.type';
import { useDeleteInventoryItem } from '../queries/inventory.query';

export const useConfirmDeleteItem = (item: Item) => {
  const { isPending, mutate } = useDeleteInventoryItem();

  const confirmDelete = () => {
    mutate(item.id);
  };

  return { isPending, confirmDelete };
};
