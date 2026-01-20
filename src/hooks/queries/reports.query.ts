import { getReportsData } from '@/lib/api/reports.api';
import { useQuery } from '@tanstack/react-query';

export const useGetReportsData = (month?: string) => {
  return useQuery({
    queryKey: ['ReportsData', month],
    queryFn: () => getReportsData(month),
  });
};
