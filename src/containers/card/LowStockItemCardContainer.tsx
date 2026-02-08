import EmptyLowStockItem from '@/components/card/low stock/EmptyLowStockItem';
import LowStockItemCard from '@/components/card/low stock/LowStockItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Item } from '@/types/inventory.type';
import { LuTriangleAlert } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

type Props = {
  lowStockItems: Item[];
};

const LowStockItemCardContainer = ({ lowStockItems }: Props) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex items-center border-b">
        <LuTriangleAlert size={20} fill="yellow" />
        <h1>Low Stock Items</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {lowStockItems.length === 0 ? (
          <EmptyLowStockItem />
        ) : (
          lowStockItems.map((item) => (
            <LowStockItemCard key={item.id} itemName={item.name} quantity={item.currentStock} />
          ))
        )}
      </CardContent>
      <CardFooter>
        {lowStockItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => navigate({ pathname: '/inventory', search: '?status=Low+Stock' })}
          >
            View Inventory
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LowStockItemCardContainer;
