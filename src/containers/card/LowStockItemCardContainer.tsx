import LowStockItemCard from '@/components/card/LowStockItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';
import type { Item } from '@/types/inventory.type';
import { LuTriangleAlert } from 'react-icons/lu';

type Props = {
  lowStockItems: Item[];
};

const LowStockItemCardContainer = ({ lowStockItems }: Props) => {
  const { toInventory } = useInventoryPathNavigation();
  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex items-center border-b">
        <LuTriangleAlert size={20} fill="yellow" />
        <h1>Low Stock Items</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {lowStockItems.map((item) => (
          <LowStockItemCard key={item.id} itemName={item.name} quantity={item.currentStock} />
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={toInventory}>
          View Inventory
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LowStockItemCardContainer;
