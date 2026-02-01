import ItemCard from '@/components/card/inventory/InventoryItemsCard';
import TableSkeleton from '@/components/table/TableSkeleton';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import EmptyInventoryCards from '@/containers/card/inventory/EmptyInventoryCards';
import type { Item } from '@/types/inventory.type';
import SearchNotFound from '@/components/filters/SearchNotFound';

type Props = {
  statusValue: string;
  searchValue: string;
};

const InventoryCardsContainer = ({ statusValue, searchValue }: Props) => {
  const { isLoading, data: inventoryItems } = useGetInventoryItems(statusValue);
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();

  if (isLoading) return <TableSkeleton />;
  if (inventoryItems.length === 0) return <EmptyInventoryCards />;

  const filteredItems = inventoryItems.filter((i: Item) =>
    i.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  if (filteredItems.length === 0) return <SearchNotFound message="No items found" />;

  return (
    <section>
      <ItemCard items={filteredItems} openEditModal={toEditItem} openDeleteModal={toDeleteItem} />
    </section>
  );
};

export default InventoryCardsContainer;
