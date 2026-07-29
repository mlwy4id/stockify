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
  const { action: actionValue, setFilters } = useActionFilterQuery();

  return (
    <div className="flex justify-between">
      <SearchInput setState={setSearchValue} />
      <FiltersDropdown state={actionValue} states={action} type="action" applyFilter={setFilters} />
    </div>
  );
};

export default TransactionFilters;
