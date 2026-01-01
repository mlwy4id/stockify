import { useParams } from 'react-router-dom';
import { useGetItem } from './queries/inventory.query';

export const useCurrentItem = () => {
  const { id } = useParams();
  const { isFetching, data: item } = useGetItem(id);

  return {  isFetching, item };
};
