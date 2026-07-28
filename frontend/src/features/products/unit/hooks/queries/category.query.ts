import {
  getAllCategories,
  createCategory,
  deleteCategory,
  renameCategory,
} from '@/shared/lib/api/category.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@/shared/store/toast';
import { useProductPathNavigation } from '@/features/products/hooks/useProductPathNavigation';

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['Categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 30,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toProducts } = useProductPathNavigation();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'] });
      addToast('Category created successfully', 'success');
      toProducts();
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to create category', 'error');
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
