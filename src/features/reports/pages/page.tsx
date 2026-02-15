import { Card, CardContent, CardHeader } from '@/shared/components';
import { PageLayout } from '@/shared/components';
import ReportsTableContainer from '../containers/ReportsTableContainer';
import ReportsFilters from '../containers/ReportsFilters';
import { useReportsFilterQuery } from '../hooks/useReportsFilterQuery';

const Reports = () => {
  const { month, year } = useReportsFilterQuery();
  return (
    <PageLayout title={'Monthly Reports'}>
      <ReportsFilters />
      <Card className="h-screen">
        <CardHeader className="font-semibold text-md">
          <h1>
            Report Summary — {month} {year}
          </h1>
        </CardHeader>
        <CardContent className="h-full overflow-x-scroll">
          <ReportsTableContainer />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Reports;
