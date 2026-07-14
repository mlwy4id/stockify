import { useRouter } from 'next/navigation';

export const useTransactionPathNavigation = () => {
  const router = useRouter();

  return {
    toTransaction: () => router.push('/transactions'),
    toCreateTransaction: () => router.push('/transactions/new'),
    toEditTransaction: (id: string) => router.push(`/transactions/${id}/edit`),
    toDeleteTransaction: (id: string) => router.push(`/transactions/${id}/delete`),
  };
};
