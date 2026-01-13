import Modal from '@/components/modal/Modal';
import ConfirmDeleteItemModal from '@/containers/modal/ConfirmDeleteItemModal';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';

const DeleteItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Delete Item?" closeModal={toInventory}>
      <ConfirmDeleteItemModal />
    </Modal>
  );
};

export default DeleteItemPage;
