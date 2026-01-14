import { getDashboardSummary } from '@/lib/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export const useGetStocksSummary = () => {
  return useQuery({
    queryFn: getDashboardSummary,
    queryKey: ['dashboard'],
    staleTime: 1000 * 30,
  });
};
