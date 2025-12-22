import { Button } from '@/components/ui/button';
import PageLayout from './PageLayout';

const Inventory = () => {
  return (
    <PageLayout title={'Inventory'} button={<Button>Add Inventory</Button>}>
      <p>Inventory here!</p>
    </PageLayout>
  );
};

export default Inventory;
