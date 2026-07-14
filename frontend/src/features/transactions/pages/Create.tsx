'use client';
import Modal from '@/shared/components/modal/Modal';
import CreateTransactionForm from '../containers/CreateTransactionForm';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';

const CreateTransactionPage = () => {
  const { toTransaction } = useTransactionPathNavigation();

  return (
    <Modal title="Create Transaction" closeModal={toTransaction}>
      <CreateTransactionForm />
    </Modal>
  );
};

export default CreateTransactionPage;
