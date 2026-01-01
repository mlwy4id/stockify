import { UpdateItemSchema } from '@/schemas/inventorySchema';
import type { Item, UpdateItem } from '@/types/inventory';
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
      quantity: Number(item?.quantity),
    },
  });

  return { register, handleSubmit, reset, errors };
};
