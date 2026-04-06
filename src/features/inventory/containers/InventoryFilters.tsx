import { FiltersDropdown } from '@/shared/components';
import { SearchInput } from '@/shared/components';
import { useStatusFilterQuery } from '../hooks/useStatusFilterQuery';

const status = [
  { id: 1, name: 'All' },
  { id: 2, name: 'InStock' },
  { id: 3, name: 'LowStock' },
  { id: 4, name: 'OutOfStock' },
];

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const InventoryFilters = ({ setSearchValue }: Props) => {
  const { status: statusValue, setFilters } = useStatusFilterQuery();

  return (
    <div className="flex justify-between">
      <SearchInput setState={setSearchValue} />
      <div className="flex gap-3 items-center">
        <p className="font-medium">Status</p>
        <FiltersDropdown
          state={statusValue}
          states={status}
          applyFilter={setFilters}
          type="status"
        />
      </div>
    </div>
  );
};

export default InventoryFilters;
