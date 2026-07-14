import TransactionsPage from '@/features/transactions/pages/page';

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TransactionsPage />
      {children}
    </>
  );
}
