import type { Category } from '@/shared/types/category.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const RenameCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const useRenameCategoryForm = (category: Category | undefined) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: zodResolver(RenameCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
    },
  });

  return { register, handleSubmit, errors };
};
