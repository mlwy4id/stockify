'use client';
import Modal from '@/shared/components/modal/Modal';
import CreateProductForm from '../containers/CreateProductForm';
import { useProductPathNavigation } from '../hooks/useProductPathNavigation';

const CreateProductPage = () => {
  const { toProducts } = useProductPathNavigation();

  return (
    <Modal title="Create Product" closeModal={toProducts}>
      <CreateProductForm />
    </Modal>
  );
};

export default CreateProductPage;
