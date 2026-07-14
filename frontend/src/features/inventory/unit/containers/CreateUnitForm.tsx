'use client';
import UnitForm from '@/features/inventory/unit/components/UnitForm';
import { UseConfirmCreateUnit } from '@/features/inventory/unit/hooks/useConfirmCreateUnit';
import { useCreateUnitForm } from '@/features/inventory/unit/hooks/useCreateUnitForm';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

const CreateUnitForm = () => {
  const { register, handleSubmit, errors } = useCreateUnitForm();
  const { confirmCreate, isPending } = UseConfirmCreateUnit();
  const router = useRouter();

  return (
    <UnitForm
      onSubmitHandler={handleSubmit(confirmCreate)}
      register={register}
      errors={errors}
      submitBtn={
        <Button className="bg-blue-600 hover:bg-blue-500" disabled={isPending}>
          Add Item
        </Button>
      }
      cancelHandler={() => router.back()}
    />
  );
};

export default CreateUnitForm;
