import type { QueryClient } from '@tanstack/react-query';

export const invalidateInventoryQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['Items'] });
  queryClient.invalidateQueries({ queryKey: ['Dashboard', 'Low Stock'] });
};
