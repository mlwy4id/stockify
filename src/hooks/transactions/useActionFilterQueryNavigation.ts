import type { FiltersParams } from '@/types/params.type';
import { useLocation, useNavigate } from 'react-router-dom';

export const useActionFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (params: FiltersParams) => {
    const searchParams = new URLSearchParams(location.search);

    if (params.action !== undefined) {
      if (params.action === 'All') {
        searchParams.delete('action');
      } else {
        searchParams.set('action', params.action);
      }
    }

    navigate({
      pathname: '/transactions',
      search: `${searchParams.toString()}`,
    });
  };
};
