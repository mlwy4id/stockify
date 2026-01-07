import TransactionForm from '@/components/form/TransactionForm';
import { Button } from '@/components/ui/button';
import { useCreateTransactionForm } from '@/hooks/form/useCreateTransactionForm';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const CreateTransactionForm = () => {
  const { toTransaction } = useTransactionPathNavigation();
  const { register, handleSubmit, errors } = useCreateTransactionForm();

  const confirmCreate = () => {
    console.log(1);
  };

  return (
    <TransactionForm
      register={register}
      errors={errors}
      onSubmitHandler={handleSubmit(confirmCreate)}
      cancelHandler={toTransaction}
      submitBtn={<Button className="bg-blue-600 hover:bg-blue-500">Add Item</Button>}
    />
  );
};

export default CreateTransactionForm;
