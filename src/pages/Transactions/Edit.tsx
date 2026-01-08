import Modal from '@/components/modal/Modal';
import EditTransactionForm from '@/containers/form/EditTransactionForm';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const EditTransactionPage = () => {
  const { toTransaction } = useTransactionPathNavigation();

  return (
    <Modal title="Edit Transaction" closeModal={toTransaction}>
      <EditTransactionForm />
    </Modal>
  );
};

export default EditTransactionPage;
