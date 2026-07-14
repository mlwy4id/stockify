'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import DashboardContainer from '../containers/DashboardContainer';

const DashboardPage = () => {
  return (
    <PageLayout title="Dashboard">
      <DashboardContainer />
    </PageLayout>
  );
};

export default DashboardPage;
