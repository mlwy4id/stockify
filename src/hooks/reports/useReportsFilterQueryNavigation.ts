import { useNavigate } from 'react-router-dom';

export const useReportsFilterQueryNavigation = () => {
  const navigate = useNavigate();

  return (params: string) =>
    navigate({
      pathname: '/reports',
      search: `?month=${params}`,
    });
};
