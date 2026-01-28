import { getUser, signIn, signUp } from '@/lib/api/auth.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useGetUser = () => {
  return useQuery({
    queryKey: ['User'],
    queryFn: getUser,
  });
};

export const useSignUpUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate('/');
    },
  });
};

export const useSignInUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate('/');
    },
  });
};
