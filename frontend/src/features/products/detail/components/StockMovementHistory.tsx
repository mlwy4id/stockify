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
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { useGetStockMovementsByProduct } from '@/features/transactions/hooks/queries/stock-movement.query';
import ActionBadge from '@/features/transactions/components/ActionBadge';
import type { StockMovement, StockMovementAction } from '@/shared/types/stock-movement.type';

type Props = {
  productId: string;
};

const quantityColor: Record<StockMovementAction, string> = {
  RESTOCK: 'text-success',
  REFUND: 'text-success',
  SOLD: 'text-danger',
  BROKEN: 'text-danger',
};

const StockMovementHistory = ({ productId }: Props) => {
  const { isLoading, data } = useGetStockMovementsByProduct(productId);
  const movements: StockMovement[] = data ?? [];

  return (
    <Card>
      <CardHeader className="font-semibold border-b">
        <h2>Riwayat Pergerakan Stok</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="border border-border bg-background shadow-sm overflow-hidden rounded-md">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead>Aksi</TableHead>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    Tidak ada riwayat pergerakan stok
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((m) => {
                  const isIn = m.action === 'RESTOCK' || m.action === 'REFUND';
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
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
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockMovementHistory;
