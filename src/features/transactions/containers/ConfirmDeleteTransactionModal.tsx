import {ConfirmationModal} from '@/shared/components';
import { Button } from '@/shared/components';
import { Spinner } from '@/shared/components';
import { useConfirmDeleteTransaction } from '../hooks/useConfirmDeleteTransaction';
import { useCurrentTransaction } from '../hooks/useCurrentTransaction';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';

const ConfirmDeleteTransactionModal = () => {
  const { isLoading, transaction } = useCurrentTransaction();
  const { toTransaction } = useTransactionPathNavigation();
  const { isPending, confirmDelete } = useConfirmDeleteTransaction(transaction);

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
      cancelHandler={toTransaction}
    >
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteTransactionModal;
