import type { Item } from '@stockify/schema';

type Props = {
  inventoryItems: Item[];
};

const ItemsOption = ({ inventoryItems }: Props) => {
  return (
    <>
      {inventoryItems.map((item: Item) => (
        <option key={item.id} value={`${item.id}`}>
          {item.name}
        </option>
      ))}
    </>
  );
};

export default ItemsOption;
