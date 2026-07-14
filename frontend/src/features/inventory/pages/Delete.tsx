'use client';
import Modal from '@/shared/components/modal/Modal';
import ConfirmDeleteItemModal from '../containers/ConfirmDeleteItemModal';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';

const DeleteItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Delete Item?" closeModal={toInventory}>
      <ConfirmDeleteItemModal />
    </Modal>
  );
};

export default DeleteItemPage;
