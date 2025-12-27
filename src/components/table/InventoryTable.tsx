import type { Item } from '@/types/inventory';
import { LuEllipsisVertical } from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

type Props = {
  items: Item[];
  openEditModal: (id: string) => void;
};

const InventoryTable = ({ items, openEditModal }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Item Name</th>
          <th className="text-left py-3 px-4">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50 cursor-pointer group">
            <td className="py-3 px-4">{item.name}</td>
            <td className="py-3 px-4">{item.quantity}</td>

            <td>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <LuEllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-gray-200 py-2 px-6 rounded-sm"
                  align="end"
                  side="left"
                >
                  <DropdownMenuItem onClick={() => openEditModal(item.id)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;
