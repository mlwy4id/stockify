import EmptyTable from '@/components/table/inventory/EmptyInventoryTable';
import InventoryTable from '@/components/table/inventory/InventoryTable';
import TableSkeleton from '@/components/table/TableSkeleton';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';

const InventoryTableContainer = () => {
  const { isLoading, data: inventoryItems } = useGetInventoryItems();
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();

  if (isLoading) return <TableSkeleton />;
  if (inventoryItems.length === 0) return <EmptyTable />;

  return (
    <InventoryTable
      items={inventoryItems}
      openEditModal={toEditItem}
      openDeleteModal={toDeleteItem}
    />
  );
};

export default InventoryTableContainer;
