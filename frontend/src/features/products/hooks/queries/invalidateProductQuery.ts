import type { QueryClient } from '@tanstack/react-query';

export const invalidateProductQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['Products'] });
  queryClient.invalidateQueries({ queryKey: ['LowStockProducts'] });
};
