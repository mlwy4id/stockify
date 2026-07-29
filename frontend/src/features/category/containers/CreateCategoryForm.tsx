'use client';
import CategoryForm from '@/features/category/components/CategoryForm';
import { useConfirmCreateCategory } from '@/features/category/hooks/useConfirmCreateCategory';
import { useCreateCategoryForm } from '@/features/category/hooks/useCreateCategoryForm';
import { Button } from '@/shared/components/ui/button';

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const CreateCategoryForm = ({ onSuccess, onCancel }: Props) => {
  const { register, handleSubmit, errors } = useCreateCategoryForm();
  const { confirmCreate, isPending } = useConfirmCreateCategory(onSuccess);

  return (
    <CategoryForm
      onSubmitHandler={handleSubmit(confirmCreate)}
      register={register}
      errors={errors}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Add Category
        </Button>
      }
      cancelHandler={onCancel ?? (() => {})}
    />
  );
};

export default CreateCategoryForm;
