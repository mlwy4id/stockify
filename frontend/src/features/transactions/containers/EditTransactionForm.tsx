'use client';
import TransactionForm from '../components/TransactionForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useEditTransactionForm } from '../hooks/useEditTransactionForm';
import { useGetInventoryItems } from '@/features/inventory/hooks/queries/inventory.query';
import { useConfirmUpdateTransaction } from '../hooks/useConfirmUpdateTransaction';
import { useCurrentTransaction } from '../hooks/useCurrentTransaction';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';
import { useEffect } from 'react';

const EditTransactionForm = () => {
  const { data: inventoryItems } = useGetInventoryItems();

  const { isLoading, transaction } = useCurrentTransaction();
  const { isPending, confirmUpdate } = useConfirmUpdateTransaction(transaction);
  const { register, reset, handleSubmit, errors } = useEditTransactionForm(transaction);

  const { toTransaction } = useTransactionPathNavigation();

  useEffect(() => {
    reset({
      action: transaction?.action,
      quantity: Number(transaction?.quantity),
      itemId: transaction?.item.id,
      previousItemId: transaction?.item.id,
    });
  }, [transaction, reset]);

  if (isLoading) return <Spinner />;

  return (
    <TransactionForm
      inventoryItems={inventoryItems}
      register={register}
      onSubmitHandler={handleSubmit(confirmUpdate)}
      errors={errors}
      cancelHandler={toTransaction}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Update Transaction
        </Button>
      }
    />
  );
};

export default EditTransactionForm;
