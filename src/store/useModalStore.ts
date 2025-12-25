import type { ModalType } from "@/types/modal";
import { create } from "zustand";

interface ModalState {
  componentName: ModalType | null;
  isOpen: boolean;
  openModal: (componentName: ModalType) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>()((set) => ({
  componentName: null,
  isOpen: false,

  openModal: (componentName) =>
    set({
      componentName,
      isOpen: true,
    }),
  closeModal: () =>
    set({
      componentName: null,
      isOpen: false,
    }),
}));

export default useModalStore;
