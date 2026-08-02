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
          className="bg-red-600 hover:bg-red-500"
          disabled={isPending}
          onClick={confirmDelete}
        >
          Delete
        </Button>
      }
      cancelHandler={onCancel ?? (() => {})}
    >
      Category "{categoryName}" will be deleted. Products using this category may be affected.
    </ConfirmationModal>
  );
};

export default ConfirmDeleteCategoryModal;
