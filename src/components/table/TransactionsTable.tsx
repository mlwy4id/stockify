import type { Transaction } from '@stockify/schema';
import { LuEllipsisVertical } from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

type Props = {
  transactions: Transaction[];
  openEditModal?: (id: string) => void;
  openDeleteModal?: (id: string) => void;
};

const TransactionsTable = ({ transactions, openEditModal, openDeleteModal }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4 font-semibold">Item Name</th>
          <th className="text-left py-3 px-4 font-semibold">Type</th>
          <th className="text-left py-3 px-4 font-semibold">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="hover:bg-slate-50 cursor-pointer group">
            <td className="py-3 px-4">{transaction.itemId}</td>
            <td className="py-3 px-4">{transaction.type}</td>
            <td className="py-3 px-4">{transaction.quantity}</td>

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
                  <DropdownMenuItem onClick={() => openEditModal(transaction.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openDeleteModal(transaction.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
