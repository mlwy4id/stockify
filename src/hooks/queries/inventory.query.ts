import { createItem, deleteItem, getAllItems, getItem, updateItem } from '@/lib/api/inventory.api';
import type { UpdateItemRequest } from 'src/types/inventory.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInventoryPathNavigation } from '../useInventoryPathNavigation';

export const useGetInventoryItems = () => {
  return useQuery({
    queryKey: ['Items'],
    queryFn: getAllItems,
    staleTime: 1000 * 30,
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Items'] });
      toInventory();
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation<unknown, Error, UpdateItemRequest>({
    mutationFn: updateItem,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Items'] });
      toInventory();
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation({
    mutationFn: deleteItem,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Items'] });
      toInventory();
    },
  });
};
