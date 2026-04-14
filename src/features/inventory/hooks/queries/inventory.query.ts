import { createItem, deleteItem, getAllItems, getItem, updateItem } from '@/shared/lib';
import type { UpdateItemRequest } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInventoryPathNavigation } from '../useInventoryPathNavigation';
import { invalidateInventoryQuery } from './invalidateInventoryQuery';
import { useToastStore } from '@/store/toast';

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
  const { addToast } = useToastStore();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      invalidateInventoryQuery(queryClient);
      addToast('Item created successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to create item', 'error');
    },
    onSettled: () => {
      toInventory();
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation<unknown, Error, UpdateItemRequest>({
    mutationFn: updateItem,
    onSuccess: () => {
      invalidateInventoryQuery(queryClient);
      addToast('Item updated successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to update item', 'error');
    },
    onSettled: () => {
      toInventory();
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      invalidateInventoryQuery(queryClient);
      addToast('Item deleted successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to delete item', 'error');
    },
    onSettled: () => {
      toInventory();
    },
  });
};
