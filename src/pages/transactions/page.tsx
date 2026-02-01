import PageLayout from '../layout/PageLayout';
import { Button } from '@/components/ui/button';
import { LuPlus } from 'react-icons/lu';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';
import TransactionCardsContainers from '@/containers/card/transactions/TransactionsCardsContainer';

const TransactionsPage = () => {
  const { toCreateTransaction } = useTransactionPathNavigation();

  return (
    <PageLayout
      title="Transactions"
      button={
        <Button className="bg-blue-600 hover:bg-blue-500" onClick={toCreateTransaction}>
          <LuPlus />
          Add Transaction
        </Button>
      }
    >
      <Card className="h-screen bg-muted border-0 shadow-none">
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <TransactionCardsContainers />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TransactionsPage;
