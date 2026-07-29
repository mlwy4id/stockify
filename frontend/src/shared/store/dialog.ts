import { create } from 'zustand';

type DialogState = {
  isOpen: boolean;
  type: 'create' | null;
  open: (type: 'create') => void;
  close: () => void;
};

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  type: null,
  open: (type) => set({ isOpen: true, type }),
  close: () => set({ isOpen: false, type: null }),
}));
