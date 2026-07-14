'use client';
import { Button } from '@/shared/components/ui/button';
import FiltersDropdown from '@/shared/components/filters/FiltersDropdown';
import SearchInput from '@/shared/components/filters/SearchInput';
import { useActionFilterQuery } from '../hooks/useActionFilterQueryNavigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const action = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Sold' },
  { id: 3, name: 'Restock' },
];

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const TransactionFilters = ({ setSearchValue }: Props) => {
  const { action: actionValue, date, setFilters } = useActionFilterQuery();

  const selectedDate = date ? new Date(date) : new Date();

  return (
    <div className="flex justify-between">
      <SearchInput setState={setSearchValue} />
      <div className="flex gap-3 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-40 justify-start text-left font-normal bg-white',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(newDate) => {
                if (newDate) {
                  const isoDate = format(newDate, 'yyyy-MM-dd');
                  setFilters({ date: isoDate });
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <FiltersDropdown
          state={actionValue}
          states={action}
          type="action"
          applyFilter={setFilters}
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
