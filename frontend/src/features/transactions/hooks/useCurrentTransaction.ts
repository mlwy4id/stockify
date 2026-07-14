import { useParams } from 'next/navigation';
import { useGetTransaction } from './queries/transactions.query';

export const useCurrentTransaction = () => {
  const params = useParams<{ id: string }>();
  const { isLoading, data: transaction } = useGetTransaction(params?.id);

  return { isLoading, transaction };
};
