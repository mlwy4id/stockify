import { Modal } from '@/shared/components';
import EditTransactionForm from '../containers/EditTransactionForm';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';

const EditTransactionPage = () => {
  const { toTransaction } = useTransactionPathNavigation();

  return (
    <Modal title="Edit Transaction" closeModal={toTransaction}>
      <EditTransactionForm />
    </Modal>
  );
};

export default EditTransactionPage;
