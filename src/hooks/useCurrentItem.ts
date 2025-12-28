import { useParams } from 'react-router-dom';
import { useFindItem } from './useFindItem';

export const useCurrentItem = () => {
  const { id } = useParams();
  const item = useFindItem(id);

  return { item };
};
