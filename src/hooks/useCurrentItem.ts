import useModalStore from '@/store/useModalStore';
import { useFindItem } from './useFindItem';

export const useCurrentItem = () => {
  const payload = useModalStore((state) => state.payload);
  const item = useFindItem(payload?.itemId);

  return { item };
};
