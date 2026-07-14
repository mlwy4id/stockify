'use client';
import FiltersDropdown from '@/shared/components/filters/FiltersDropdown';
import { useReportsFilterQuery } from '../hooks/useReportsFilterQuery';
import { Months } from '@/shared/constants/months';
import { Years } from '@/shared/constants/years';

const ReportsFilters = () => {
  const { month: monthValue, year: yearValue, setFilters } = useReportsFilterQuery();

  return (
    <div className="flex gap-3">
      <FiltersDropdown state={monthValue} states={Months} applyFilter={setFilters} type="month" />
      <FiltersDropdown state={yearValue} states={Years} applyFilter={setFilters} type="year" />
    </div>
  );
};

export default ReportsFilters;
