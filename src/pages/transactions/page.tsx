import PageLayout from '../layout/PageLayout';
import { Button } from '@/components/ui/button';
import { LuPlus } from 'react-icons/lu';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';
import TransactionCardsContainers from '@/containers/card/transactions/TransactionsCardsContainer';
import TransactionFilters from '@/containers/filters/TransactionsFilters';
import { useState } from 'react';
import Pagination from '@/components/Pagination';
import { useActionFilterQuery } from '@/hooks/transactions/useActionFilterQueryNavigation';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import TransactionsCardsSkeleton from '@/components/skeleton/TransactionsCardsSkeleton';

const TransactionsPage = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { toCreateTransaction } = useTransactionPathNavigation();

  const { action: actionValue, date, page, setFilters } = useActionFilterQuery();
  const { isLoading, data } = useGetAllTransactions(actionValue, date, page);

  if (isLoading) return <TransactionsCardsSkeleton />;

  const { data: transactionsData, meta } = data;

  const setPageFilter = (num: number) => {
    setFilters({ page: num });
  };

  return (
    <PageLayout
      title="Transactions"
      button={
        <Button className="bg-blue-600 hover:bg-blue-500" onClick={toCreateTransaction}>
          <LuPlus />
          Add Transaction
        </Button>
      }
    >
      <Card className="h-full bg-muted border-0 shadow-none">
        <CardContent className="px-0 flex flex-col gap-2">
          <TransactionFilters setSearchValue={setSearchValue} />
          <TransactionCardsContainers
            searchValue={searchValue}
            transactionsData={transactionsData}
          />
        </CardContent>
        <CardFooter className="justify-center">
          <Pagination meta={meta} setPageFilter={setPageFilter} />
        </CardFooter>
      </Card>
    </PageLayout>
  );
};

export default TransactionsPage;
