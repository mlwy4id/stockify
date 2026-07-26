import type { FiltersParams } from '@/shared/types/params.type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useStatusFilterQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get('status') ?? 'All';

  const setFilters = (params: FiltersParams) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.status !== undefined) {
      if (params.status === 'All') {
        newParams.delete('status');
      } else {
        newParams.set('status', params.status);
      }
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { status, setFilters };
};
