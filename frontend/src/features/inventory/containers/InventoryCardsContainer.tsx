'use client';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';
import { useGetInventoryItems } from '../hooks/queries/inventory.query';
import EmptyInventoryCards from '../components/EmptyInventoryCards';
import type { Item } from '@/shared/types/inventory.type';
import SearchNotFound from '@/shared/components/filters/SearchNotFound';
import ItemCard from '../components/ItemCard';
import { useSearchParams } from 'next/navigation';
import InventoryCardsSkeleton from '../components/InventoryCardsSkeleton';
import { useStatusFilterQuery } from '../hooks/useStatusFilterQuery';

type Props = {
  searchValue: string;
};

const InventoryCardsContainer = ({ searchValue }: Props) => {
  const { status: statusValue } = useStatusFilterQuery();

  const { isLoading, data } = useGetInventoryItems(statusValue);
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();
  const searchParams = useSearchParams();

  const inventoryItems = data ?? [];

  if (isLoading) return <InventoryCardsSkeleton />;

  if (inventoryItems.length === 0 && searchParams.toString() === '') return <EmptyInventoryCards />;
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
              unit={item?.unit.symbol ?? 'unit'}
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
