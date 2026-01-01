import { Button } from '@/components/ui/button';
import PageLayout from '../layout/PageLayout';
import InventoryTableContainer from '@/containers/table/InventoryTableContainer';
import { LuPlus } from 'react-icons/lu';
import { useInventoryPathNavigation } from '@/hooks/useInventoryPathNavigation';
import { Card, CardContent } from '@/components/ui/card';

const InventoryPage = () => {
  const { toCreateItem } = useInventoryPathNavigation();

  return (
    <PageLayout
      title={'Inventory'}
      button={
        <Button className="bg-blue-600 hover:bg-blue-500" onClick={toCreateItem}>
          <LuPlus />
          Add Item
        </Button>
      }
    >
      <Card className="h-screen">
        <CardContent className="h-full">
          <InventoryTableContainer />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default InventoryPage;
