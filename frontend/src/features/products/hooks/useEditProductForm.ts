import { useState } from 'react';
import type { UpdateProduct } from '@/shared/types/product.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const UpdateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  stockThreshold: z.number().min(0, 'Stock threshold must be at least 0').optional(),
  categoryId: z.string().optional(),
});

export const useEditProductForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateProduct>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: '',
      stockThreshold: 0,
      categoryId: undefined,
    },
  });

  return { register, handleSubmit, control, reset, errors, imageFile, setImageFile };
};
