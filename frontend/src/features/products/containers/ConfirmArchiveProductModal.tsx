'use client';
import ConfirmationModal from '@/shared/components/modal/ConfirmationModal';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useConfirmArchiveProduct } from '../hooks/useConfirmArchiveProduct';
import { useCurrentProduct } from '../hooks/useCurrentProduct';

type Props = {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ConfirmArchiveProductModal = ({ productId, onSuccess, onCancel }: Props) => {
  const { isLoading, product } = useCurrentProduct(productId);
  const { isPending, confirmArchive } = useConfirmArchiveProduct(product, onSuccess);

  if (isLoading) return <Spinner />;

  return (
    <ConfirmationModal
      button={
        <Button
          className="bg-danger hover:bg-danger/90"
          disabled={isPending}
          onClick={confirmArchive}
        >
          Archive
        </Button>
      }
      cancelHandler={onCancel ?? (() => {})}
    >
      <p>This product will be archived and hidden from active listings.</p>
    </ConfirmationModal>
  );
};

export default ConfirmArchiveProductModal;
