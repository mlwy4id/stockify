import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UserSignUp } from '@/shared/types';
import { UserSignupSchema } from '@stockify/schema';

export const useSignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignUp>({
    resolver: zodResolver(UserSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  return { register, handleSubmit, errors };
};
