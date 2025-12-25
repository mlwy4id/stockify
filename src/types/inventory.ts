import type { CreateItemSchema, UpdateItemSchema } from '@/schemas/inventorySchema';
import type z from 'zod';

export type Item = {
  id: string;
  name: string;
  quantity: string;
};
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
