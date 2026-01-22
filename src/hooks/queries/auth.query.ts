import { getUser, signIn, signUp } from '@/lib/api/auth.api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetUser = () => {
  return useQuery({
    queryKey: ['User'],
    queryFn: getUser,
  });
};

export const useSignUpUser = () => {
  return useMutation({
    mutationFn: signUp,
  });
};

export const useSignInUser = () => {
  return useMutation({
    mutationFn: signIn,
  });
};
