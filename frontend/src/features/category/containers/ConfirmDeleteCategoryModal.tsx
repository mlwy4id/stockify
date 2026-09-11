'use client';
import ConfirmationModal from '@/shared/components/modal/ConfirmationModal';
import { Button } from '@/shared/components/ui/button';
import { useDeleteCategory } from '@/features/category/hooks/queries/category.query';

type Props = {
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ConfirmDeleteCategoryModal = ({ categoryId, categoryName, onSuccess, onCancel }: Props) => {
  const { mutate, isPending } = useDeleteCategory();

  const confirmDelete = () => {
    mutate(categoryId, { onSuccess: () => onSuccess?.() });
  };

  return (
    <ConfirmationModal
      button={
        <Button
          className="bg-danger hover:bg-danger/90"
          disabled={isPending}
          onClick={confirmDelete}
        >
Hapus
        </Button>
      }
      cancelHandler={onCancel ?? (() => {})}
    >
      Kategori "{categoryName}" akan dihapus. Produk yang menggunakan kategori ini mungkin akan terpengaruh.
    </ConfirmationModal>
  );
};

export default ConfirmDeleteCategoryModal;
