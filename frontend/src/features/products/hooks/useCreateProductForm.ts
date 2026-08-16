import { useState } from 'react';
import type { CreateProduct } from '@/shared/types/product.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity must be at least 0'),
  stockThreshold: z.number().min(0, 'Stock threshold must be at least 0'),
  categoryId: z.string().optional(),
});

export const useCreateProductForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProduct>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: '',
      quantity: 0,
      stockThreshold: 0,
      categoryId: undefined,
    },
  });

  return { register, handleSubmit, errors, control, imageFile, setImageFile };
};
