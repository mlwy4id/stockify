import Modal from '@/components/modal/Modal';
import ConfirmDeleteTransactionModal from '@/containers/modal/ConfirmDeleteTransactionModal';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const DeleteTransactionPage = () => {
  const { toTransaction } = useTransactionPathNavigation();

  return (
    <Modal title="Delete transaction?" closeModal={toTransaction}>
      <ConfirmDeleteTransactionModal />
    </Modal>
  );
};

export default DeleteTransactionPage;
