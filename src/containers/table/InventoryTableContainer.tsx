import EmptyTable from '@/components/table/EmptyTable';
import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent } from '@/components/ui/card';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const InventoryTableContainer = () => {
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();
  const { isLoading, data: inventoryItems } = useGetInventoryItems();

  return (
    <Card className="h-screen">
      <CardContent className="h-full">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : inventoryItems.length === 0 ? (
          <EmptyTable />
        ) : (
          <InventoryTable
            items={inventoryItems}
            openEditModal={toEditItem}
            openDeleteModal={toDeleteItem}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTableContainer;
