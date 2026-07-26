'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent } from '@/shared/components/ui/card';
import ProductCardsContainer from '../containers/ProductCardsContainer';
import ProductFilters from '../containers/ProductFilters';
import { useState } from 'react';

const ProductPage = () => {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <PageLayout title={'Products'} navLink="/products/new">
      <Card className="h-screen bg-muted border-0 shadow-none">
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <ProductFilters setSearchValue={setSearchValue} />
          <ProductCardsContainer searchValue={searchValue} />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ProductPage;
