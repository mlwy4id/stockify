import type { Item } from '@/types/inventory';
import { create } from 'zustand';

interface ItemState {
  inventoryItems: Item[];
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, newItem: Item) => void;
}

const useItemStore = create<ItemState>()((set) => ({
  inventoryItems: [],

  setItems: (items) => set({ inventoryItems: items }),
  addItem: (item) => set((state) => ({ inventoryItems: [...state.inventoryItems, item] })),
  deleteItem: (id) =>
    set((state) => ({
      inventoryItems: state.inventoryItems.filter((item) => item.id !== id),
    })),
  updateItem: (id, newItem) =>
    set((state) => ({
      inventoryItems: state.inventoryItems.map((item) =>
        item.id === id ? { ...item, ...newItem } : item
      ),
    })),
}));

export default useItemStore;
