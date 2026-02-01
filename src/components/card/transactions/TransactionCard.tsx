import { dateFormatter } from '@/lib/formatters/dateFormatter';
import { nameFormatter } from '@/lib/formatters/nameFormatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { LuEllipsisVertical } from 'react-icons/lu';

type Props = {
  id: string;
  name: string;
  quantity: string;
  action: string;
  date: Date;
  openEditModal: (id: string) => void;
  openDeleteModal: (id: string) => void;
};

const TransactionCard = ({
  id,
  name,
  quantity,
  action,
  date,
  openEditModal,
  openDeleteModal,
}: Props) => {
  const isSold = action === 'Sold';

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-gray-900">{nameFormatter(name)}</span>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            {isSold ? '-' : '+'}
            {quantity} items
          </span>
          <span>•</span>
          <span>{dateFormatter(date)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium text-white min-w-16 text-center
              ${isSold ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {action}
        </div>

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

export default TransactionCard;
