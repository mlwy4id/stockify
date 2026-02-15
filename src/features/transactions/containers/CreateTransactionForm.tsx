import TransactionForm from '../components/TransactionForm';
import { Button } from '@/shared/components';
import { Spinner } from '@/shared/components';
import { useCreateTransactionForm } from '../hooks/useCreateTransactionForm';
import { useGetInventoryItems } from '@/features/inventory';
import { useConfirmCreateTransaction } from '../hooks/useConfirmCreateTransaction';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';

const CreateTransactionForm = () => {
  const { toTransaction } = useTransactionPathNavigation();

  const { isLoading, data: inventoryItems } = useGetInventoryItems();
  const { isPending, confirmCreate } = useConfirmCreateTransaction();
  const { register, handleSubmit, errors } = useCreateTransactionForm();

  if (isLoading) return <Spinner />;

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
