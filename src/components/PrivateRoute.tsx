import { useGetUser } from '@/hooks/queries/auth.query';
import { Spinner } from './ui/spinner';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  const { isLoading, data } = useGetUser();

  if (isLoading) return <Spinner />;

  return data === null ? <Navigate to="/sign-in" /> : <Outlet />;
};
