import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageLayout from '../layout/PageLayout';
import ReportsTableContainer from '@/containers/table/ReportsTableContainer';
import ReportsFilterDropdown from '@/components/ReportsFilterDropdown';
import { useState } from 'react';
import { useGetCurrentMonthAndYear } from '@/hooks/reports/useGetCurrentMonthAndYear';

const Reports = () => {
  const { currentMonthName, currentYear } = useGetCurrentMonthAndYear();

  const [month, setMonth] = useState<string | undefined>(currentMonthName);
  const [year, setYear] = useState<number | undefined>(currentYear);

  return (
    <PageLayout title={'Monthly Reports'}>
      <ReportsFilterDropdown
        yearValue={year}
        monthValue={month}
        setYearValue={setYear}
        setMonthValue={setMonth}
      />

      <Card className="h-screen">
        <CardHeader className="font-semibold text-md">
          <h1>
            Report Summary — {month} {year}
          </h1>
        </CardHeader>
        <CardContent className="h-full overflow-x-scroll">
          <ReportsTableContainer monthValue={month} yearValue={String(year)} />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Reports;
