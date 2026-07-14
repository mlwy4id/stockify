import { UpdateItemSchema } from '@stockify/schema';
import type { UpdateItem } from '@/shared/types/inventory.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useEditItemForm = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateItem>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      name: '',
      initStock: 0,
      unitId: '',
    },
  });

  return { register, handleSubmit, control, reset, errors };
};
