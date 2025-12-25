import z from "zod";

export const CreateItemSchema = z
  .object({
    name: z.string().min(1, "Please provide item name!"),
    quantity: z
      .number("Provide only number for quantity!")
      .min(0, "Please provide non-negative number for quantity!"),
  })
  .strict();

export const UpdateItemSchema = CreateItemSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be updated"
);
