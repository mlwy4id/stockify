'use client';
import { useProductPathNavigation } from '@/features/products/hooks/useProductPathNavigation';
import CreateCategoryForm from '@/features/products/unit/containers/CreateCategoryForm';
import Modal from '@/shared/components/modal/Modal';

const CreateCategoryPage = () => {
  const { toProducts } = useProductPathNavigation();
  return (
    <Modal title="Create Category" closeModal={toProducts}>
      <CreateCategoryForm />
    </Modal>
  );
};

export default CreateCategoryPage;
