'use client';
import TransactionsTable from '../components/TransactionsTable';
import SearchNotFound from '@/shared/components/filters/SearchNotFound';
import EmptyTransactionTable from '../components/EmptyTransactionTable';
import TransactionsTableSkeleton from '../components/TransactionsTableSkeleton';
import { useGetAllStockMovements } from '../hooks/queries/stock-movement.query';
import { useEffect, useMemo } from 'react';
import type { StockMovement } from '@/shared/types/stock-movement.type';
import { useSearchParams } from 'next/navigation';
import getTodayDateInISOFormat from '@/shared/lib/getTodayDateInISOFormat';

type MovementWithProduct = StockMovement & { productName: string };

type Props = {
  searchValue: string;
  setTransactionsDataAvailability: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransactionCardsContainers = ({ searchValue, setTransactionsDataAvailability }: Props) => {
  const searchParams = useSearchParams();
  const actionFilter = searchParams.get('action') ?? 'All';
  const dateFilter = searchParams.get('date') ?? getTodayDateInISOFormat();

  const { data: allMovements, isLoading } = useGetAllStockMovements();

  const movementsWithProduct: MovementWithProduct[] = useMemo(() => {
    const movements: MovementWithProduct[] = (allMovements ?? []).map((m: StockMovement) => ({
      ...m,
      productName: m.productName ?? '',
    }));
    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allMovements]);

  useEffect(() => {
    setTransactionsDataAvailability(movementsWithProduct.length > 0);
  }, [movementsWithProduct]);

  if (isLoading) return <TransactionsTableSkeleton />;
  if (movementsWithProduct.length === 0 && searchParams.toString() === '')
    return <EmptyTransactionTable />;
  if (movementsWithProduct.length === 0)
    return <SearchNotFound message="Transaksi tidak ditemukan" />;

  const filteredMovements = movementsWithProduct.filter((m) => {
    const matchesSearch = m.productName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesAction = actionFilter === 'All' || m.action === actionFilter;
    const matchesDate = !dateFilter || m.date.startsWith(dateFilter);
    return matchesSearch && matchesAction && matchesDate;
  });

  if (filteredMovements.length === 0) return <SearchNotFound message="Transaksi tidak ditemukan" />;

  return (
    <section className="flex-1 min-h-0 overflow-y-auto pb-20">
      <TransactionsTable movements={filteredMovements} />
    </section>
  );
};

export default TransactionCardsContainers;
