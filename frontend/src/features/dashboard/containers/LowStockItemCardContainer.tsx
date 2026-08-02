'use client';
import EmptyLowStockItem from '../components/EmptyLowStockItem';
import LowStockItemCard from '../components/LowStockItemCard';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import type { Product } from '@/shared/types/product.type';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  lowStockItems: Product[];
};

const LowStockItemCardContainer = ({ lowStockItems }: Props) => {
  const router = useRouter();

  return (
    <Card className="h-full">
      <CardHeader className="font-semibold flex items-center border-b">
        <TriangleAlert size={20} fill="yellow" />
        <h1>Low Stock Items</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {lowStockItems.length === 0 ? (
          <EmptyLowStockItem />
        ) : (
          lowStockItems.map((item) => (
            <LowStockItemCard key={item.id} itemName={item.name} quantity={String(item.quantity)} />
          ))
        )}
      </CardContent>
      <CardFooter>
        {lowStockItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => router.push('/products')}
          >
            View Products
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LowStockItemCardContainer;
