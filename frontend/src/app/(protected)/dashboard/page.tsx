'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import DashboardContainer from '@/features/dashboard/containers/DashboardContainer';

export default function DashboardPage() {
  return (
    <PageLayout title="Dashboard">
      <DashboardContainer />
    </PageLayout>
  );
}
