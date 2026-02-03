import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import EmptyInventoryCards from '@/components/card/inventory/EmptyInventoryCards';
import type { Item } from '@/types/inventory.type';
import SearchNotFound from '@/components/filters/SearchNotFound';
import ItemCard from '@/components/card/inventory/ItemCard';
import { useLocation } from 'react-router-dom';
import InventoryCardsSkeleton from '@/components/skeleton/InventoryCardsSkeleton';

type Props = {
  statusValue: string;
  searchValue: string;
};

const InventoryCardsContainer = ({ statusValue, searchValue }: Props) => {
  const { isLoading, data: inventoryItems } = useGetInventoryItems(statusValue);
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();
  const location = useLocation();

  if (isLoading) return <InventoryCardsSkeleton />;

  if (inventoryItems.length === 0 && location.search === '') return <EmptyInventoryCards />;
  if (inventoryItems.length === 0) return <SearchNotFound message="No items found" />;

  const filteredItems = inventoryItems.filter((i: Item) =>
    i.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  if (filteredItems.length === 0) return <SearchNotFound message="No items found" />;

  return (
    <section>
      <div className="flex flex-col gap-2">
        {filteredItems.map((item: Item) => {
          return (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              currentStock={item.currentStock}
              status={item.status}
              openEditModal={toEditItem}
              openDeleteModal={toDeleteItem}
            />
          );
        })}
      </div>
    </section>
  );
};

export default InventoryCardsContainer;
