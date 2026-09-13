'use client';
import ConfirmationModal from '@/shared/components/modal/ConfirmationModal';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useConfirmReactivateProduct } from '../hooks/useConfirmReactivateProduct';
import { useCurrentProduct } from '../hooks/useCurrentProduct';

type Props = {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ConfirmReactivateProductModal = ({ productId, onSuccess, onCancel }: Props) => {
  const { isLoading, product } = useCurrentProduct(productId);
  const { isPending, confirmReactivate } = useConfirmReactivateProduct(product, onSuccess);

  if (isLoading) return <Spinner />;

  return (
    <ConfirmationModal
      button={
        <Button disabled={isPending} onClick={confirmReactivate}>
          Aktifkan kembali
        </Button>
      }
      cancelHandler={onCancel ?? (() => {})}
    >
      Produk ini akan diaktifkan kembali dan muncul di daftar item aktif.
    </ConfirmationModal>
  );
};

export default ConfirmReactivateProductModal;