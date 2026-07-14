import type { Item, UpdateItem } from '@/shared/types/inventory.type';
import { useUpdateInventoryItem } from './queries/inventory.query';

export const useConfirmUpdateItem = (item: Item) => {
  const { mutate, isPending } = useUpdateInventoryItem();

  const confirmUpdate = (updatedItem: UpdateItem) => {
    mutate({ id: item.id, item: updatedItem });
  };

  return { confirmUpdate, isPending };
};
