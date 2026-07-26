'use client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { CreateCategory } from '@/shared/types/category.type';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<CreateCategory>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
};

const CategoryForm = ({ register, errors, onSubmitHandler, cancelHandler, submitBtn }: Props) => {
  return (
    <form
      className="w-full h-full flex flex-col gap-4 font-jakarta-sans"
      onSubmit={onSubmitHandler}
    >
      <div className="grid gap-2">
        <label htmlFor="categoryName">Category Name:</label>
        <Input id="categoryName" type="text" placeholder="(e.g. Electronics)" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" onClick={cancelHandler} type="button">
          Cancel
        </Button>
        {submitBtn}
      </div>
    </form>
  );
};

export default CategoryForm;
