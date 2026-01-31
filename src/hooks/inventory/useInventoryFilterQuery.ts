import type { FiltersParams } from '@/types/params.type';
import { useLocation, useNavigate } from 'react-router-dom';

export const useInventoryFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (params: FiltersParams) => {
    const searchParams = new URLSearchParams(location.search);

    if (params.status !== undefined) {
      if (params.status === 'All') {
        searchParams.delete('status');
      } else {
        searchParams.set('status', params.status);
      }
    }

    navigate({
      pathname: '/inventory',
      search: `${searchParams.toString()}`,
    });
  };
};
