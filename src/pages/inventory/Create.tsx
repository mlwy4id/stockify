import Modal from '@/components/modal/Modal';
import CreateItemForm from '@/containers/form/CreateItemForm';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';

const CreateItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Create Item" closeModal={toInventory}>
      <CreateItemForm />
    </Modal>
  );
};

export default CreateItemPage;
