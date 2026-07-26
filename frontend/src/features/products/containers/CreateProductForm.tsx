'use client';
import ProductForm from '../components/ProductForm';
import { Button } from '@/shared/components/ui/button';
import { useProductPathNavigation } from '../hooks/useProductPathNavigation';
import { useConfirmCreateProduct } from '../hooks/useConfirmCreateProduct';
import { useCreateProductForm } from '../hooks/useCreateProductForm';
import { useGetCategories } from '@/features/inventory/unit/hooks/queries/category.query';

const CreateProductForm = () => {
  const { toProducts } = useProductPathNavigation();
  const { confirmCreate, isPending } = useConfirmCreateProduct();
  const { register, handleSubmit, errors, control } = useCreateProductForm();
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) return <p>Loading</p>;

  return (
    <ProductForm
      register={register}
      onSubmitHandler={handleSubmit(confirmCreate)}
      errors={errors}
      control={control}
      cancelHandler={toProducts}
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
