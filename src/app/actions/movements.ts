"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/actions";
import { toUserMessage } from "@/lib/errors";
import { recordStockMovement } from "@/services/inventory/record-movement";

export async function recordStockMovementAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const result = await recordStockMovement({
      inventoryItemId: String(formData.get("inventoryItemId") ?? ""),
      type: String(formData.get("type") ?? ""),
      quantity: String(formData.get("quantity") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    });

    if (!result.movement) {
      return {
        status: "error",
        message: result.message ?? "The stock movement could not be recorded.",
        fieldErrors: result.fieldErrors,
      };
    }

    revalidatePath("/inventory");
    revalidatePath(`/inventory/${result.movement.movementId}`);
    revalidatePath(`/inventory/${String(formData.get("inventoryItemId") ?? "")}`);

    return {
      status: "success",
      message: `Balance updated from ${result.movement.previousQuantity} to ${result.movement.newQuantity}.`,
    };
  } catch (error) {
    return {
      status: "error",
      message: toUserMessage(error, "The stock movement could not be recorded."),
    };
  }
}
