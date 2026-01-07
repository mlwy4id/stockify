import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmDeleteItem } from '@/hooks/inventory/useConfirmDeleteItem';
import { useCurrentItem } from '@/hooks/useCurrentItem';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const ConfirmDeleteModal = () => {
  const { isFetching, item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { isPending, confirmDelete } = useConfirmDeleteItem(item);

  if (isFetching) return <Spinner />;

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
      <p>
        Delete "<b>{item?.name}</b>" ?
      </p>
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteModal;
