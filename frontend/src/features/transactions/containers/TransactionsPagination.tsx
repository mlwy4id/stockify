'use client';
import { useGetAllTransactions } from '../hooks/queries/transactions.query';
import { useActionFilterQuery } from '../hooks/useActionFilterQueryNavigation';
import Pagination from '@/shared/components/Pagination';

const TransactionsPaginationContainer = () => {
  const { action: actionValue, date, page, setFilters } = useActionFilterQuery();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { isLoading, data } = useGetAllTransactions(actionValue, date, page, userTimezone);
  if (isLoading) return <></>;

  const { meta } = data;

  const setPageFilter = (num: number) => {
    setFilters({ page: num });
  };

  return <Pagination meta={meta} setPageFilter={setPageFilter} />;
};

export default TransactionsPaginationContainer;
