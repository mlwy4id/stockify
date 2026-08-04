'use client';
import ProductForm from '../components/ProductForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useEditProductForm } from '../hooks/useEditProductForm';
import { useConfirmUpdateProduct } from '../hooks/useConfirmUpdateProduct';
import { useCurrentProduct } from '../hooks/useCurrentProduct';
import { useEffect } from 'react';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';

type Props = {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const EditProductForm = ({ productId, onSuccess, onCancel }: Props) => {
  const { isLoading: categoryLoading, data: categories } = useGetCategories();
  const { isLoading: productLoading, product } = useCurrentProduct(productId);
  const { confirmUpdate, isPending } = useConfirmUpdateProduct(product, onSuccess);
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
      cancelHandler={onCancel ?? (() => {})}
      categoryList={categories ?? []}
      submitBtn={
        <Button disabled={isPending}>
          Update Product
        </Button>
      }
    />
  );
};

export default EditProductForm;
