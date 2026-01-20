import { useLocation, useNavigate } from 'react-router-dom';

export const useReportsFilterQueryNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (params: { month?: string; year?: number }) => {
    const searchParams = new URLSearchParams(location.search);

    if (params.month !== undefined) {
      searchParams.set('month', params.month);
    }

    if (params.year !== undefined) {
      searchParams.set('year', String(params.year));
    }

    navigate({
      pathname: '/reports',
      search: `${searchParams.toString()}`,
    });
  };
};
