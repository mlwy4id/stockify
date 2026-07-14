'use client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { CreateUnit } from '@/shared/types/unit.type';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<CreateUnit>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
};

const UnitForm = ({ register, errors, onSubmitHandler, cancelHandler, submitBtn }: Props) => {
  return (
    <form
      className="w-full h-full flex flex-col gap-4 font-jakarta-sans"
      onSubmit={onSubmitHandler}
    >
      <div className="grid gap-2">
        <label htmlFor="unitName">Unit Name:</label>
        <Input id="unitName" type="text" placeholder="(e.g. Kilogram)" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="unitSymbol">Unit Symbol:</label>
        <Input id="unitSymbol" type="text" placeholder="(e.g. kg)" {...register('symbol')} />
        {errors.symbol && <p className="text-red-500">{errors.symbol.message}</p>}
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

export default UnitForm;
