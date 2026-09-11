import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  archiveProduct,
  reactivateProduct,
} from '@/shared/lib/api/product.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateProductQuery } from './invalidateProductQuery';
import { useToastStore } from '@/shared/store/toast';

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['Products'],
    queryFn: getAllProducts,
    staleTime: 1000 * 30,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ['Product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = (onSettled?: () => void) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Produk berhasil dibuat', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal membuat produk', 'error');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};

export const useUpdateProduct = (onSettled?: () => void) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Produk berhasil diperbarui', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal memperbarui produk', 'error');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};

export const useArchiveProduct = (onSettled?: () => void) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: archiveProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Produk berhasil diarsipkan', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal mengarsipkan produk', 'error');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};

export const useReactivateProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: reactivateProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Produk berhasil diaktifkan kembali', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Gagal mengaktifkan kembali produk', 'error');
    },
  });
};
