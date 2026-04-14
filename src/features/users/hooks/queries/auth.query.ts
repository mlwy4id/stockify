import { getUser, signIn, signUp } from '@/shared/lib';
import { useToastStore } from '@/store/toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useGetUser = () => {
  return useQuery({
    queryKey: ['User'],
    queryFn: getUser,
  });
};

export const useSignUpUser = () => {
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      addToast('Sign up success!', 'success');
      navigate('/dashboard');
    },
  });
};

export const useSignInUser = () => {
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      addToast('Sign in success!', 'success');
      navigate('/dashboard');
    },
  });
};
