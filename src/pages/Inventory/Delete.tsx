import Modal from '@/components/modal/Modal';
import ConfirmDeleteModal from '@/containers/modal/ConfirmDeleteItemModal';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const DeleteItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Delete Item?" closeModal={toInventory}>
      <ConfirmDeleteModal />
    </Modal>
  );
};

export default DeleteItemPage;
