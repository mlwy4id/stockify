'use client';
import FiltersDropdown from '@/shared/components/filters/FiltersDropdown';
import SearchInput from '@/shared/components/filters/SearchInput';
import { useActionFilterQuery } from '../hooks/useActionFilterQueryNavigation';

const action = [
  { id: 1, name: 'All' },
  { id: 2, name: 'RESTOCK' },
  { id: 3, name: 'SOLD' },
  { id: 4, name: 'REFUND' },
  { id: 5, name: 'BROKEN' },
];

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const TransactionFilters = ({ setSearchValue }: Props) => {
  const { action: actionValue, date: currentDate, setFilters } = useActionFilterQuery();

  return (
    <div className="flex justify-between items-center gap-2">
      <SearchInput setState={setSearchValue} />
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={currentDate}
          onChange={(e) => setFilters({ date: e.target.value })}
          className="bg-white px-3 py-1 shadow-sm rounded-md text-sm font-medium border-0 cursor-pointer"
        />
        <FiltersDropdown state={actionValue} states={action} type="action" applyFilter={setFilters} />
      </div>
    </div>
  );
};

export default TransactionFilters;
