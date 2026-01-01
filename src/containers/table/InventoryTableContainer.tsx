import EmptyTable from '@/components/table/EmptyTable';
import InventoryTable from '@/components/table/InventoryTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const InventoryTableContainer = () => {
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();
  const { isFetching, data: inventoryItems } = useGetInventoryItems();

  if (isFetching) return <Spinner />;

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
