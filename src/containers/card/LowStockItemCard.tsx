import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Item } from '@/types/inventory.type';
import { LuTriangleAlert } from 'react-icons/lu';

type Props = {
  lowStockItems: Item[];
};

const LowStockItemCard = ({ lowStockItems }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex items-center">
        <LuTriangleAlert size={20} fill="yellow" />
        <h1>Low Stock Items</h1>
      </CardHeader>
      <CardContent>
        <InventoryTable items={lowStockItems} openEditModal={() => {}} openDeleteModal={() => {}} />
      </CardContent>
    </Card>
  );
};

export default LowStockItemCard;
