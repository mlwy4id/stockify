import UnitForm from '@/features/unit/components/UnitForm';
import { Button } from '@/shared/components';

const CreateUnitForm = () => {
  return (
    <UnitForm submitBtn={<Button className="bg-blue-600 hover:bg-blue-500 ">Add Item</Button>} />
  );
};

export default CreateUnitForm;
