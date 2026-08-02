import {
  useGetGlobalStockMovementSummary,
  useGetTopMovers,
} from '@/features/transactions/hooks/queries/stock-movement.query';
import { useGetLowStockProducts } from '@/features/products/hooks/queries/product.query';

export const useGetDashboardSummary = (dateFilter?: string) => {
  return useGetGlobalStockMovementSummary(dateFilter);
};

export const useGetDashboardLowStockProducts = () => {
  return useGetLowStockProducts();
};

export const useGetDashboardTopMovers = (limit?: number, dateFilter?: string) => {
  return useGetTopMovers(limit, dateFilter);
};
