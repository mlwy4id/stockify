import z from "zod";
import { CreateItemSchema, UpdateItemSchema } from "@stockify/schema";

export type Item = {
  id: string;
  name: string;
  initQuantity?: string;
  currentQuantity?: string;
};

export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;

export type UpdateItemRequest = {
  id?: string;
  item: UpdateItem;
};
