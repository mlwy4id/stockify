import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useReportsFilterQueryNavigation } from '@/hooks/reports/useReportsFilterQueryNavigation';
import { Months } from '@/constant/months';
import { Years } from '@/constant/years';

type Props = {
  yearValue: number | undefined;
  monthValue: string | undefined;
  setYearValue: (yearValue: number | undefined) => void;
  setMonthValue: (monthValue: string | undefined) => void;
};

const ReportsFilterDropdown = ({ yearValue, monthValue, setYearValue, setMonthValue }: Props) => {
  const applyFilter = useReportsFilterQueryNavigation();

  return (
    <div className="flex gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-white px-3 py-1 shadow-sm rounded-md flex justify-between gap-1 items-center font-medium min-w-32">
          {monthValue} <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="h-48" align="start">
          {Months.map((m) => (
            <DropdownMenuItem
              onClick={() => {
                setMonthValue(m.name);
                applyFilter({ month: m.name });
              }}
              key={m.id}
            >
              {m.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="bg-white px-3 py-1 shadow-sm rounded-md flex justify-between gap-1 items-center font-medium min-w-32">
          {yearValue} <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="h-48" align="start">
          {Years.map((y, i) => (
            <DropdownMenuItem
              onClick={() => {
                setYearValue(y);
                applyFilter({ year: y });
              }}
              key={i}
            >
              {y}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReportsFilterDropdown;
