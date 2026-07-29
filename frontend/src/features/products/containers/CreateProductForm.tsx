'use client';
import ProductForm from '../components/ProductForm';
import { Button } from '@/shared/components/ui/button';
import { useConfirmCreateProduct } from '../hooks/useConfirmCreateProduct';
import { useCreateProductForm } from '../hooks/useCreateProductForm';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const CreateProductForm = ({ onSuccess, onCancel }: Props) => {
  const { confirmCreate, isPending } = useConfirmCreateProduct(onSuccess);
  const { register, handleSubmit, errors, control } = useCreateProductForm();
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) return <p>Loading</p>;

  return (
    <ProductForm
      register={register}
      onSubmitHandler={handleSubmit(confirmCreate)}
      errors={errors}
      control={control}
      cancelHandler={onCancel ?? (() => {})}
      categoryList={categories}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Add Product
        </Button>
      }
    />
  );
};

export default CreateProductForm;
