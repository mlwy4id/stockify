import { useParams } from 'react-router-dom';
import { useGetTransaction } from '../queries/transactions.query';

export const useCurrentTransaction = () => {
  const { id } = useParams();
  const { isLoading, data: transaction } = useGetTransaction(id);

  return { isLoading, transaction };
};
