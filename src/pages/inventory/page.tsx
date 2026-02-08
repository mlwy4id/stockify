import { Button } from '@/components/ui/button';
import PageLayout from '../layout/PageLayout';
import { LuPlus } from 'react-icons/lu';
import { useInventoryPathNavigation } from '@/hooks/inventory/useInventoryPathNavigation';
import InventoryCardsContainer from '@/containers/card/inventory/InventoryCardsContainer';
import { Card, CardContent } from '@/components/ui/card';
import InventoryFilters from '@/containers/filters/InventoryFilters';
import { useState } from 'react';

const InventoryPage = () => {
  const [searchValue, setSearchValue] = useState<string>('');
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
      <Card className="h-screen bg-muted border-0 shadow-none">
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <InventoryFilters setSearchValue={setSearchValue} />
          <InventoryCardsContainer searchValue={searchValue} />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default InventoryPage;
