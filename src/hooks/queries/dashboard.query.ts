import {
  getDashboardItemSummary,
  getDashboardLowStockItem,
  getDashboardRecentActivity,
} from '@/lib/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useGetItemSummary = () => {
  return useQuery({
    queryFn: getDashboardItemSummary,
    queryKey: ['Dashboard', 'Item Summary'],
    staleTime: 1000 * 60,
  });
};

export const useGetLowStockItem = () => {
  return useQuery({
    queryFn: getDashboardLowStockItem,
    queryKey: ['Dashboard', 'Low Stock'],
    staleTime: 1000 * 60,
  });
};

export const useGetRecentActivity = () => {
  return useQuery({
    queryFn: getDashboardRecentActivity,
    queryKey: ['Dashboard', 'Recent Activity'],
    staleTime: 1000 * 60,
  });
};
