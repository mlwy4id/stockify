import { createItem, getAllItems, getItem, updateItem } from '@/lib/api/inventory.api';
import type { UpdateItemRequest } from '@/types/inventory';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetInventoryItems = () => {
  return useQuery({
    queryKey: ['Items'],
    queryFn: getAllItems,
  });
};

export const useGetItem = (id?: string) => {
  return useQuery({
    queryKey: ['Item'],
    queryFn: () => getItem(id),
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

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateItemRequest>({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Items'],
      });
    },
  });
};
