import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { useConfirmSubmitItem } from '@/hooks/useConfirmSubmitItem';
import { useCurrentItem } from '@/hooks/useCurrentItem';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const ConfirmDeleteModal = () => {
  const { item } = useCurrentItem();
  const { confirmDelete } = useConfirmSubmitItem(item);
  const { toInventory } = useInventoryPathNavigation();

  return (
    <ConfirmationModal
      button={
        <Button className="bg-red-600 hover:bg-red-500" onClick={confirmDelete}>
          Delete
        </Button>
      }
      cancelHandler={toInventory}
    >
      <p>
        Delete "<b>{item?.name}</b>" ?
      </p>
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteModal;
