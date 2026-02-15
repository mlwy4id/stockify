import { ConfirmationModal } from '@/shared/components';
import { Button } from '@/shared/components';
import { Spinner } from '@/shared/components';
import { useConfirmDeleteItem } from '../hooks/useConfirmDeleteItem';
import { useCurrentItem } from '../hooks/useCurrentItem';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';

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
