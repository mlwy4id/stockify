'use client';
import Modal from '@/shared/components/modal/Modal';
import ConfirmDeleteTransactionModal from '../containers/ConfirmDeleteTransactionModal';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';

const DeleteTransactionPage = () => {
  const { toTransaction } = useTransactionPathNavigation();

  return (
    <Modal title="Delete transaction?" closeModal={toTransaction}>
      <ConfirmDeleteTransactionModal />
    </Modal>
  );
};

export default DeleteTransactionPage;
