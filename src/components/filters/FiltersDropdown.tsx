import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { FiltersParams } from '@/types/params.type';

interface filtersState {
  id: number;
  name: string;
}

type Props = {
  state: string;
  states: filtersState[];
  applyFilter: (params: FiltersParams) => void;
  type: keyof FiltersParams;
};

const FiltersDropdown = ({ state, states, applyFilter, type }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-white px-3 py-1 shadow-sm rounded-md flex justify-between gap-1 items-center font-medium min-w-36">
          {state} <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {states.map((s) => (
            <DropdownMenuItem onClick={() => applyFilter({ [type]: s.name })} key={s.id}>
              {s.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FiltersDropdown;
