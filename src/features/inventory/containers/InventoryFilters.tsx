import {FiltersDropdown} from '@/shared/components';
import {SearchInput} from '@/shared/components';
import { useStatusFilterQuery } from '../hooks/useStatusFilterQueryNavigation';

const status = [
  { id: 1, name: 'All' },
  { id: 2, name: 'In Stock' },
  { id: 3, name: 'Low Stock' },
  { id: 4, name: 'Out of Stock' },
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
