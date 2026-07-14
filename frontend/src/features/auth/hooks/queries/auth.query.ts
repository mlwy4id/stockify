import { getUser, signIn, signUp } from '@/shared/lib/api/auth.api';
import { useToastStore } from '@/shared/store/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useGetUser = () => {
  return useQuery({
    queryKey: ['User'],
    queryFn: getUser,
    retry: false,
  });
};

export const useSignUpUser = () => {
  const { addToast } = useToastStore();
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      addToast('Sign up success!', 'success');
      router.push('/dashboard');
    },
  });
};

export const useSignInUser = () => {
  const { addToast } = useToastStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['User'] });
      addToast('Sign in success!', 'success');
      router.push('/dashboard');
    },
  });
};
