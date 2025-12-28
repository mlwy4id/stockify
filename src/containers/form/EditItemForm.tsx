import InventoryForm from '@/components/form/InventoryForm';
import { Button } from '@/components/ui/button';
import { useConfirmUpdateItem } from '@/hooks/useConfirmUpdateItem';
import { useCurrentItem } from '@/hooks/useCurrentItem';
import { useModalActions } from '@/hooks/useModalActions';
import { UpdateItemSchema } from '@/schemas/inventorySchema';
import type { UpdateItem } from '@/types/inventory';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const EditItemForm = () => {
  const { item } = useCurrentItem();
  const { closeModalAndToInventory } = useModalActions();
  const { confirmUpdate } = useConfirmUpdateItem(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateItem>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      name: item?.name,
      quantity: Number(item?.quantity),
    },
  });

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(confirmUpdate)}
      errors={errors}
      cancelHandler={closeModalAndToInventory}
      submitBtn={<Button className="bg-blue-600 hover:bg-blue-500">Update Item</Button>}
    />
  );
};

export default EditItemForm;
