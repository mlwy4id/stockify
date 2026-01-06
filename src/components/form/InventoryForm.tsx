import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { Item } from '@stockify/schema/src';
type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<Item>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
};

const InventoryForm = ({ register, errors, onSubmitHandler, cancelHandler, submitBtn }: Props) => {
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
      <div className="grid gap-2">
        <label htmlFor="itemQuantity">Quantity:</label>
        <Input
          id="itemQuantity"
          type="number"
          min={0}
          {...register('initQuantity', { valueAsNumber: true })}
        />
        {errors.initQuantity && <p className="text-red-500">{errors.initQuantity.message}</p>}
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
