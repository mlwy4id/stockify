'use client';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { FiltersParams } from '@/shared/types/params.type';

interface filtersState {
  id: number;
  name: string;
  label?: string;
}

type Props = {
  state: string;
  states: filtersState[];
  applyFilter: (params: FiltersParams) => void;
  type: keyof FiltersParams;
};

const FiltersDropdown = ({ state, states, applyFilter, type }: Props) => {
  const currentLabel = states.find((s) => s.name === state)?.label ?? state;

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-background px-3 py-1 shadow-sm rounded-md flex justify-between gap-1 items-center font-medium min-w-36">
          {currentLabel} <ChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {states.map((s) => (
            <DropdownMenuItem onClick={() => applyFilter({ [type]: s.name })} key={s.id}>
              {s.label ?? s.name.split('_').join(' ')}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FiltersDropdown;
