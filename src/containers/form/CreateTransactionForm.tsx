import TransactionForm from '@/components/form/TransactionForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCreateTransactionForm } from '@/hooks/transactions/useCreateTransactionForm';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useConfirmCreateTransaction } from '@/hooks/transactions/useConfirmCreateTransaction';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';

const CreateTransactionForm = () => {
  const { toTransaction } = useTransactionPathNavigation();

  const { isFetching, data: inventoryItems } = useGetInventoryItems();
  const { isPending, confirmCreate } = useConfirmCreateTransaction();
  const { register, handleSubmit, errors } = useCreateTransactionForm();

  if (isFetching) return <Spinner />;

  return (
    <TransactionForm
      inventoryItems={inventoryItems}
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(confirmCreate)}
      cancelHandler={toTransaction}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Add Transaction
        </Button>
      }
    />
  );
};

export default CreateTransactionForm;
