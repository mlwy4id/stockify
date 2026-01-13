import { UpdateTransactionSchema } from '@stockify/schema';
import type { Transaction, UpdateTransaction } from 'src/types/transaction.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useEditTransactionForm = (transaction: Transaction) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTransaction>({
    resolver: zodResolver(UpdateTransactionSchema),
    defaultValues: {
      type: transaction?.type,
      quantity: Number(transaction?.quantity),
      itemId: transaction?.item.id,
      previousItemId: transaction?.item.id,
    },
  });

  return { register, handleSubmit, reset, errors };
};
