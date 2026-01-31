import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageLayout from '../layout/PageLayout';
import ReportsTableContainer from '@/containers/table/ReportsTableContainer';
import { useState } from 'react';
import { useGetCurrentMonthAndYear } from '@/hooks/reports/useGetCurrentMonthAndYear';
import ReportsFilters from '@/containers/filters/ReportsFilters';

const Reports = () => {
  const { currentMonthName, currentYear } = useGetCurrentMonthAndYear();

  const [month, setMonth] = useState<string>(currentMonthName);
  const [year, setYear] = useState<string>(currentYear);

  return (
    <PageLayout title={'Monthly Reports'}>
      <ReportsFilters
        yearValue={year}
        setYearValue={setYear}
        monthValue={month}
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
