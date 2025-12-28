import Modal from '@/components/Modal';
import useModalStore from '@/store/useModalStore';
import { MODAL_COMPONENT_STRATEGIES } from './ModalStrategies';
import { useModalActions } from '@/hooks/useModalActions';

const ModalContainer = () => {
  const componentName = useModalStore((state) => state.componentName);

  if (!componentName) return null;
  const { title, Component } = MODAL_COMPONENT_STRATEGIES[componentName];
  const { closeModalAndToInventory } = useModalActions();

  return (
    <Modal title={title} closeModal={closeModalAndToInventory}>
      <Component />
    </Modal>
  );
};

export default ModalContainer;
