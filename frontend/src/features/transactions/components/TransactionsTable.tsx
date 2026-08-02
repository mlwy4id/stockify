'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { dateFormatter } from '@/shared/lib/formatters/dateFormatter';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import ActionBadge from '../components/ActionBadge';
import type { StockMovementAction } from '@/shared/types/stock-movement.type';

type MovementRow = {
  id: string;
  productName: string;
  quantity: number;
  action: StockMovementAction;
  date: string;
  source?: string;
  reason?: string;
};

type Props = {
  movements: MovementRow[];
};

const TransactionsTable = ({ movements }: Props) => {
  return (
    <div className="border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead className="border-l-2 border-gray-200 pl-3">Action</TableHead>
            <TableHead className="border-l-2 border-gray-200 pl-3">Quantity</TableHead>
            <TableHead className="border-l-2 border-gray-200 pl-3">Date</TableHead>
            <TableHead className="border-l-2 border-gray-200 pl-3 hidden lg:table-cell">Source</TableHead>
            <TableHead className="border-l-2 border-gray-200 pl-3 hidden lg:table-cell">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((m) => {
            const isIn = m.action === 'RESTOCK' || m.action === 'REFUND';
            return (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{nameFormatter(m.productName)}</TableCell>
                <TableCell className="border-l-2 border-gray-200 pl-3">
                  <ActionBadge action={m.action} />
                </TableCell>
                <TableCell
                  className={`border-l-2 border-gray-200 pl-3 ${
                    isIn ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                  }`}
                >
                  {isIn ? '+' : '-'}
                  {m.quantity}
                </TableCell>
                <TableCell className="border-l-2 border-gray-200 pl-3 text-muted-foreground">
                  {dateFormatter(new Date(m.date))}
                </TableCell>
                <TableCell className="border-l-2 border-gray-200 pl-3 hidden lg:table-cell text-muted-foreground">
                  {m.source || '-'}
                </TableCell>
                <TableCell className="border-l-2 border-gray-200 pl-3 hidden lg:table-cell text-muted-foreground max-w-48 truncate">
                  {m.reason || '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
