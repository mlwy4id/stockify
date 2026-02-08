import EmptyReportsTable from '@/components/table/reports/EmptyReportsTable';
import ReportsTable from '@/components/table/reports/ReportsTable';
import TableSkeleton from '@/components/table/TableSkeleton';
import { useGetReportsData } from '@/hooks/queries/reports.query';
import { useReportsFilterQuery } from '@/hooks/reports/useReportsFilterQuery';

const ReportsTableContainer = () => {
  const { month: monthValue, year: yearValue } = useReportsFilterQuery();

  const { isLoading, data: reports } = useGetReportsData(monthValue, yearValue);

  if (isLoading) return <TableSkeleton />;
  if (reports.length === 0) return <EmptyReportsTable />;

  return <ReportsTable reportsData={reports} />;
};

export default ReportsTableContainer;
