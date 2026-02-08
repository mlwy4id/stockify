import FiltersDropdown from '@/components/filters/FiltersDropdown';
import SearchInput from '@/components/filters/SearchInput';
import { useActionFilterQuery } from '@/hooks/transactions/useActionFilterQueryNavigation';

const action = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Sold' },
  { id: 3, name: 'Restock' },
];

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const TransactionFilters = ({ setSearchValue }: Props) => {
  const { action: actionValue, setFilters } = useActionFilterQuery();

  return (
    <div className="flex justify-between">
      <SearchInput setState={setSearchValue} />
      <div className="flex gap-3 items-center">
        <p className="font-medium">Action</p>
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
