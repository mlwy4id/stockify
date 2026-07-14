import { dateFormatter } from '@/shared/lib/formatters/dateFormatter';
import { isoDateFormatter } from '@/shared/lib/formatters/isoDateFormatter';
import type { FiltersParams } from '@/shared/types/params.type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useActionFilterQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const action = searchParams.get('action') ?? 'All';

  const rawDate = searchParams.get('date') ?? new Date().toISOString().split('T')[0];
  const date = isoDateFormatter(rawDate);
  const displayedDate = dateFormatter(new Date(date));

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(searchParams.toString());

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

    if (params.page !== undefined) {
      newParams.set('page', String(params.page));
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { action, displayedDate, date, page, setFilters };
};
