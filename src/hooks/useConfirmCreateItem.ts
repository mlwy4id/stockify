import useItemStore from '@/store/useItemStore';
import { useModalActions } from './useModalActions';

export const useConfirmCreateItem = () => {
  const addItem = useItemStore((state) => state.addItem);
  const { closeModal } = useModalActions();

  const confirmCreate = (data: any) => {
    const dataWithId = { ...data, id: crypto.randomUUID() };
    addItem(dataWithId);
    closeModal();
  };

  return { confirmCreate };
};
