import { CreateItemSchema } from '@/schemas/inventorySchema';
import type { CreateItem } from '@/types/inventory';
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
      quantity: 0,
    },
  });

  return { register, handleSubmit, errors };
};
