import {
  getAllCategories,
  createCategory,
  deleteCategory,
  renameCategory,
} from '@/shared/lib/api/category.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@/shared/types/category.type';
import { useToastStore } from '@/shared/store/toast';

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['Categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 30,
  });
};

export const useCreateCategory = (onSettled?: () => void) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'] });
      addToast('Category created successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to create category', 'error');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'] });
      queryClient.invalidateQueries({ queryKey: ['Products'] });
      addToast('Category deleted successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to delete category', 'error');
    },
  });
};

export const useRenameCategory = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: renameCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'] });
      addToast('Category renamed successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to rename category', 'error');
    },
  });
};
