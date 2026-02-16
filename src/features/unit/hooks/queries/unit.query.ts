import { getUnits } from '@/shared/lib/api/unit.api';
import { useQuery } from '@tanstack/react-query';

export const useGetUnits = () => {
  return useQuery({
    queryKey: ['Unit'],
    queryFn: getUnits,
    staleTime: 100 * 30,
  });
};
