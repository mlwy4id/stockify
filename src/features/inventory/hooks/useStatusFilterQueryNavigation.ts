import type { FiltersParams } from '@/shared/types';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const useStatusFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status') ?? 'All';

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(location.search);

    if (params.status !== undefined) {
      if (params.status === 'All') {
        newParams.delete('status');
      } else {
        newParams.set('status', params.status);
      }
    }

    navigate({
      pathname: '/inventory',
      search: `${newParams.toString()}`,
    });
  };

  return { status, setFilters };
};
