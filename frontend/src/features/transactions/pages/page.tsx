'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import TransactionCardsContainers from '../containers/TransactionsCardsContainer';
import TransactionFilters from '../containers/TransactionsFilters';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import TransactionsPaginationContainer from '../containers/TransactionsPagination';

const TransactionsPage = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isTransactionDataAvailable, setTransactionDataAvailability] = useState<boolean>(true);

  return (
    <PageLayout title="Transactions" navLink="/transactions/new">
      <Card
        className={cn(
          `h-full bg-muted border-0 shadow-none`,
          `${isTransactionDataAvailable ? `h-full` : `h-screen`}`
        )}
      >
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <TransactionFilters setSearchValue={setSearchValue} />
          <TransactionCardsContainers
            searchValue={searchValue}
            setTransactionsDataAvailability={setTransactionDataAvailability}
          />
        </CardContent>
        <CardFooter
          className={cn(`justify-center`, `${isTransactionDataAvailable ? `flex` : `hidden`}`)}
        >
          <TransactionsPaginationContainer />
        </CardFooter>
      </Card>
    </PageLayout>
  );
};

export default TransactionsPage;
