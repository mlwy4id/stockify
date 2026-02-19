import { useInventoryPathNavigation } from '@/features/inventory';
import CreateUnitForm from '@/features/unit/containers/CreateUnitForm';
import { Modal } from '@/shared/components';

const CreateUnitPage = () => {
  const { toInventory } = useInventoryPathNavigation();
  return (
    <Modal title="Create Unit" closeModal={toInventory}>
      <CreateUnitForm />
    </Modal>
  );
};

export default CreateUnitPage;
