import FiltersDropdown from '@/components/FiltersDropdown';
import { useReportsFilterQuery } from '@/hooks/reports/useReportsFilterQuery';
import { Months } from '@/constant/months';
import { Years } from '@/constant/years';

type Props = {
  yearValue: string;
  monthValue: string;
  setYearValue: React.Dispatch<React.SetStateAction<string>>;
  setMonthValue: React.Dispatch<React.SetStateAction<string>>;
};

const ReportsFilters = ({ monthValue, yearValue, setMonthValue, setYearValue }: Props) => {
  const applyReportsFilter = useReportsFilterQuery();

  return (
    <div className="flex gap-3">
      <FiltersDropdown
        state={monthValue}
        states={Months}
        setState={setMonthValue}
        applyFilter={applyReportsFilter}
        type='month'
      />
      <FiltersDropdown
        state={yearValue}
        states={Years}
        setState={setYearValue}
        applyFilter={applyReportsFilter}
        type='year'
      />
    </div>
  );
};

export default ReportsFilters;
