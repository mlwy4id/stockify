import { useParams } from 'react-router-dom';
import { useGetTransaction } from './queries/transactions.query';

export const useCurrentTransaction = () => {
  const { id } = useParams();
  const { isFetching, data: transaction } = useGetTransaction(id);

  return { isFetching, transaction };
};
