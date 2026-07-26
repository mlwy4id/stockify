'use client';
import CategoryForm from '@/features/inventory/unit/components/CategoryForm';
import { useConfirmCreateCategory } from '@/features/inventory/unit/hooks/useConfirmCreateCategory';
import { useCreateCategoryForm } from '@/features/inventory/unit/hooks/useCreateCategoryForm';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

const CreateCategoryForm = () => {
  const { register, handleSubmit, errors } = useCreateCategoryForm();
  const { confirmCreate, isPending } = useConfirmCreateCategory();
  const router = useRouter();

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
      cancelHandler={() => router.back()}
    />
  );
};

export default CreateCategoryForm;
