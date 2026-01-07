import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Select from '../ui/select';
import type { Transaction } from '@stockify/schema';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<Transaction>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
};

const TransactionForm = ({
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
        <Select id="transactionType" {...register('type')}>
          <option value="">Select Type</option>
          <option value="In">In</option>
          <option value="Out">Out</option>
        </Select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="transitionQuantity">Quantity:</label>
        <Input id="transitionQuantity" type="number" min={0} {...register('quantity')} />
        {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="itemName">Item Name:</label>
        <Select id="itemName" {...register('itemId')}>
          <option value="">Select Item</option>
        </Select>
        {errors.itemId && <p className="text-red-500">{errors.itemId.message}</p>}
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
