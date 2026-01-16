import z from 'zod';
import { CreateTransactionSchema, UpdateTransactionSchema } from '@stockify/schema';

type TransactionType = z.infer<typeof CreateTransactionSchema>['type'];

export type Transaction = {
  id: string;
  type: TransactionType;
  quantity: string;
  createdAt: Date;
  item: {
    id: string;
    name: string;
  };
};

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;

export type UpdateTransactionRequest = {
  id?: string;
  transaction: UpdateTransaction;
};
