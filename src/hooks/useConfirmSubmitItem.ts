import useItemStore from '@/store/useItemStore';
import { useInventoryPathNavigation } from './useInventoryPathNavigation';
import type { Item } from '@/types/inventory';

export const useConfirmSubmitItem = (item?: Item) => {
  const deleteItem = useItemStore((state) => state.deleteItem);
  const { toInventory } = useInventoryPathNavigation();

  const confirmDelete = () => {
    deleteItem(item?.id || '');
    toInventory();
  };

  return { confirmDelete };
};
