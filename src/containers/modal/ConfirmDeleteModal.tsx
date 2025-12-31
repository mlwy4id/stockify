import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { useDeleteInventoryItem } from '@/hooks/queries/inventory.query';
import { useCurrentItem } from '@/hooks/useCurrentItem';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const ConfirmDeleteModal = () => {
  const { item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { mutate: deleteItem } = useDeleteInventoryItem();

  const confirmDelete = () => {
    deleteItem(item.id);
    toInventory();
  };

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
