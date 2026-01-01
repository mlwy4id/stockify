import { useCreateInventoryItem } from './queries/inventory.query';

export const useConfirmCreateItem = () => {
  const { mutate } = useCreateInventoryItem();

  const confirmCreate = (item: any) => {
    mutate(item);
  };

  return { confirmCreate };
};
