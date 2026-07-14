'use client';
import ConfirmationModal from '@/shared/components/modal/ConfirmationModal';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
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
