import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageLayout from '../layout/PageLayout';
import ReportsTableContainer from '@/containers/table/ReportsTableContainer';
import ReportsFilterDropdown from '@/components/ReportsFilterDropdown';
import { useState } from 'react';
import { useGetCurrentMonth } from '@/hooks/reports/useGetCurrentMonth';

const Reports = () => {
  const currentMonth = useGetCurrentMonth();
  const [month, setMonth] = useState<string | undefined>(currentMonth);

  return (
    <PageLayout title={'Monthly Reports'}>
      <ReportsFilterDropdown setMonthValue={setMonth} />
      <Card className="h-screen">
        <CardHeader className="font-semibold">
          <h1>{month}</h1>
        </CardHeader>
        <CardContent className="h-full">
          <ReportsTableContainer monthValue={month} />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Reports;
