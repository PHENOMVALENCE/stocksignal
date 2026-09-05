import { fieldErrorsFromZod } from "@/lib/actions";
import { AppError, isAppError } from "@/lib/errors";
import { stockMovementSchema } from "@/lib/validation/inventory";
import type { AppliedStockMovement } from "@/repositories/stock-rpc";
import { stockRpc } from "@/repositories/stock-rpc";

export interface RecordStockMovementResult {
  movement?: AppliedStockMovement;
  fieldErrors?: Record<string, string>;
  message?: string;
}

export async function recordStockMovement(
  input: unknown,
  rpc?: { applyMovement: ReturnType<typeof stockRpc>["applyMovement"] },
): Promise<RecordStockMovementResult> {
  const parsed = stockMovementSchema.safeParse(input);

  if (!parsed.success) {
    return {
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Check the highlighted fields and try again.",
    };
  }

  try {
    const movement = await (rpc ?? stockRpc()).applyMovement({
      inventoryItemId: parsed.data.inventoryItemId,
      type: parsed.data.type,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes,
    });

    return { movement };
  } catch (error) {
    if (isAppError(error) && (error.code === "NEGATIVE_BALANCE" || error.code === "VALIDATION" || error.code === "NOT_FOUND")) {
      return { message: error.message };
    }

    if (error instanceof Error && error.message.startsWith("Supabase is not configured")) {
      return { message: "Supabase is not configured. The movement was not recorded." };
    }

    throw new AppError("The stock movement could not be recorded.", "DATABASE", 500);
  }
}
