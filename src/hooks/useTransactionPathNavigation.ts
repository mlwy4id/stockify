import { useNavigate } from 'react-router-dom';

export const useTransactionPathNavigation = () => {
  const navigate = useNavigate();

  return {
    toTransaction: () => navigate('/Transactions'),
    toCreateTransaction: () => navigate('new'),
  };
};
