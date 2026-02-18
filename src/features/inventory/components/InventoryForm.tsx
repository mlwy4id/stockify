import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Button } from '@/shared/components';
import { Input } from '@/shared/components';
import type { CreateItem } from '@/shared/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Unit } from '@/shared/types/unit.type';

type Props = {
  register: UseFormRegister<any>;
  control: Control<CreateItem>;
  errors: FieldErrors<CreateItem>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  addUnitHandler: () => void;
  submitBtn: React.ReactNode;
  unitList: Unit[];
};

const InventoryForm = ({
  register,
  control,
  errors,
  onSubmitHandler,
  cancelHandler,
  addUnitHandler,
  submitBtn,
  unitList,
}: Props) => {
  return (
    <form
      className="w-full h-full flex flex-col gap-4 font-jakarta-sans"
      onSubmit={onSubmitHandler}
    >
      <div className="grid gap-2">
        <label htmlFor="itemName">Item Name:</label>
        <Input id="itemName" type="text" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex gap-2 items-end">
        <div className="grid gap-2 w-[70%]">
          <label htmlFor="itemQuantity">Stock:</label>
          <Input
            id="itemQuantity"
            type="number"
            min={0}
            {...register('initStock', { valueAsNumber: true })}
          />
          {errors.initStock && <p className="text-red-500">{errors.initStock.message}</p>}
        </div>
        <div className="grid gap-2 w-[30%]">
          {errors.unitId && <p className="text-red-500 text-xs">{errors.unitId.message}</p>}
          <Controller
            name="unitId"
            control={control}
            render={({ field }) => (
              <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Units</SelectLabel>
                    {unitList.map((u) => {
                      return (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                  <SelectSeparator />
                  <Button variant="secondary" onClick={addUnitHandler}>+Add New Unit</Button>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" onClick={cancelHandler}>
          Cancel
        </Button>
        {submitBtn}
      </div>
    </form>
  );
};

export default InventoryForm;
