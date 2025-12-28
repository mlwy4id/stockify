import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { useConfirmDeleteItem } from '@/hooks/useConfirmDeleteItem';
import { useCurrentItem } from '@/hooks/useCurrentItem';
import { useModalActions } from '@/hooks/useModalActions';

const ConfirmDeleteModal = () => {
  const { item } = useCurrentItem();
  const { confirmDelete } = useConfirmDeleteItem(item);
  const { closeModalAndToInventory } = useModalActions();

  return (
    <ConfirmationModal
      button={
        <Button className="bg-red-600 hover:bg-red-500" onClick={confirmDelete}>
          Delete
        </Button>
      }
      cancelHandler={closeModalAndToInventory}
    >
      <p>
        Delete "<b>{item?.name}</b>" ?
      </p>
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteModal;
