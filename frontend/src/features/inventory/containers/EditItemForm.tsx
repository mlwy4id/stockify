'use client';
import InventoryForm from '../components/InventoryForm';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import { useEditItemForm } from '../hooks/useEditItemForm';
import { useConfirmUpdateItem } from '../hooks/useConfirmUpdateItem';
import { useCurrentItem } from '../hooks/useCurrentItem';
import { useInventoryPathNavigation } from '../hooks/useInventoryPathNavigation';
import { useEffect } from 'react';
import { useGetUnits } from '@/features/inventory/unit/hooks/queries/unit.query';
import { useUnitPathNavigation } from '@/features/inventory/unit/hooks/useUnitPathNavigation';

const EditItemForm = () => {
  const { isLoading: unitLoading, data: units } = useGetUnits();
  const { isLoading: itemLoading, item } = useCurrentItem();
  const { toInventory } = useInventoryPathNavigation();
  const { toCreateUnit } = useUnitPathNavigation();
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
      addUnitHandler={toCreateUnit}
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
