import { Button } from '@/components/ui/button';
import PageLayout from '../layout/PageLayout';
import InventoryTableContainer from '@/containers/table/InventoryTableContainer';
import { LuPlus } from 'react-icons/lu';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';

const InventoryPage = () => {
  const { toCreateItem } = useInventoryPathNavigation();

  return (
    <PageLayout
      title={'Inventory'}
      button={
        <Button className="bg-blue-600 hover:bg-blue-500" onClick={toCreateItem}>
          <LuPlus />
          Add Inventory
        </Button>
      }
    >
      <InventoryTableContainer />
    </PageLayout>
  );
};

export default InventoryPage;
