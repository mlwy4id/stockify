import useModalStore from "@/store/useModalStore";

export const useModalActions = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  return {
    openCreateItem: () => openModal("CREATE_ITEM"),
    closeModal,
  };
};
