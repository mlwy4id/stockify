import useItemStore from '@/store/useItemStore';
import type { Item } from '@/types/inventory';
import { useInventoryPathNavigation } from './useInventoryPathNavigation';

export const useConfirmDeleteItem = (item?: Item) => {
  const { toInventory } = useInventoryPathNavigation();
  const deleteItem = useItemStore((state) => state.deleteItem);

  const confirmDelete = () => {
    deleteItem(item?.id || '');
    toInventory();
  };

  return { confirmDelete };
};
