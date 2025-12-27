import type { ModalType } from '@/types/modal';
import { create } from 'zustand';

interface ModalState {
  id?: string;
  componentName: ModalType | null;
  isOpen: boolean;
  setId: (id: string) => void;
  openModal: (componentName: ModalType) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>()((set) => ({
  id: undefined,
  componentName: null,
  isOpen: false,

  setId: (id) => set({ id }),
  openModal: (componentName) =>
    set({
      componentName,
      isOpen: true,
    }),
  closeModal: () =>
    set({
      id: undefined,
      componentName: null,
      isOpen: false,
    }),
}));

export default useModalStore;
