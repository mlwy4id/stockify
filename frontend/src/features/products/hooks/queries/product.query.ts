import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  archiveProduct,
  reactivateProduct,
} from '@/shared/lib/api/product.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProductPathNavigation } from '../useProductPathNavigation';
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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toProducts } = useProductPathNavigation();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Product created successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to create product', 'error');
    },
    onSettled: () => {
      toProducts();
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toProducts } = useProductPathNavigation();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Product updated successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to update product', 'error');
    },
    onSettled: () => {
      toProducts();
    },
  });
};

export const useArchiveProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toProducts } = useProductPathNavigation();

  return useMutation({
    mutationFn: archiveProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Product archived successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to archive product', 'error');
    },
    onSettled: () => {
      toProducts();
    },
  });
};

export const useReactivateProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toProducts } = useProductPathNavigation();

  return useMutation({
    mutationFn: reactivateProduct,
    onSuccess: () => {
      invalidateProductQuery(queryClient);
      addToast('Product reactivated successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to reactivate product', 'error');
    },
    onSettled: () => {
      toProducts();
    },
  });
};
