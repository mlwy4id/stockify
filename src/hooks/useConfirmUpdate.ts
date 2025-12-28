import useItemStore from '@/store/useItemStore';
import type { Item } from '@/types/inventory';
import { useModalActions } from './useModalActions';

export const useConfirmUpdate = (item?: Item) => {
  const updateItem = useItemStore((state) => state.updateItem);
  const { closeModalAndToInventory } = useModalActions();

  const confirmUpdate = (data: any) => {
    updateItem(item?.id, data);
    closeModalAndToInventory();
  };

  return { confirmUpdate };
};
