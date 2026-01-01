import InventoryForm from '@/components/form/InventoryForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmUpdate } from '@/hooks/useConfirmUpdateItem';
import { useCurrentItem } from '@/hooks/useCurrentItem';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';
import { UpdateItemSchema } from '@/schemas/inventorySchema';
import type { UpdateItem } from '@/types/inventory';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditItemForm = () => {
  const { isLoading, isFetching, item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { confirmUpdate, isPending } = useConfirmUpdate(item);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateItem>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      name: item?.name,
      quantity: Number(item?.quantity),
    },
  });

  useEffect(() => {
    reset({
      name: item?.name,
      quantity: Number(item?.quantity),
    });
  }, [item, reset]);

  if (isLoading || isFetching) return <Spinner />;

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
      isPending={isPending}
    />
  );
};

export default EditItemForm;
