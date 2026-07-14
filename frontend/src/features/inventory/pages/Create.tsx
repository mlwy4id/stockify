'use client';
import Modal from '@/shared/components/modal/Modal';
import CreateItemForm from '../containers/CreateItemForm';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';

const CreateItemPage = () => {
  const { toInventory } = useInventoryPathNavigation();

  return (
    <Modal title="Create Item" closeModal={toInventory}>
      <CreateItemForm />
    </Modal>
  );
};

export default CreateItemPage;
