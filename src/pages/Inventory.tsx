import { Button } from '@/components/ui/button';
import PageLayout from './PageLayout';
import InventoryTableContainer from '@/containers/table/InventoryTableContainer';

const Inventory = () => {
  return (
    <PageLayout title={'Inventory'} button={<Button>Add Inventory</Button>}>
      <InventoryTableContainer />
    </PageLayout>
  );
};

export default Inventory;
