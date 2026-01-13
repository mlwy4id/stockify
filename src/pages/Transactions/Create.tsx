import Modal from '@/components/modal/Modal';
import CreateTransactionForm from '@/containers/form/CreateTransactionForm';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';

const CreateTransactionPage = () => {
  const { toTransaction } = useTransactionPathNavigation();

  return (
    <Modal title="Create Transaction" closeModal={toTransaction}>
      <CreateTransactionForm />
    </Modal>
  );
};

export default CreateTransactionPage;
