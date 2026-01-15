import InventoryTable from '@/components/table/InventoryTable';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Item } from '@/types/inventory.type';
import { LuTriangleAlert } from 'react-icons/lu';

type Props = {
  lowStockItems: Item[];
};

const LowStockItemCard = ({ lowStockItems }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LuTriangleAlert size={24} fill="yellow" />
          <h1 className="text-2xl font-semibold heading">Low Stock Items</h1>
        </div>
      </CardHeader>
      <CardContent>
        <InventoryTable items={lowStockItems} openEditModal={() => {}} openDeleteModal={() => {}} />
      </CardContent>
    </Card>
  );
};

export default LowStockItemCard;
