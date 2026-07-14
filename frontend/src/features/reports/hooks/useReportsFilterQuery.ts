import type { FiltersParams } from '@/shared/types/params.type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useGetCurrentMonthAndYear } from './useGetCurrentMonthAndYear';

export const useReportsFilterQuery = () => {
  const { currentMonthName, currentYear } = useGetCurrentMonthAndYear();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = searchParams.get('month') ?? currentMonthName;
  const year = searchParams.get('year') ?? currentYear;

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.month !== undefined) {
      newParams.set('month', params.month);
    }

    if (params.year !== undefined) {
      newParams.set('year', params.year);
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { month, year, setFilters };
};
