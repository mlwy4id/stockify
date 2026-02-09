import type { FiltersParams } from '@/types/params.type';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const useActionFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const action = searchParams.get('action') ?? 'All';

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(location.search);

    if (params.action !== undefined) {
      if (params.action === 'All') {
        newParams.delete('action');
      } else {
        newParams.set('action', params.action);
      }
    }

    navigate({
      pathname: '/transactions',
      search: `${newParams.toString()}`,
    });
  };

  return { action, setFilters };
};
