import EmptyReportsTable from '@/components/table/reports/EmptyReportsTable';
import ReportsTable from '@/components/table/reports/ReportsTable';
import TableSkeleton from '@/components/table/TableSkeleton';
import { useGetReportsData } from '@/hooks/queries/reports.query';

type Props = {
  yearValue: string | undefined;
  monthValue: string | undefined;
};

const ReportsTableContainer = ({ monthValue, yearValue }: Props) => {
  const { isLoading, data: reports } = useGetReportsData(monthValue, yearValue);

  if (isLoading) return <TableSkeleton />;
  if (reports.length === 0) return <EmptyReportsTable />;

  return <ReportsTable reportsData={reports} />;
};

export default ReportsTableContainer;
