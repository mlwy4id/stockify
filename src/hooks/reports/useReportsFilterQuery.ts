import type { FiltersParams } from '@/types/params.type';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCurrentMonthAndYear } from './useGetCurrentMonthAndYear';

export const useReportsFilterQuery = () => {
  const { currentMonthName, currentYear } = useGetCurrentMonthAndYear();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const month = searchParams.get('month') ?? currentMonthName;
  const year = searchParams.get('year') ?? currentYear;

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(location.search);

    if (params.month !== undefined) {
      newParams.set('month', params.month);
    }

    if (params.year !== undefined) {
      newParams.set('year', params.year);
    }

    navigate({
      pathname: '/reports',
      search: `${newParams.toString()}`,
    });
  };

  return { month, year, setFilters };
};
