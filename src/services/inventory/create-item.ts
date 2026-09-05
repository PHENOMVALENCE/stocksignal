import { AppError, isAppError } from "@/lib/errors";
import { fieldErrorsFromZod } from "@/lib/actions";
import { createInventoryItemSchema } from "@/lib/validation/inventory";
import { inventoryItemRepository } from "@/repositories/inventory-items";
import type { InventoryItem } from "@/repositories/mappers";

export interface CreateInventoryItemResult {
  item?: InventoryItem;
  fieldErrors?: Record<string, string>;
  message?: string;
}

export async function createInventoryItem(
  input: unknown,
  repository?: { create: ReturnType<typeof inventoryItemRepository>["create"] },
): Promise<CreateInventoryItemResult> {
  const parsed = createInventoryItemSchema.safeParse(input);

  if (!parsed.success) {
    return {
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Check the highlighted fields and try again.",
    };
  }

  try {
    const item = await (repository ?? inventoryItemRepository()).create({
      name: parsed.data.name,
      sku: parsed.data.sku,
      unit: parsed.data.unit,
      quantity: parsed.data.quantity,
      reorderLevel: parsed.data.reorderLevel,
      managerPhone: parsed.data.managerPhone,
      supplierName: parsed.data.supplierName ?? null,
      supplierPhone: parsed.data.supplierPhone ?? null,
    });

    return { item };
  } catch (error) {
    if (isAppError(error) && error.code === "SKU_DUPLICATE") {
      return {
        fieldErrors: { sku: error.message },
        message: error.message,
      };
    }

    if (isAppError(error) && error.code === "CONFIGURATION") {
      return { message: error.message };
    }

    if (error instanceof Error && error.message.startsWith("Supabase is not configured")) {
      return { message: "Supabase is not configured. Add the project URL and service-role key on the server." };
    }

    throw new AppError("The material could not be saved.", "DATABASE", 500);
  }
}
