import { createItem, deleteItem, getAllItems, getItem, updateItem } from '@/lib/api/inventory.api';
import type { Item, UpdateItemRequest } from '@/types/inventory';
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
    onMutate: async (newItem) => {
      // optimistic updates
      await queryClient.cancelQueries({ queryKey: ['Items'] });
      const previousItems = queryClient.getQueryData(['Items']);
      queryClient.setQueryData(['Items'], (old: Item[]) => [...old, newItem]);
      toInventory();

      return { previousItems };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['Items'], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Items'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toInventory } = useInventoryPathNavigation();

  return useMutation<unknown, Error, UpdateItemRequest, UpdateContext>({
    mutationFn: updateItem,
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ['Items'] });
      const previousItems = queryClient.getQueryData<Item[]>(['Items']);

      queryClient.setQueryData<Item[]>(['Items'], (old = []) =>
        old.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
      );

      return { previousItems };
    },
    onError: (_err, _updatedItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['Items'], context.previousItems);
      }
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Items'],
      });
    },
    onSettled: () => toInventory(),
  });
};
