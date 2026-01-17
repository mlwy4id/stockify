import { CreateItemSchema } from '@stockify/schema';
import type { CreateItem } from 'src/types/inventory.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useCreateItemForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItem>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      name: '',
      initStock: 0,
    },
  });

  return { register, handleSubmit, errors };
};
