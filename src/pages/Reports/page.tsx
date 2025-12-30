import ReportsSummaryCard from '@/containers/card/ReportsSummaryCard';
import PageLayout from '../layout/PageLayout';
import ReportsRecentActivityCard from '@/containers/card/ReportsRecentActivityCard';

const Reports = () => {
  return (
    <PageLayout title={'Reports'}>
      <ReportsSummaryCard />
      <ReportsRecentActivityCard />
    </PageLayout>
  );
};

export default Reports;
