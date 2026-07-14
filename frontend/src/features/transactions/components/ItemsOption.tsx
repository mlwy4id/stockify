'use client';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import type { Item } from '@/shared/types/inventory.type';

type Props = {
  inventoryItems: Item[];
};

const ItemsOption = ({ inventoryItems }: Props) => {
  return (
    <>
      {inventoryItems.map((item: Item) => (
        <option key={item.id} value={`${item.id}`}>
          {nameFormatter(item.name)}
        </option>
      ))}
    </>
  );
};

export default ItemsOption;
