'use client';
import Modal from '@/shared/components/modal/Modal';
import EditProductForm from '../containers/EditProductForm';
import { useProductPathNavigation } from '../hooks/useProductPathNavigation';

const EditProductPage = () => {
  const { toProducts } = useProductPathNavigation();

  return (
    <Modal title="Edit Product" closeModal={toProducts}>
      <EditProductForm />
    </Modal>
  );
};

export default EditProductPage;
