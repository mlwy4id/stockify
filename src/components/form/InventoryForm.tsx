import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { Item } from '@/types/inventory';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<Item>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
};

const InventoryForm = ({ register, errors, onSubmitHandler, cancelHandler }: Props) => {
  return (
    <form className="w-full h-full flex flex-col gap-4" onSubmit={onSubmitHandler}>
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
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" onClick={cancelHandler}>
          Cancel
        </Button>
        <Button className="bg-blue-600">Add Item</Button>
      </div>
    </form>
  );
};

export default InventoryForm;
