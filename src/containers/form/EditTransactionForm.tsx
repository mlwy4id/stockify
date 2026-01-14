import TransactionForm from '@/components/form/TransactionForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useEditTransactionForm } from '@/hooks/transactions/useEditTransactionForm';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useConfirmUpdateTransaction } from '@/hooks/transactions/useConfirmUpdateTransaction';
import { useCurrentTransaction } from '@/hooks/transactions/useCurrentTransaction';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';
import { useEffect } from 'react';

const EditTransactionForm = () => {
  const { data: inventoryItems } = useGetInventoryItems();

  const { isFetching, transaction } = useCurrentTransaction();
  const { isPending, confirmUpdate } = useConfirmUpdateTransaction(transaction);
  const { register, reset, handleSubmit, errors } = useEditTransactionForm(transaction);

  const { toTransaction } = useTransactionPathNavigation();

  useEffect(() => {
    reset({
      type: transaction?.type,
      quantity: Number(transaction?.quantity),
      itemId: transaction?.item.id,
      previousItemId: transaction?.item.id,
    });
  }, [transaction, reset]);

  if (isFetching) return <Spinner />;

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
