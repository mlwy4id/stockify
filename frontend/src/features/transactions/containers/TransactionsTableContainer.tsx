'use client';
import TransactionsTable from '../components/TransactionsTable';
import SearchNotFound from '@/shared/components/filters/SearchNotFound';
import EmptyTransactionCard from '../components/EmptyTransactionTable';
import TransactionsCardsSkeleton from '../components/TransactionsTableSkeleton';
import { useGetProducts } from '@/features/products/hooks/queries/product.query';
import { useQueries } from '@tanstack/react-query';
import { getStockMovementsByProduct } from '@/shared/lib/api/stock-movement.api';
import { useEffect, useMemo } from 'react';
import type { StockMovement } from '@/shared/types/stock-movement.type';
import type { Product } from '@/shared/types/product.type';
import type { UseQueryResult } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

type MovementWithProduct = StockMovement & { productName: string };

type Props = {
  searchValue: string;
  setTransactionsDataAvailability: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransactionCardsContainers = ({ searchValue, setTransactionsDataAvailability }: Props) => {
  const searchParams = useSearchParams();
  const actionFilter = searchParams.get('action') ?? 'All';
  const dateFilter = searchParams.get('date') ?? new Date().toISOString();

  const { isLoading: productsLoading, data: products } = useGetProducts();

  const productIds = useMemo(() => (products ?? []).map((p: Product) => p.id), [products]);

  const movementResults = useQueries({
    queries: productIds.map((id: string) => ({
      queryKey: ['StockMovements', id],
      queryFn: () => getStockMovementsByProduct(id),
      enabled: productIds.length > 0,
    })),
  }) as UseQueryResult<StockMovement[]>[];

  const isLoading = productsLoading || movementResults.some((r) => r.isLoading);

  const allMovements: MovementWithProduct[] = useMemo(() => {
    const movements: MovementWithProduct[] = [];
    movementResults.forEach((result: UseQueryResult<StockMovement[]>, index: number) => {
      if (result.data) {
        const productName = products?.[index]?.name ?? '';
        result.data.forEach((m: StockMovement) => {
          movements.push({ ...m, productName });
        });
      }
    });
    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movementResults, products]);

  useEffect(() => {
    setTransactionsDataAvailability(allMovements.length > 0);
  }, [allMovements]);

  if (isLoading) return <TransactionsCardsSkeleton />;
  if (allMovements.length === 0 && searchParams.toString() === '') return <EmptyTransactionCard />;
  if (allMovements.length === 0) return <SearchNotFound message="No transactions found" />;

  const filteredMovements = allMovements.filter((m) => {
    const matchesSearch = m.productName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesAction = actionFilter === 'All' || m.action === actionFilter;
    const matchesDate = !dateFilter || m.date.startsWith(dateFilter);
    return matchesSearch && matchesAction && matchesDate;
  });

  if (filteredMovements.length === 0) return <SearchNotFound message="No transactions found" />;

  return (
    <section className="flex-1 min-h-0 overflow-y-auto pb-20">
      <TransactionsTable movements={filteredMovements} />
    </section>
  );
};

export default TransactionCardsContainers;
