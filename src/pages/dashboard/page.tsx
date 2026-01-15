import PageLayout from '../layout/PageLayout';
import DashboardContainer from '@/containers/dashboard/DashboardContainer';

const DashboardPage = () => {
  return (
    <PageLayout title="Dashboard">
      <DashboardContainer />
    </PageLayout>
  );
};

export default DashboardPage;
