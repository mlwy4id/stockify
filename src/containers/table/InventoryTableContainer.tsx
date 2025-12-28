import EmptyTable from '@/components/table/EmptyTable';
import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent } from '@/components/ui/card';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';
import useItemStore from '@/store/useItemStore';

const InventoryTableContainer = () => {
  const inventoryItems = useItemStore((state) => state.inventoryItems);
  const { toEditItem, toDeleteItem } = useInventoryPathNavigation();

  return (
    <Card className="h-screen mt-2">
      <CardContent className="h-full">
        {inventoryItems.length === 0 ? (
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
