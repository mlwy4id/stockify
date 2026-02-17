import InventoryForm from '../components/InventoryForm';
import { Button } from '@/shared/components';
import { Spinner } from '@/shared/components';
import { useEditItemForm } from '../hooks/useEditItemForm';
import { useConfirmUpdateItem } from '../hooks/useConfirmUpdateItem';
import { useCurrentItem } from '../hooks/useCurrentItem';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';
import { useEffect } from 'react';
import { useGetUnits } from '@/features/unit/hooks/queries/unit.query';

const EditItemForm = () => {
  const { isLoading: unitLoading, data: units } = useGetUnits();
  const { isLoading: itemLoading, item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { confirmUpdate, isPending } = useConfirmUpdateItem(item);
  const { register, handleSubmit, errors, control, reset } = useEditItemForm();

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        initStock: item.initStock,
        unitId: item.unitId,
      });
    }
  }, [item, reset]);

  if (unitLoading || itemLoading) return <Spinner />;

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(confirmUpdate)}
      errors={errors}
      control={control}
      cancelHandler={toInventory}
      unitList={units}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Update Item
        </Button>
      }
    />
  );
};

export default EditItemForm;
