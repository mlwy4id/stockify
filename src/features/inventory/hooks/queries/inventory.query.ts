import {
  createItem,
  deleteItem,
  getAllItems,
  getItem,
  updateItem,
} from '@/shared/lib';
import type { UpdateItemRequest } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInventoryPathNavigation } from '../useInventoryPathNavigation';
import { invalidateInventoryQuery } from './invalidateInventoryQuery';

export const useGetInventoryItems = (status?: string) => {
  return useQuery({
    queryKey: ['Items', status],
    queryFn: () => getAllItems(status),
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
    onSuccess: () => {
      invalidateInventoryQuery(queryClient);
    },
    onSettled: () => {
      toInventory();
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation<unknown, Error, UpdateItemRequest>({
    mutationFn: updateItem,
    onSuccess: () => {
      invalidateInventoryQuery(queryClient);
    },
    onSettled: () => {
      toInventory();
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      invalidateInventoryQuery(queryClient);
    },
    onSettled: () => {
      toInventory();
    },
  });
};
