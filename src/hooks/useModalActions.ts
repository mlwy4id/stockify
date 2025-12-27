import useModalStore from "@/store/useModalStore";
import { useNavigate } from "react-router-dom";

export const useModalActions = () => {
  const navigate = useNavigate();

  const setId = useModalStore((state) => state.setId);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  return {
    openCreateItem: () => openModal("CREATE_ITEM"),
    openEditItem: (id: string) => {
      navigate(id);
      setId(id);
      openModal("EDIT_ITEM");
    },
    closeModal,
    closeModalAndBackToPreviousPage: () => {
      closeModal();
      navigate(-1);
    },
  };
};
