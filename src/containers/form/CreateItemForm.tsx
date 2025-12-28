import InventoryForm from '@/components/form/InventoryForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateItemSchema } from '@/schemas/inventorySchema';
import type { CreateItem } from '@/types/inventory';
import { useConfirmCreateItem } from '@/hooks/useConfirmCreateItem';
import { Button } from '@/components/ui/button';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const CreateItemForm = () => {
  const { confirmCreate } = useConfirmCreateItem();
  const { toInventory } = useInventoryPathNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItem>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      name: '',
      quantity: 0,
    },
  });

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(confirmCreate)}
      errors={errors}
      cancelHandler={toInventory}
      submitBtn={<Button className="bg-blue-600 hover:bg-blue-500">Add Item</Button>}
    />
  );
};

export default CreateItemForm;
