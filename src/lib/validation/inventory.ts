import { z } from "zod";

import { internationalPhoneSchema, optionalInternationalPhoneSchema } from "./phone";
import { nonNegativeQuantitySchema, positiveQuantitySchema } from "./quantity";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const createInventoryItemSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(120, "Name must be 120 characters or fewer."),
    sku: z
      .string()
      .trim()
      .min(1, "SKU is required.")
      .max(64, "SKU must be 64 characters or fewer.")
      .regex(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, "SKU may contain letters, numbers, dots, hyphens, and underscores."),
    unit: z.string().trim().min(1, "Unit is required.").max(32, "Unit must be 32 characters or fewer."),
    quantity: nonNegativeQuantitySchema("Starting quantity"),
    reorderLevel: nonNegativeQuantitySchema("Reorder level"),
    managerPhone: internationalPhoneSchema,
    supplierName: optionalText.pipe(z.string().max(120, "Supplier name must be 120 characters or fewer.").optional()),
    supplierPhone: optionalInternationalPhoneSchema,
  })
  .superRefine((value, context) => {
    const hasName = Boolean(value.supplierName);
    const hasPhone = Boolean(value.supplierPhone);

    if (hasName !== hasPhone) {
      context.addIssue({
        code: "custom",
        path: hasName ? ["supplierPhone"] : ["supplierName"],
        message: "Supplier name and phone are both required when adding a supplier.",
      });
    }
  });

export type CreateInventoryItemValues = z.infer<typeof createInventoryItemSchema>;

export const inventoryItemIdSchema = z.uuid("Choose a valid inventory item.");

export const stockMovementSchema = z
  .object({
    inventoryItemId: inventoryItemIdSchema,
    type: z.enum(["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"], {
      error: "Choose stock in, stock out, or adjustment.",
    }),
    quantity: z.string(),
    notes: z
      .string()
      .trim()
      .max(280, "Notes must be 280 characters or fewer.")
      .optional()
      .transform((value) => (value ? value : undefined)),
  })
  .transform((value, context) => {
    const parsedQuantity =
      value.type === "ADJUSTMENT"
        ? nonNegativeQuantitySchema("Adjustment quantity").safeParse(value.quantity)
        : positiveQuantitySchema("Movement quantity").safeParse(value.quantity);

    if (!parsedQuantity.success) {
      context.addIssue({
        code: "custom",
        path: ["quantity"],
        message: parsedQuantity.error.issues[0]?.message ?? "Enter a valid quantity.",
      });
      return z.NEVER;
    }

    return {
      inventoryItemId: value.inventoryItemId,
      type: value.type,
      quantity: parsedQuantity.data,
      notes: value.notes,
    };
  });

export type StockMovementValues = z.infer<typeof stockMovementSchema>;
