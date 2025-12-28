import { Button } from '@/components/ui/button';
import PageLayout from '../layout/PageLayout';
import InventoryTableContainer from '@/containers/table/InventoryTableContainer';
import { useModalActions } from '@/hooks/useModalActions';
import { LuPlus } from 'react-icons/lu';

const InventoryPage = () => {
  const { openCreateItem } = useModalActions();

  return (
    <PageLayout
      title={'Inventory'}
      button={
        <Button className="bg-blue-600 hover:bg-blue-500" onClick={openCreateItem}>
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
