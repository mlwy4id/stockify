import { useCreateCategory } from '@/features/products/unit/hooks/queries/category.query';

export const useConfirmCreateCategory = () => {
  const { mutate, isPending } = useCreateCategory();

  const confirmCreate = (category: { name: string }) => {
    mutate(category);
  };

  return { confirmCreate, isPending };
};
