import { useNavigate } from 'react-router-dom';

export const useInventoryPathNavigation = () => {
  const navigate = useNavigate();

  return {
    toInventory: () => navigate('/inventory'),
    toCreateItem: () => navigate('new'),
    toEditItem: (id: string) => navigate(`${id}/edit`),
    toDeleteItem: (id: string) => navigate(`${id}/delete`),
  };
};
