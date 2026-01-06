import { UpdateItemSchema } from '@stockify/schema';
import type { Item, UpdateItem } from '@stockify/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useEditItemForm = (item: Item) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateItem>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      name: item?.name,
      initQuantity: Number(item?.currentQuantity),
    },
  });

  return { register, handleSubmit, reset, errors };
};
