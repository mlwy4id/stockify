import InventoryForm from '@/components/form/InventoryForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useEditItemForm } from '@/hooks/inventory/useEditItemForm';
import { useConfirmUpdateItem } from '@/hooks/inventory/useConfirmUpdateItem';
import { useCurrentItem } from '@/hooks/inventory/useCurrentItem';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';
import { useEffect } from 'react';

const EditItemForm = () => {
  const { isLoading, item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { confirmUpdate, isPending } = useConfirmUpdateItem(item);
  const { register, handleSubmit, errors, reset } = useEditItemForm(item);

  useEffect(() => {
    reset({
      name: item?.name,
      initStock: Number(item?.currentStock),
    });
  }, [item, reset]);

  if (isLoading) return <Spinner />;

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(confirmUpdate)}
      errors={errors}
      cancelHandler={toInventory}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Update Item
        </Button>
      }
    />
  );
};

export default EditItemForm;
