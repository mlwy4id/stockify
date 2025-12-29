import useItemStore from '@/store/useItemStore';
import { useInventoryPathNavigation } from './useInventoryPathNavigation';
import type { Item } from '@/types/inventory';

export const useConfirmSubmitItem = (item?: Item) => {
  const addItem = useItemStore((state) => state.addItem);
  const updateItem = useItemStore((state) => state.updateItem);
  const deleteItem = useItemStore((state) => state.deleteItem);
  const { toInventory } = useInventoryPathNavigation();

  const confirmCreate = (item: any) => {
    const itemWithId = { ...item, id: crypto.randomUUID() };
    addItem(itemWithId);
    toInventory();
  };

  const confirmUpdate = (updatedItem: any) => {
    updateItem(item?.id, updatedItem);
    toInventory();
  };

  const confirmDelete = () => {
    deleteItem(item?.id || '');
    toInventory();
  };

  return { confirmCreate, confirmUpdate, confirmDelete };
};
