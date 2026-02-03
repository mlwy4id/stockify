import { useGetUser } from '@/hooks/queries/auth.query';
import { Spinner } from './ui/spinner';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  const { isLoading, data } = useGetUser();

  if (isLoading)
    return (
      <div className="w-full h-screen overflow-hidden flex justify-center items-center">
        <Spinner className="w-96" />
      </div>
    );

  return data === null ? <Navigate to="/sign-in" /> : <Outlet />;
};
