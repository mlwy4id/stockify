import { createItem, getAllItems } from '@/lib/api/inventory.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetInventoryItems = () => {
  return useQuery({
    queryKey: ['Items'],
    queryFn: getAllItems,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Items'],
      });
    },
  });
};
