import PageLayout from '../layout/PageLayout';
import { Button } from '@/components/ui/button';
import { LuPlus } from 'react-icons/lu';
import { Card, CardContent } from '@/components/ui/card';
import TransactionForm from '@/components/form/TransactionForm';

const TransactionsPage = () => {
  return (
    <PageLayout
      title="Transactions"
      button={
        <Button className="bg-blue-600 hover:bg-blue-500">
          <LuPlus />
          Add Transaction
        </Button>
      }
    >
      <Card className="h-screen">
        <CardContent className="h-full">
          <TransactionForm />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TransactionsPage;
