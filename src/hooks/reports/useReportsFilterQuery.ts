import type { FiltersParams } from '@/types/params.type';
import { useLocation, useNavigate } from 'react-router-dom';

export const useReportsFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (params: FiltersParams) => {
    const searchParams = new URLSearchParams(location.search);

    if (params.month !== undefined) {
      searchParams.set('month', params.month);
    }

    if (params.year !== undefined) {
      searchParams.set('year', params.year);
    }

    navigate({
      pathname: '/reports',
      search: `${searchParams.toString()}`,
    });
  };
};
