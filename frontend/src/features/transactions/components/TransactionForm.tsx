'use client';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import Select from '@/shared/components/select';
import type { Transaction } from '@/shared/types/transaction.type';
import type { Item } from '@/shared/types/inventory.type';
import ItemsOption from './ItemsOption';

type Props = {
  inventoryItems: Item[];
  register: UseFormRegister<any>;
  errors: FieldErrors<Transaction>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
};

const TransactionForm = ({
  inventoryItems,
  register,
  errors,
  onSubmitHandler,
  cancelHandler,
  submitBtn,
}: Props) => {
  return (
    <form
      className="w-full h-full flex flex-col gap-4 font-jakarta-sans"
      onSubmit={onSubmitHandler}
    >
      <div className="grid gap-2">
        <label htmlFor="transactionType">Transaction Type:</label>
        <Select id="transactionType" {...register('action')}>
          <option value="">Select action</option>
          <option value="Restock">Restock</option>
          <option value="Sold">Sold</option>
        </Select>
        {errors.action && <p className="text-red-500">{errors.action.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="itemName">Item Name:</label>
        <Select id="itemName" {...register('itemId')}>
          <option value="">Select Item</option>
          <ItemsOption inventoryItems={inventoryItems} />
        </Select>
        {errors?.item?.id && <p className="text-red-500">{errors?.item?.id.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="transitionQuantity">Quantity:</label>
        <Input
          id="transitionQuantity"
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
        {submitBtn}
      </div>
    </form>
  );
};

export default TransactionForm;
