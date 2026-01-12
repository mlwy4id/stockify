import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateTransactionSchema } from '@stockify/schema';
import type { CreateTransaction } from '@/types/transaction.type';

export const useCreateTransactionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransaction>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type: undefined,
      quantity: 0,
      itemId: '',
    },
  });

  return { register, handleSubmit, errors };
};
