'use client';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import Select from '@/shared/components/select';
import type { CreateStockMovement } from '@/shared/types/stock-movement.type';
import type { Product } from '@/shared/types/product.type';
import ProductsOption from './ProductsOption';

type Props = {
  products: Product[];
  register: UseFormRegister<CreateStockMovement>;
  errors: FieldErrors<CreateStockMovement>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
  showProductSelect?: boolean;
  registerProductId?: object;
};

const TransactionForm = ({
  products,
  register,
  errors,
  onSubmitHandler,
  cancelHandler,
  submitBtn,
  showProductSelect = true,
  registerProductId,
}: Props) => {
  return (
    <form
      className="w-full h-full flex flex-col gap-4 font-jakarta-sans"
      onSubmit={onSubmitHandler}
    >
      {showProductSelect && registerProductId && (
        <div className="grid gap-2">
          <label htmlFor="productName">Product:</label>
          <Select id="productName" {...registerProductId}>
            <option value="">Select product</option>
            <ProductsOption products={products} />
          </Select>
        </div>
      )}

      <div className="grid gap-2">
        <label htmlFor="transactionType">Action:</label>
        <Select id="transactionType" {...register('action')}>
          <option value="">Select action</option>
          <option value="RESTOCK">Restock</option>
          <option value="SOLD">Sold</option>
          <option value="REFUND">Refund</option>
          <option value="BROKEN">Broken</option>
        </Select>
        {errors.action && <p className="text-danger">{errors.action.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="quantity">Quantity:</label>
        <Input
          id="quantity"
          type="number"
          min={1}
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity && <p className="text-danger">{errors.quantity.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="date">Date:</label>
        <Input id="date" type="date" {...register('date')} />
        {errors.date && <p className="text-danger">{errors.date.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="source">Source (optional):</label>
        <Input id="source" type="text" placeholder="e.g. Supplier A" {...register('source')} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="reason">Reason (optional):</label>
        <Input id="reason" type="text" placeholder="e.g. Monthly restock" {...register('reason')} />
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
