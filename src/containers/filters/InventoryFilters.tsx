import FiltersDropdown from '@/components/FiltersDropdown';
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
};

const InventoryFilters = ({ statusValue, setStatusValue }: Props) => {
  const applyStatusFilter = useInventoryFilterQuery();

  return (
    <div>
      <FiltersDropdown
        state={statusValue}
        states={status}
        setState={setStatusValue}
        applyFilter={applyStatusFilter}
        type='status'
      />
    </div>
  );
};

export default InventoryFilters;
