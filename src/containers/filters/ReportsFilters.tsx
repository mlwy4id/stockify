import FiltersDropdown from '@/components/filters/FiltersDropdown';
import { useReportsFilterQuery } from '@/hooks/reports/useReportsFilterQuery';
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
