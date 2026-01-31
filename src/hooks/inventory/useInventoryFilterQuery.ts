import { useLocation, useNavigate } from 'react-router-dom';

export const useInventoryFilterQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (params: { status?: string }) => {
    const searchParams = new URLSearchParams(location.search);

    if (params.status !== undefined) {
      searchParams.set('status', params.status);
    }

    navigate({
      pathname: '/inventory',
      search: `${searchParams.toString()}`,
    });
  };
};
