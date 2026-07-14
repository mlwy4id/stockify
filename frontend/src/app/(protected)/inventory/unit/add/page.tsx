'use client';
import { useInventoryPathNavigation } from '@/features/inventory/hooks/useInventoryPathNavigation';
import CreateUnitForm from '@/features/inventory/unit/containers/CreateUnitForm';
import Modal from '@/shared/components/modal/Modal';

const CreateUnitPage = () => {
  const { toInventory } = useInventoryPathNavigation();
  return (
    <Modal title="Create Unit" closeModal={toInventory}>
      <CreateUnitForm />
    </Modal>
  );
};

export default CreateUnitPage;
