import { CreateItemSchema } from '@stockify/schema';
import type { CreateItem } from '@/shared/types/inventory.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useCreateItemForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateItem>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      name: '',
      initStock: 0,
      unitId: '',
    },
  });

  return { register, handleSubmit, errors, control };
};
