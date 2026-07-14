'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent } from '@/shared/components/ui/card';
import InventoryCardsContainer from '../containers/InventoryCardsContainer';
import InventoryFilters from '../containers/InventoryFilters';
import { useState } from 'react';

const InventoryPage = () => {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <PageLayout title={'Inventory'} navLink="/inventory/new">
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
