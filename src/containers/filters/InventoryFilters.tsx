import FiltersDropdown from '@/components/filters/FiltersDropdown';
import SearchInput from '@/components/filters/SearchInput';
import { useStatusFilterQuery } from '@/hooks/inventory/useStatusFilterQueryNavigation';

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
  const applyStatusFilter = useStatusFilterQuery();

  return (
    <div className="flex justify-between">
      <SearchInput setState={setSearchValue} />
      <div className="flex gap-3 items-center">
        <p className="font-medium">Status</p>
        <FiltersDropdown
          state={statusValue}
          states={status}
          setState={setStatusValue}
          applyFilter={applyStatusFilter}
          type="status"
        />
      </div>
    </div>
  );
};

export default InventoryFilters;
