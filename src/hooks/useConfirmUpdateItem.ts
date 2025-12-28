import useItemStore from '@/store/useItemStore';
import type { Item } from '@/types/inventory';
import { useInventoryPathNavigation } from './useInventoryPathNavigation';

export const useConfirmUpdateItem = (item?: Item) => {
  const updateItem = useItemStore((state) => state.updateItem);
  const { toInventory } = useInventoryPathNavigation();

  const confirmUpdate = (data: any) => {
    updateItem(item?.id, data);
    toInventory();
  };

  return { confirmUpdate };
};
