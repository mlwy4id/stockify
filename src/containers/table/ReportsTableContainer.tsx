import ReportsTable from '@/components/table/ReportsTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetReportsData } from '@/hooks/queries/reports.query';

type Props = {
  monthValue: string | undefined;
};

const ReportsTableContainer = ({ monthValue }: Props) => {
  const { isLoading, data: reports } = useGetReportsData(monthValue);

  if (isLoading) return <Spinner />;
  return <ReportsTable reportsData={reports} />;
};

export default ReportsTableContainer;
