import { CreateUnitSchema } from '@stockify/schema';
import type { CreateUnit } from '@/shared/types/unit.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useCreateUnitForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUnit>({
    resolver: zodResolver(CreateUnitSchema),
    defaultValues: {
      name: '',
      symbol: '',
    },
  });

  return { register, handleSubmit, errors };
};
