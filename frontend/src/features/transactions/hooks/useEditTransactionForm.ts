import { UpdateTransactionSchema } from '@stockify/schema';
import type { Transaction } from '@/shared/types/transaction.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type z from 'zod';

type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;

export const useEditTransactionForm = (transaction: Transaction) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTransaction>({
    resolver: zodResolver(UpdateTransactionSchema),
    defaultValues: {
      action: transaction?.action,
      quantity: Number(transaction?.quantity),
      itemId: transaction?.item.id,
      previousItemId: transaction?.item.id,
    },
  });

  return { register, handleSubmit, reset, errors };
};
