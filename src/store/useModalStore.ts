import type { ModalType } from "@/types/modal";
import { create } from "zustand";

interface ModalState {
  componentName: ModalType | null;
  isOpen: boolean;
  payload?: {
    itemId?: string;
  };

  openModal: (componentName: ModalType, payload?: { itemId: string }) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>()((set) => ({
  componentName: null,
  isOpen: false,

  openModal: (componentName, payload) =>
    set({
      componentName,
      isOpen: true,
      payload: payload,
    }),
  closeModal: () =>
    set({
      componentName: null,
      isOpen: false,
      payload: undefined,
    }),
}));

export default useModalStore;
