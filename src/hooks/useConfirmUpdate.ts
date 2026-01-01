import type { Item, UpdateItem } from '@/types/inventory';
import { useUpdateInventoryItem } from './queries/inventory.query';

export const useConfirmUpdate = (item: Item) => {
  const { mutate, isPending } = useUpdateInventoryItem();

  const confirmUpdate = (updatedItem: UpdateItem) => {
    mutate({ id: item.id, item: updatedItem });
  };

  return { confirmUpdate, isPending };
};
