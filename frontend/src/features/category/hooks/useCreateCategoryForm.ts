import type { CreateCategory } from '@/shared/types/category.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
});

export const useCreateCategoryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  return { register, handleSubmit, errors };
};
