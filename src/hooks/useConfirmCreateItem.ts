import useItemStore from '@/store/useItemStore';
import { useInventoryPathNavigation } from './useInventoryPathNavigation';

export const useConfirmCreateItem = () => {
  const addItem = useItemStore((state) => state.addItem);
  const { toInventory } = useInventoryPathNavigation();

  const confirmCreate = (data: any) => {
    const dataWithId = { ...data, id: crypto.randomUUID() };
    addItem(dataWithId);
    toInventory();
  };

  return { confirmCreate };
};
