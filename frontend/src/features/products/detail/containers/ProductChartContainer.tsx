'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import ProductChart from '../components/ProductChart';
import { useGetProductChart } from '../hooks/queries/product-detail.query';

type Props = {
  id: string;
};

const ProductChartContainer = ({ id }: Props) => {
  const [range, setRange] = useState('');
  const { isLoading, data } = useGetProductChart(id, range);

  return (
    <Card>
      <CardHeader className="font-semibold border-b">
        <h2>Stock Level Over Time</h2>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ProductChart points={data?.points ?? []} range={range} onRangeChange={setRange} />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductChartContainer;
