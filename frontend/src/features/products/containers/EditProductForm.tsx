'use client';
import ProductForm from '../components/ProductForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useEditProductForm } from '../hooks/useEditProductForm';
import { useConfirmUpdateProduct } from '../hooks/useConfirmUpdateProduct';
import { useCurrentProduct } from '../hooks/useCurrentProduct';
import { useProductPathNavigation } from '../hooks/useProductPathNavigation';
import { useEffect } from 'react';
import { useGetCategories } from '@/features/inventory/unit/hooks/queries/category.query';

const EditProductForm = () => {
  const { isLoading: categoryLoading, data: categories } = useGetCategories();
  const { isLoading: productLoading, product } = useCurrentProduct();
  const { toProducts } = useProductPathNavigation();
  const { confirmUpdate, isPending } = useConfirmUpdateProduct(product);
  const { register, handleSubmit, errors, control, reset } = useEditProductForm();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        stockThreshold: 0,
        categoryId: product.categoryId ?? undefined,
      });
    }
  }, [product, reset]);

  if (categoryLoading || productLoading) return <Spinner />;

  return (
    <ProductForm
      register={register}
      onSubmitHandler={handleSubmit(confirmUpdate)}
      errors={errors}
      control={control}
      cancelHandler={toProducts}
      categoryList={categories}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Update Product
        </Button>
      }
    />
  );
};

export default EditProductForm;
