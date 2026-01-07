import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateTransactionSchema, type CreateTransaction } from '@stockify/schema';

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
