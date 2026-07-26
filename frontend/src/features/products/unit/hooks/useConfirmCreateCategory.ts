import { useCreateCategory } from '@/features/inventory/unit/hooks/queries/category.query';

export const useConfirmCreateCategory = () => {
  const { mutate, isPending } = useCreateCategory();

  const confirmCreate = (category: { name: string }) => {
    mutate(category);
  };

  return { confirmCreate, isPending };
};
