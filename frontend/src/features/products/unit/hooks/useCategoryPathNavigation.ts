import { useRouter } from 'next/navigation';

export const useCategoryPathNavigation = () => {
  const router = useRouter();

  return {
    toCreateCategory: () => router.push('/inventory/unit/add'),
  };
};
