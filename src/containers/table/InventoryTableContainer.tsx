import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent } from '@/components/ui/card';
import { useModalActions } from '@/hooks/useModalActions';
import useItemStore from '@/store/useItemStore';

const InventoryTableContainer = () => {
  const inventoryItems = useItemStore((state) => state.inventoryItems);
  const { openEditItem } = useModalActions();

  return (
    <Card className="h-screen mt-2">
      <CardContent>
        <InventoryTable items={inventoryItems} openEditModal={openEditItem} />
      </CardContent>
    </Card>
  );
};

export default InventoryTableContainer;
