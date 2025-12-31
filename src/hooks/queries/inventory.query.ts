import { getAllItems } from '@/lib/api/inventory.api';
import { useQuery } from '@tanstack/react-query';

export const useGetInventoryItems = () => {
  return useQuery({
    queryKey: ['Items'],
    queryFn: getAllItems,
  });
};
