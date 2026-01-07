import TransactionForm from '@/components/form/TransactionForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCreateTransactionForm } from '@/hooks/form/useCreateTransactionForm';
import { useGetInventoryItems } from '@/hooks/queries/inventory.query';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const CreateTransactionForm = () => {
  const { toTransaction } = useTransactionPathNavigation();
  const { isFetching, data: inventoryItems } = useGetInventoryItems();
  const { register, handleSubmit, errors } = useCreateTransactionForm();

  const confirmCreate = () => {
    console.log(1);
  };

  if (isFetching) return <Spinner />;

  return (
    <TransactionForm
      inventoryItems={inventoryItems}
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(confirmCreate)}
      cancelHandler={toTransaction}
      submitBtn={<Button className="bg-blue-600 hover:bg-blue-500">Add Item</Button>}
    />
  );
};

export default CreateTransactionForm;
