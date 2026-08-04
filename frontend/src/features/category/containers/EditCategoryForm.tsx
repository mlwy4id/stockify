'use client';
import CategoryForm from '@/features/category/components/CategoryForm';
import { useRenameCategoryForm } from '@/features/category/hooks/useRenameCategoryForm';
import { useRenameCategory } from '@/features/category/hooks/queries/category.query';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';

type Props = {
  categoryId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const EditCategoryForm = ({ categoryId, onSuccess, onCancel }: Props) => {
  const { isLoading, data: categories } = useGetCategories();
  const category = categories?.find((c) => c.id === categoryId);
  const { register, handleSubmit, errors } = useRenameCategoryForm(category);
  const { mutate, isPending } = useRenameCategory();

  if (isLoading) return <Spinner />;

  const confirmRename = (data: { name: string }) => {
    mutate(
      { id: categoryId, name: data.name },
      { onSuccess: () => onSuccess?.() }
    );
  };

  return (
    <CategoryForm
      onSubmitHandler={handleSubmit(confirmRename)}
      register={register}
      errors={errors}
      submitBtn={
        <Button disabled={isPending}>
          Save
        </Button>
      }
      cancelHandler={onCancel ?? (() => {})}
    />
  );
};

export default EditCategoryForm;
