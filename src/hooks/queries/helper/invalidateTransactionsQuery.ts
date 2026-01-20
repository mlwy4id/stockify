import type { QueryClient } from '@tanstack/react-query';

export const invalidateTransactionsQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['Transactions'] });
  queryClient.invalidateQueries({ queryKey: ['Items'] });
  queryClient.invalidateQueries({ queryKey: ['Dashboard', 'Recent Activity'] });
  queryClient.invalidateQueries({ queryKey: ['Dashboard', 'Item Summary'] });
};
