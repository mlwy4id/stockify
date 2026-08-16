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
  const { register, handleSubmit, errors, control, imageFile, setImageFile } = useCreateProductForm();
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) return <p>Loading</p>;

  const onSubmit = handleSubmit((values) => confirmCreate(values, imageFile));

  return (
    <ProductForm
      register={register}
      onSubmitHandler={onSubmit}
      errors={errors}
      control={control}
      cancelHandler={onCancel ?? (() => {})}
      categoryList={categories ?? []}
      imageFile={imageFile}
      onImageChange={setImageFile}
      submitBtn={
        <Button disabled={isPending}>
          Add Product
        </Button>
      }
    />
  );
};

export default CreateProductForm;
