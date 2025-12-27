import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { useFindItem } from "@/hooks/useFindItem";
import { useModalActions } from "@/hooks/useModalActions";
import useItemStore from "@/store/useItemStore";
import useModalStore from "@/store/useModalStore";

const ConfirmDeleteModal = () => {
  const payload = useModalStore((state) => state.payload);
  const item = useFindItem(payload?.itemId);

  const { closeModalAndToInventory } = useModalActions();
  const deleteItem = useItemStore((state) => state.deleteItem);

  const deleteHandler = () => {
    deleteItem(item?.id || "");
    closeModalAndToInventory();
  };

  return (
    <ConfirmationModal
      button={
        <Button className="bg-red-600" onClick={deleteHandler}>
          Delete
        </Button>
      }
      cancelHandler={closeModalAndToInventory}
    >
      <p>
        Delete "<b>{item?.name}</b>" ?
      </p>
      <p>This action cannot be undone</p>
    </ConfirmationModal>
  );
};

export default ConfirmDeleteModal;
