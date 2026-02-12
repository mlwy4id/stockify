import { isoDateFormatter } from '@/lib/formatters/isoDateFormatter';
import type { FiltersParams } from '@/types/params.type';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const useActionFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const action = searchParams.get('action') ?? 'All';
  
  const rawDate = searchParams.get('date') ?? new Date().toISOString().split('T')[0];
  const date = isoDateFormatter(rawDate);

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(location.search);

    if (params.action !== undefined) {
      if (params.action === 'All') {
        newParams.delete('action');
      } else {
        newParams.set('action', params.action);
      }
    }

    if (params.date !== undefined) {
      newParams.set('date', params.date);
    }

    navigate({
      pathname: '/transactions',
      search: `${newParams.toString()}`,
    });
  };

  return { action, date, setFilters };
};
