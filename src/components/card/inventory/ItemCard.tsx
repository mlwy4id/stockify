import { nameFormatter } from '@/lib/formatters/nameFormatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { LuEllipsisVertical } from 'react-icons/lu';

const statusVariants: Record<string, string> = {
  'In Stock': 'bg-green-500',
  'Low Stock': 'bg-yellow-500',
  'Out of Stock': 'bg-red-500',
};

type Props = {
  id: string;
  name: string;
  currentStock: string | undefined;
  status: string;
  openEditModal: (id: string) => void;
  openDeleteModal: (id: string) => void;
};

const ItemCard = ({ id, name, currentStock, status, openEditModal, openDeleteModal }: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-gray-900">{nameFormatter(name)}</span>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Stock: {currentStock} items</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs text-white font-medium cursor-pointer
              ${statusVariants[status]}
            `}
        >
          {status}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <LuEllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-200 py-2 px-6 rounded-sm" align="end" side="left">
            <DropdownMenuItem onClick={() => openEditModal(id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDeleteModal(id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ItemCard;
