'use client';
import ConfirmationModal from '@/shared/components/modal/ConfirmationModal';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useConfirmArchiveProduct } from '../hooks/useConfirmArchiveProduct';
import { useCurrentProduct } from '../hooks/useCurrentProduct';
import { useProductPathNavigation } from '../hooks/useProductPathNavigation';

const ConfirmArchiveProductModal = () => {
  const { isLoading, product } = useCurrentProduct();
  const { toProducts } = useProductPathNavigation();
  const { isPending, confirmArchive } = useConfirmArchiveProduct(product);

  if (isLoading) return <Spinner />;

  return (
    <ConfirmationModal
      button={
        <Button
          className="bg-red-600 hover:bg-red-500"
          disabled={isPending}
          onClick={confirmArchive}
        >
          Archive
        </Button>
      }
      cancelHandler={toProducts}
    >
      <p>This product will be archived and hidden from active listings.</p>
    </ConfirmationModal>
  );
};

export default ConfirmArchiveProductModal;
