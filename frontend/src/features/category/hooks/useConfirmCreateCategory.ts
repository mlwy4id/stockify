import { useCreateCategory } from '@/features/category/hooks/queries/category.query';

export const useConfirmCreateCategory = (onSuccess?: () => void) => {
  const { mutate, isPending } = useCreateCategory(onSuccess);

  const confirmCreate = (category: { name: string }) => {
    mutate(category);
  };

  return { confirmCreate, isPending };
};
