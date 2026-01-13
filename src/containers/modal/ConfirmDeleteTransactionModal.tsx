import ConfirmationModal from '@/components/modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmDeleteTransaction } from '@/hooks/transactions/useConfirmDeleteTransaction';
import { useCurrentTransaction } from '@/hooks/transactions/useCurrentTransaction';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';

const ConfirmDeleteTransactionModal = () => {
  const { isFetching, transaction } = useCurrentTransaction();
  const { toTransaction } = useTransactionPathNavigation();
  const { isPending, confirmDelete } = useConfirmDeleteTransaction(transaction);

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
      cancelHandler={toTransaction}
    >
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteTransactionModal;
