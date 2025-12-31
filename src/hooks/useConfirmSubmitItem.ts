import useItemStore from '@/store/useItemStore';
import { useInventoryPathNavigation } from './useInventoryPathNavigation';
import type { Item } from '@/types/inventory';

export const useConfirmSubmitItem = (item?: Item) => {
  const updateItem = useItemStore((state) => state.updateItem);
  const deleteItem = useItemStore((state) => state.deleteItem);
  const { toInventory } = useInventoryPathNavigation();

  const confirmUpdate = (updatedItem: any) => {
    updateItem(item?.id, updatedItem);
    toInventory();
  };

  const confirmDelete = () => {
    deleteItem(item?.id || '');
    toInventory();
  };

  return { confirmUpdate, confirmDelete };
};
