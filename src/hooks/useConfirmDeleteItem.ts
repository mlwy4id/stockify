import useItemStore from '@/store/useItemStore';
import { useModalActions } from './useModalActions';
import type { Item } from '@/types/inventory';

export const useConfirmDeleteItem = (item?: Item) => {
  const { closeModalAndToInventory } = useModalActions();
  const deleteItem = useItemStore((state) => state.deleteItem);

  const confirmDelete = () => {
    deleteItem(item?.id || '');
    closeModalAndToInventory();
  };

  return { confirmDelete };
};
