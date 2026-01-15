import EmptyTable from '@/components/table/EmptyTable';
import InventoryTable from '@/components/table/InventoryTable';
import TableSkeleton from '@/components/table/TableSkeleton';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';

const InventoryTableContainer = () => {
  const { isLoading, data: inventoryItems } = useGetInventoryItems();
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();

  if (isLoading) return <TableSkeleton />;

  if (inventoryItems.length === 0) {
    return <EmptyTable />;
  } else {
    return (
      <InventoryTable
        items={inventoryItems}
        openEditModal={toEditItem}
        openDeleteModal={toDeleteItem}
      />
    );
  }
};

export default InventoryTableContainer;
