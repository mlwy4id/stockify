import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UserSignIn } from '@/types/user.type';
import { UserSignInSchema } from '@stockify/schema';

export const useSignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return { register, handleSubmit, errors };
};
