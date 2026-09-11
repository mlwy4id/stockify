import { getUser, signIn, signUp, signOut } from '@/shared/lib/api/auth.api';
import { useToastStore } from '@/shared/store/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useGetUser = () => {
  return useQuery({
    queryKey: ['User'],
    queryFn: getUser,
    retry: 1,
  });
};

export const useSignUpUser = () => {
  const { addToast } = useToastStore();
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      addToast('Pendaftaran berhasil!', 'success');
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
    onSuccess: (data) => {
      queryClient.setQueryData(['User'], { user: data.user });
      addToast('Masuk berhasil!', 'success');
      router.push('/dashboard');
    },
  });
};

export const useSignOutUser = () => {
  const { addToast } = useToastStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
      addToast('Berhasil keluar!', 'success');
      router.push('/sign-in');
    },
  });
};
