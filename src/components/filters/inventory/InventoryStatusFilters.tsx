import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInventoryFilterQuery } from '@/hooks/inventory/useInventoryFilterQuery';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const status = [
  { id: 1, name: 'In Stock' },
  { id: 2, name: 'Low Stock' },
  { id: 3, name: 'Out of Stock' },
];

const InventoryStatusFilters = () => {
  const [statusValue, setStatusValue] = useState<string>('Choose status');
  const applyFilter = useInventoryFilterQuery();
  const navigate = useNavigate();

  return (
    <div className="bg-transparent grid grid-cols-2">
      <div className="flex gap-2">
        <Input type="text" placeholder="Search Item..." className="bg-white" />
        <Button className="bg-blue-600">Search</Button>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-white px-3 py-1 shadow-sm rounded-md flex justify-between gap-1 items-center font-medium min-w-36">
            {statusValue} <ChevronDown />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {status.map((m) => (
              <DropdownMenuItem
                onClick={() => {
                  setStatusValue(m.name);
                  applyFilter({ status: m.name.toLowerCase() });
                }}
                key={m.id}
              >
                {m.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setStatusValue('Choose status');
            navigate('/inventory');
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default InventoryStatusFilters;
