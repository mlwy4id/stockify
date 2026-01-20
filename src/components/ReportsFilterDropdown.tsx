import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useReportsFilterQueryNavigation } from '@/hooks/reports/useReportsFilterQueryNavigation';
import { Months } from '@/constant/month';

type Props = {
  monthValue: string | undefined;
  setMonthValue: (monthValue: string | undefined) => void;
};

const ReportsFilterDropdown = ({ monthValue, setMonthValue }: Props) => {
  const applyFilter = useReportsFilterQueryNavigation();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-white px-3 py-1 shadow-sm rounded-md flex justify-between gap-1 items-center font-medium min-w-32">
          {monthValue} <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="h-48" align="start">
          {Months.map((m) => (
            <DropdownMenuItem
              onClick={() => {
                setMonthValue(m.name);
                applyFilter(`${m.name}`);
              }}
              key={m.id}
            >
              {m.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReportsFilterDropdown;
