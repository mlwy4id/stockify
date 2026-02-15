import {PageLayout} from '@/shared/components';
import { Button } from '@/shared/components';
import { LuPlus } from 'react-icons/lu';
import { Card, CardContent, CardFooter } from '@/shared/components';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';
import TransactionCardsContainers from '../containers/TransactionsCardsContainer';
import TransactionFilters from '../containers/TransactionsFilters';
import { useState } from 'react';
import {Pagination} from '@/shared/components';
import { useActionFilterQuery } from '../hooks/useActionFilterQueryNavigation';
import { useGetAllTransactions } from '../hooks/queries/transactions.query';
import TransactionsCardsSkeleton from '../components/TransactionsCardsSkeleton';

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
