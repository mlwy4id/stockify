import { getProductChart, getProductDashboard } from '@/shared/lib/api/product.api';
import { useQuery } from '@tanstack/react-query';
import type { ProductDashboard, ProductStockChart } from '@/shared/types/product.type';

export const useGetProductDashboard = (id: string) => {
  return useQuery<ProductDashboard>({
    queryKey: ['ProductDashboard', id],
    queryFn: () => getProductDashboard(id),
    enabled: !!id,
  });
};

export const useGetProductChart = (id: string, range?: string) => {
  return useQuery<ProductStockChart>({
    queryKey: ['ProductChart', id, range ?? 'all'],
    queryFn: () => getProductChart(id, range),
    enabled: !!id,
  });
};
