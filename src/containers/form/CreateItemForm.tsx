import InventoryForm from '@/components/form/InventoryForm';
import { Button } from '@/components/ui/button';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';
import { useConfirmCreateItem } from '@/hooks/useConfirmCreateItem';
import { useCreateItemForm } from '@/hooks/form/useCreateItemForm';

const CreateItemForm = () => {
  const { toInventory } = useInventoryPathNavigation();
  const { confirmCreate, isPending } = useConfirmCreateItem();
  const { register, handleSubmit, errors } = useCreateItemForm();

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(confirmCreate)}
      errors={errors}
      cancelHandler={toInventory}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Add Item
        </Button>
      }
    />
  );
};

export default CreateItemForm;
