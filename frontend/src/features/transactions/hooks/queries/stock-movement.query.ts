import {
  createStockMovement,
  getStockMovementsByProduct,
  getStockMovementSummaryByProduct,
  getGlobalStockMovementSummary,
  getTopMovers,
} from '@/shared/lib/api/stock-movement.api';
import type { CreateStockMovement } from '@/shared/types/stock-movement.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@/shared/store/toast';

export const useGetStockMovementsByProduct = (productId: string) => {
  return useQuery({
    queryKey: ['StockMovements', productId],
    queryFn: () => getStockMovementsByProduct(productId),
    enabled: !!productId,
  });
};

export const useGetStockMovementSummaryByProduct = (productId: string, dateFilter?: string) => {
  return useQuery({
    queryKey: ['StockMovementSummary', productId, dateFilter],
    queryFn: () => getStockMovementSummaryByProduct(productId, dateFilter),
    enabled: !!productId,
  });
};

export const useGetGlobalStockMovementSummary = (dateFilter?: string) => {
  return useQuery({
    queryKey: ['GlobalStockMovementSummary', dateFilter],
    queryFn: () => getGlobalStockMovementSummary(dateFilter),
  });
};

export const useGetTopMovers = (limit?: number, dateFilter?: string) => {
  return useQuery({
    queryKey: ['TopMovers', limit, dateFilter],
    queryFn: () => getTopMovers(limit, dateFilter),
  });
};

export const useCreateStockMovement = (onSettled?: () => void) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: ({ productId, movement }: { productId: string; movement: CreateStockMovement }) =>
      createStockMovement(productId, movement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['StockMovements'] });
      queryClient.invalidateQueries({ queryKey: ['GlobalStockMovementSummary'] });
      queryClient.invalidateQueries({ queryKey: ['TopMovers'] });
      queryClient.invalidateQueries({ queryKey: ['Products'] });
      queryClient.invalidateQueries({ queryKey: ['Dashboard'] });
      addToast('Stock movement created successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to create stock movement', 'error');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};
