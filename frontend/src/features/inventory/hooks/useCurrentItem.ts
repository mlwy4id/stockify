import { useParams } from 'next/navigation';
import { useGetItem } from './queries/inventory.query';

export const useCurrentItem = () => {
  const params = useParams<{ id: string }>();
  const { isLoading, data: item } = useGetItem(params?.id);

  return { isLoading, item };
};
