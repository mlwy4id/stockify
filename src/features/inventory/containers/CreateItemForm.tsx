import InventoryForm from '../components/InventoryForm';
import { Button } from '@/shared/components';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';
import { useConfirmCreateItem } from '../hooks/useConfirmCreateItem';
import { useCreateItemForm } from '../hooks/useCreateItemForm';
import { useGetUnits } from '@/features/unit/hooks/queries/unit.query';

const CreateItemForm = () => {
  const { toInventory } = useInventoryPathNavigation();
  const { confirmCreate, isPending } = useConfirmCreateItem();
  const { register, handleSubmit, errors, control } = useCreateItemForm();
  const { data: unitData, isLoading } = useGetUnits();

  if (isLoading) return <p>Loading</p>;

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(confirmCreate)}
      errors={errors}
      control={control}
      cancelHandler={toInventory}
      unitList={unitData}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500 " disabled={isPending}>
          Add Item
        </Button>
      }
    />
  );
};

export default CreateItemForm;
