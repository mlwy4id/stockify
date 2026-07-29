'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent } from '@/shared/components/ui/card';
import TransactionCardsContainers from '@/features/transactions/containers/TransactionsCardsContainer';
import TransactionFilters from '@/features/transactions/containers/TransactionsFilters';
import CreateTransactionForm from '@/features/transactions/containers/CreateTransactionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

export default function TransactionsPage() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isTransactionDataAvailable, setTransactionDataAvailability] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <PageLayout title="Transactions" onAddClick={() => setDialogOpen(true)}>
      <Card
        className={cn(
          'bg-muted border-0 shadow-none',
          isTransactionDataAvailable ? 'h-full' : 'h-screen'
        )}
      >
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <TransactionFilters setSearchValue={setSearchValue} />
          <TransactionCardsContainers
            searchValue={searchValue}
            setTransactionsDataAvailability={setTransactionDataAvailability}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
          </DialogHeader>
          <CreateTransactionForm
            onSuccess={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
