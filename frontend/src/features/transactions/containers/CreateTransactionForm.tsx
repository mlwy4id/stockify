'use client';
import TransactionForm from '../components/TransactionForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useGetProducts } from '@/features/products/hooks/queries/product.query';
import { useCreateStockMovement } from '../hooks/queries/stock-movement.query';
import { useForm } from 'react-hook-form';
import type { CreateStockMovement } from '@/shared/types/stock-movement.type';
import { format } from 'date-fns';
import { useState } from 'react';

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const CreateTransactionForm = ({ onSuccess, onCancel }: Props) => {
  const { isLoading, data: products } = useGetProducts();
  const { isPending, mutate } = useCreateStockMovement(onSuccess);
  const [selectedProductId, setSelectedProductId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStockMovement>({
    defaultValues: {
      action: undefined,
      quantity: 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      source: '',
      reason: '',
    },
  });

  const onSubmit = (data: CreateStockMovement) => {
    if (!selectedProductId) return;
    mutate({
      productId: selectedProductId,
      movement: {
        ...data,
        date: `${data.date}T00:00:00Z`,
      },
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <TransactionForm
      products={products ?? []}
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(onSubmit)}
      cancelHandler={onCancel ?? (() => {})}
      showProductSelect={true}
      registerProductId={{
        name: 'productId',
        onChange: (e: any) => setSelectedProductId(e.target.value),
        onBlur: () => {},
        ref: () => {},
      }}
      submitBtn={
        <Button disabled={isPending}>
          Add Transaction
        </Button>
      }
    />
  );
};

export default CreateTransactionForm;
