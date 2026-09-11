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
      addToast('Kategori berhasil dibuat', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal membuat kategori', 'error');
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
      addToast('Kategori berhasil dihapus', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal menghapus kategori', 'error');
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
      addToast('Nama kategori berhasil diubah', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal mengubah nama kategori', 'error');
    },
  });
};
