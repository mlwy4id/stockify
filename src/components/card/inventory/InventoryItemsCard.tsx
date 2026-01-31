import type { Item } from '@/types/inventory.type';
import ItemCard from './ItemCard';

type Props = {
  items: Item[];
  openEditModal: (id: string) => void;
  openDeleteModal: (id: string) => void;
};

const InventoryItemCards = ({ items, openEditModal, openDeleteModal }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        return (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            currentStock={item.currentStock}
            status={item.status}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
          />
        );
      })}
    </div>
  );
};

export default InventoryItemCards;
