import UnitForm from '@/features/unit/components/UnitForm';
import { UseConfirmCreateUnit } from '@/features/unit/hooks/useConfirmCreateUnit';
import { useCreateUnitForm } from '@/features/unit/hooks/useCreateUnitForm';
import { Button } from '@/shared/components';
import { useNavigate } from 'react-router-dom';

const CreateUnitForm = () => {
  const { register, handleSubmit, errors } = useCreateUnitForm();
  const { confirmCreate, isPending } = UseConfirmCreateUnit();
  const navigate = useNavigate();

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
      cancelHandler={() => navigate(-1)}
    />
  );
};

export default CreateUnitForm;
