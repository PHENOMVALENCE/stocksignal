import { z } from "zod";

import { inventoryItemIdSchema } from "./inventory";
import { internationalPhoneSchema } from "./phone";
import { positiveQuantitySchema } from "./quantity";

export const restockRequestSchema = z.object({
  inventoryItemId: inventoryItemIdSchema,
  requestedQuantity: positiveQuantitySchema("Requested quantity"),
  supplierName: z.string().trim().min(1, "Supplier name is required.").max(120, "Supplier name must be 120 characters or fewer."),
  supplierPhone: internationalPhoneSchema,
  unit: z.string().trim().min(1, "Unit is required.").max(32, "Unit must be 32 characters or fewer."),
  submissionKey: z.string().trim().min(8).max(80).optional(),
});

export type RestockRequestValues = z.infer<typeof restockRequestSchema>;
