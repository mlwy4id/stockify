import { useRouter } from 'next/navigation';

export const useUnitPathNavigation = () => {
  const router = useRouter();

  return {
    toCreateUnit: () => router.push('/inventory/unit/add'),
  };
};
