'use client';
import Modal from '@/shared/components/modal/Modal';
import ConfirmArchiveProductModal from '../containers/ConfirmArchiveProductModal';
import { useProductPathNavigation } from '../hooks/useProductPathNavigation';

const ArchiveProductPage = () => {
  const { toProducts } = useProductPathNavigation();

  return (
    <Modal title="Archive Product?" closeModal={toProducts}>
      <ConfirmArchiveProductModal />
    </Modal>
  );
};

export default ArchiveProductPage;
