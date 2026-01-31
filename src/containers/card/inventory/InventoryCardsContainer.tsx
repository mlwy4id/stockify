import ItemCard from '@/components/card/inventory/InventoryItemsCard';
import TableSkeleton from '@/components/table/TableSkeleton';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import EmptyInventoryCards from '@/containers/card/inventory/EmptyInventoryCards';

type Props = {
  statusValue: string;
};

const InventoryCardsContainer = ({ statusValue }: Props) => {
  const { isLoading, data: inventoryItems } = useGetInventoryItems(statusValue);
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();

  if (isLoading) return <TableSkeleton />;
  if (inventoryItems.length === 0) return <EmptyInventoryCards />;

  return (
    <section>
      <ItemCard items={inventoryItems} openEditModal={toEditItem} openDeleteModal={toDeleteItem} />
    </section>
  );
};

export default InventoryCardsContainer;
