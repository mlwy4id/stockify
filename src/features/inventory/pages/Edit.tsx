import { Modal } from '@/shared/components';
import EditItemForm from '../containers/EditItemForm';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';

const EditItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Edit Item" closeModal={toInventory}>
      <EditItemForm />
    </Modal>
  );
};

export default EditItemPage;
