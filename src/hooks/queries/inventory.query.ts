import { createItem, deleteItem, getAllItems, getItem, updateItem } from '@/lib/api/inventory.api';
import type { Item, UpdateItemRequest } from '@stockify/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInventoryPathNavigation } from '../useInventoryPathNavigation';

type UpdateContext = {
  previousItems?: Item[];
};

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

  return useMutation<unknown, Error, UpdateItemRequest, UpdateContext>({
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
