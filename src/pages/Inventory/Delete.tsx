import Modal from '@/components/modal/Modal';
import ConfirmDeleteModal from '@/containers/modal/ConfirmDeleteModal';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const DeleteItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Edit Item" closeModal={toInventory}>
      <ConfirmDeleteModal />
    </Modal>
  );
};

export default DeleteItemPage;
