import { PageLayout } from '@/shared/components';
import { Card, CardContent, CardFooter } from '@/shared/components';
import TransactionCardsContainers from '../containers/TransactionsCardsContainer';
import TransactionFilters from '../containers/TransactionsFilters';
import { useState } from 'react';
import { Pagination } from '@/shared/components';
import { useActionFilterQuery } from '../hooks/useActionFilterQueryNavigation';
import { useGetAllTransactions } from '../hooks/queries/transactions.query';
import TransactionsCardsSkeleton from '../components/TransactionsCardsSkeleton';
import { cn } from '@/shared/lib';

const TransactionsPage = () => {
  const [searchValue, setSearchValue] = useState<string>('');

  const { action: actionValue, date, page, setFilters } = useActionFilterQuery();
  const { isLoading, data } = useGetAllTransactions(actionValue, date, page);

  if (isLoading) return <TransactionsCardsSkeleton />;

  const { data: transactionsData, meta } = data;

  const setPageFilter = (num: number) => {
    setFilters({ page: num });
  };

  const isTransactionDataAvailable = transactionsData.length > 0;

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
            transactionsData={transactionsData}
          />
        </CardContent>
        <CardFooter
          className={cn(`justify-center`, `${isTransactionDataAvailable ? `flex` : `hidden`}`)}
        >
          <Pagination meta={meta} setPageFilter={setPageFilter} />
        </CardFooter>
      </Card>
    </PageLayout>
  );
};

export default TransactionsPage;
