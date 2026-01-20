import EmptyReportsTable from '@/components/table/reports/EmptyReportsTable';
import ReportsTable from '@/components/table/reports/ReportsTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetReportsData } from '@/hooks/queries/reports.query';

type Props = {
  monthValue: string | undefined;
};

const ReportsTableContainer = ({ monthValue }: Props) => {
  const { isLoading, data: reports } = useGetReportsData(monthValue);

  if (isLoading) return <Spinner />;
  if (reports.length === 0) return <EmptyReportsTable />;

  return <ReportsTable reportsData={reports} />;
};

export default ReportsTableContainer;
