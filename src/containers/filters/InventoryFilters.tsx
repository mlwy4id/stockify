import FiltersDropdown from '@/components/filters/FiltersDropdown';
import SearchInput from '@/components/filters/SearchInput';
import { useInventoryFilterQuery } from '@/hooks/inventory/useInventoryFilterQuery';

const status = [
  { id: 1, name: 'All' },
  { id: 2, name: 'In Stock' },
  { id: 3, name: 'Low Stock' },
  { id: 4, name: 'Out of Stock' },
];

type Props = {
  statusValue: string;
  setStatusValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const InventoryFilters = ({ statusValue, setStatusValue, setSearchValue }: Props) => {
  const applyStatusFilter = useInventoryFilterQuery();

  return (
    <div className="flex justify-between">
      <SearchInput setState={setSearchValue} />
      <FiltersDropdown
        state={statusValue}
        states={status}
        setState={setStatusValue}
        applyFilter={applyStatusFilter}
        type="status"
      />
    </div>
  );
};

export default InventoryFilters;
