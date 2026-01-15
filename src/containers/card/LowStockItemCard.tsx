import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Item } from '@/types/inventory.type';

type Props = {
  lowStockItems: Item[];
};

const LowStockItemCard = ({ lowStockItems }: Props) => {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-semibold heading">⚠️ Low Stock Items</h1>
      </CardHeader>
      <CardContent>
        <InventoryTable items={lowStockItems} openEditModal={() => {}} openDeleteModal={() => {}} />
      </CardContent>
    </Card>
  );
};

export default LowStockItemCard;
