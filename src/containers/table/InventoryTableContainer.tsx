import EmptyTable from '@/components/table/EmptyTable';
import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent } from '@/components/ui/card';
import { useModalActions } from '@/hooks/useModalActions';
import useItemStore from '@/store/useItemStore';

const InventoryTableContainer = () => {
  const inventoryItems = useItemStore((state) => state.inventoryItems);
  const { openEditItem, openDeleteItem } = useModalActions();

  return (
    <Card className="h-screen mt-2">
      <CardContent className="h-full">
        {inventoryItems.length === 0 ? (
          <EmptyTable />
        ) : (
          <InventoryTable
            items={inventoryItems}
            openEditModal={openEditItem}
            openDeleteModal={openDeleteItem}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTableContainer;
