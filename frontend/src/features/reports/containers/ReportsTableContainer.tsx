'use client';
import EmptyReportsTable from '../components/EmptyReportsTable';
import ReportsTable from '../components/ReportsTable';
import TableSkeleton from '@/shared/components/TableSkeleton';
import { useGetReportsData } from '../hooks/queries/reports.query';
import { useReportsFilterQuery } from '../hooks/useReportsFilterQuery';

const ReportsTableContainer = () => {
  const { month: monthValue, year: yearValue } = useReportsFilterQuery();

  const { isLoading, data: reports } = useGetReportsData(monthValue, yearValue);

  if (isLoading) return <TableSkeleton />;
  if (reports.length === 0) return <EmptyReportsTable />;

  return <ReportsTable reportsData={reports} />;
};

export default ReportsTableContainer;
