import { getDashboardStockMovementSummary, getTopMovers, getGlobalStockChart } from '@/shared/lib/api/stock-movement.api';
import { getLowStockProducts } from '@/shared/lib/api/product.api';
import { useQuery } from '@tanstack/react-query';
import type { ProductStockChart } from '@/shared/types/product.type';

export const useGetDashboardStockMovementSummary = () => {
  return useQuery({
    queryKey: ['GlobalStockMovementSummary'],
    queryFn: () => getDashboardStockMovementSummary(),
  });
};

export const useGetDashboardLowStockProducts = () => {
  return useQuery({
    queryKey: ['LowStockProducts'],
    queryFn: getLowStockProducts,
    staleTime: 1000 * 30,
  });
};

export const useGetDashboardTopMovers = (limit?: number, dateFilter?: string) => {
  return useQuery({
    queryKey: ['TopMovers', limit, dateFilter],
    queryFn: () => getTopMovers(limit, dateFilter),
  });
};

export const useGetDashboardStockChart = (range?: string) => {
  return useQuery<ProductStockChart>({
    queryKey: ['GlobalStockChart', range ?? 'all'],
    queryFn: () => getGlobalStockChart(range),
  });
};
