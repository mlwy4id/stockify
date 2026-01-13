import PageLayout from '../layout/PageLayout';
import { Button } from '@/components/ui/button';
import { LuPlus } from 'react-icons/lu';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';
import TransactionsTableContainer from '@/containers/table/TransactionsTableContainer';

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
      <Card className="h-screen">
        <CardContent className="h-full">
          <TransactionsTableContainer />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TransactionsPage;
