import z from 'zod';
import { CreateItemSchema, UpdateItemSchema } from '@stockify/schema';
import type { Unit } from '@/shared/types/unit.type';

export type Item = {
  id: string;
  name: string;
  initStock?: string;
  currentStock?: string;
  status: string;
  unitId: string;
  unit: Unit;
};

export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;

export type UpdateItemRequest = {
  id?: string;
  item: UpdateItem;
};
