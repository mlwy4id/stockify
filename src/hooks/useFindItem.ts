import useItemStore from '@/store/useItemStore';

export const useFindItem = (id: string | undefined) => {
  const items = useItemStore((state) => state.inventoryItems);

  if (id === undefined) return;

  const item = items.find((item) => item.id === id);
  return item;
};
