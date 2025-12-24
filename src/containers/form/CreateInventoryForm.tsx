import InventoryForm from '@/components/form/InventoryForm';
import { useState } from 'react';

const CreateInventoryForm = () => {
  const [item, setItem] = useState({
    name: '',
    quantity: 0,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  return <InventoryForm item={item} onChangeHandler={onChangeHandler} />;
};

export default CreateInventoryForm;
