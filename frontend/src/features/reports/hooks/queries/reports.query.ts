import { getReportsData } from '@/shared/lib/api/reports.api';
import { useQuery } from '@tanstack/react-query';

export const useGetReportsData = (month?: string, year?: string) => {
  return useQuery({
    queryKey: ['ReportsData', month, year],
    queryFn: () => getReportsData(month, year),
  });
};
