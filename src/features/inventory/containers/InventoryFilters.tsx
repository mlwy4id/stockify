import { FiltersDropdown } from '@/shared/components';
import { SearchInput } from '@/shared/components';
import { useStatusFilterQuery } from '../hooks/useStatusFilterQuery';

const status = [
  { id: 1, name: 'All' },
  { id: 2, name: 'In_Stock' },
  { id: 3, name: 'Low_Stock' },
  { id: 4, name: 'Out_Of_Stock' },
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
