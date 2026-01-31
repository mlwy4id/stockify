import Modal from '@/components/modal/Modal';
import EditItemForm from '@/containers/form/EditItemForm';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';

const EditItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Edit Item" closeModal={toInventory}>
      <EditItemForm />
    </Modal>
  );
};

export default EditItemPage;
