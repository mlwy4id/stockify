import useModalStore from '@/store/useModalStore';
import { useNavigate } from 'react-router-dom';

export const useModalActions = () => {
  const navigate = useNavigate();

  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  return {
    openCreateItem: () => openModal('CREATE_ITEM'),
    openEditItem: (id: string) => {
      navigate(id);
      openModal('EDIT_ITEM', { itemId: id });
    },
    openDeleteItem: (id: string) => {
      navigate(id);
      openModal('DELETE_ITEM', { itemId: id });
    },
    closeModal,
    closeModalAndToInventory: () => {
      closeModal();
      navigate('/Inventory', { replace: true });
    },
  };
};
