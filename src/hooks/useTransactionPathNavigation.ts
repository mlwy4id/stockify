import { useNavigate } from 'react-router-dom';

export const useTransactionPathNavigation = () => {
  const navigate = useNavigate();

  return {
    toTransaction: () => navigate('/Transactions'),
    toCreateTransaction: () => navigate('new'),
    toEditTransaction: (id: string) => navigate(`${id}/edit`),
    toDeleteTransaction: (id: string) => navigate(`${id}/delete`),
  };
};
