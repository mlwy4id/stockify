import InventoryForm from '@/components/form/InventoryForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateItemSchema } from '@/schemas/inventorySchema';
import type { CreateItem } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';
import { useCreateInventoryItem } from '@/hooks/queries/inventory.query';

const CreateItemForm = () => {
  const { mutate: createItem } = useCreateInventoryItem();
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

  const confirmCreate = (item: any) => {
    createItem(item);
    toInventory();
  };

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
