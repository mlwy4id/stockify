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

const quantityColor: Record<StockMovementAction, string> = {
  RESTOCK: 'text-success',
  REFUND: 'text-success',
  SOLD: 'text-danger',
  BROKEN: 'text-danger',
};

const TransactionsTable = ({ movements }: Props) => {
  return (
    <div className="border border-border bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead>Produk</TableHead>
            <TableHead className="border-l-2 border-border pl-3">Aksi</TableHead>
            <TableHead className="border-l-2 border-border pl-3">Jumlah</TableHead>
            <TableHead className="border-l-2 border-border pl-3">Tanggal</TableHead>
            <TableHead className="border-l-2 border-border pl-3 hidden lg:table-cell">
              Sumber
            </TableHead>
            <TableHead className="border-l-2 border-border pl-3 hidden lg:table-cell">
              Alasan
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((m) => {
            const isIn = m.action === 'RESTOCK' || m.action === 'REFUND';
            return (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{nameFormatter(m.productName)}</TableCell>
                <TableCell className="border-l-2 border-border pl-3">
                  <ActionBadge action={m.action} />
                </TableCell>
                <TableCell
                  className={`border-l-2 border-border pl-3 ${quantityColor[m.action]} font-semibold`}
                >
                  {isIn ? '+' : '-'}
                  {m.quantity}
                </TableCell>
                <TableCell className="border-l-2 border-border pl-3 text-muted-foreground">
                  {dateFormatter(new Date(m.date))}
                </TableCell>
                <TableCell className="border-l-2 border-border pl-3 hidden lg:table-cell text-muted-foreground">
                  {m.source || '-'}
                </TableCell>
                <TableCell className="border-l-2 border-border pl-3 hidden lg:table-cell text-muted-foreground max-w-48 truncate">
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
