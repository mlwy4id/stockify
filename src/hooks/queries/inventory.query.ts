import { createItem, deleteItem, getAllItems, getItem, updateItem } from '@/lib/api/inventory.api';
import type { UpdateItemRequest } from '@/types/inventory';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInventoryPathNavigation } from '../useInventoryPathNavigation';

export const useGetInventoryItems = () => {
  return useQuery({
    queryKey: ['Items'],
    queryFn: getAllItems,
  });
};

export const useGetItem = (id?: string) => {
  return useQuery({
    queryKey: ['Item', id],
    queryFn: () => getItem(id),
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Items'],
      });
    },
    onSettled: () => toInventory(),
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation<unknown, Error, UpdateItemRequest>({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Items'],
      });
    },
    onSettled: () => toInventory(),
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Items'],
      });
    },
    onSettled: () => toInventory(),
  });
};
