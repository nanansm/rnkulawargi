import { z } from "zod";
import { CATEGORIES, METHODS, USERS } from "./constants";

export const expenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform(Number)
    .pipe(z.number().positive("Amount must be positive")),
  category: z.enum(CATEGORIES, { message: "Pick a category" }),
  method: z.enum(METHODS, { message: "Pick a payment method" }),
  user: z.enum(USERS, { message: "Select a user" }),
  note: z.string().max(200, "Note too long").optional().default(""),
});

export type ExpenseInput = z.input<typeof expenseSchema>;
export type ExpenseData = z.output<typeof expenseSchema>;
