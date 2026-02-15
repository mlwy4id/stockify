import { FiltersDropdown } from '@/shared/components';
import { useReportsFilterQuery } from '../hooks/useReportsFilterQuery';
import { Months } from '@/constant/months';
import { Years } from '@/constant/years';

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
