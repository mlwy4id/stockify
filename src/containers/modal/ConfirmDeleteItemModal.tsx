import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmDeleteItem } from '@/hooks/inventory/useConfirmDeleteItem';
import { useCurrentItem } from '@/hooks/inventory/useCurrentItem';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';

const ConfirmDeleteItemModal = () => {
  const { isLoading, item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { isPending, confirmDelete } = useConfirmDeleteItem(item);

  if (isLoading) return <Spinner />;

  return (
    <ConfirmationModal
      button={
        <Button
          className="bg-red-600 hover:bg-red-500"
          disabled={isPending}
          onClick={confirmDelete}
        >
          Delete
        </Button>
      }
      cancelHandler={toInventory}
    >
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteItemModal;
