import FiltersDropdown from '@/components/filters/FiltersDropdown';
import { useActionFilterQuery } from '@/hooks/transactions/useActionFilterQueryNavigation';

const action = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Sold' },
  { id: 3, name: 'Restock' },
];

type Props = {
  actionValue: string;
  setactionValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const TransactionFilters = ({ actionValue, setactionValue, setSearchValue }: Props) => {
  const applyActionFilter = useActionFilterQuery();

  return (
    <div className="flex justify-between">
      <div className="flex gap-3 items-center">
        <p className="font-medium">Action</p>
        <FiltersDropdown
          state={actionValue}
          states={action}
          setState={setactionValue}
          type="action"
          applyFilter={applyActionFilter}
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
