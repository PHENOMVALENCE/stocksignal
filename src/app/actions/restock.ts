"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/actions";
import { toUserMessage } from "@/lib/errors";
import { requestRestock } from "@/services/inventory/request-restock";

export async function requestRestockAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const result = await requestRestock({
      inventoryItemId: String(formData.get("inventoryItemId") ?? ""),
      requestedQuantity: String(formData.get("requestedQuantity") ?? ""),
      supplierName: String(formData.get("supplierName") ?? ""),
      supplierPhone: String(formData.get("supplierPhone") ?? ""),
      unit: String(formData.get("unit") ?? ""),
    });

    if (!result.request) {
      return {
        status: "error",
        message: result.message ?? "The restock request could not be created.",
        fieldErrors: result.fieldErrors,
      };
    }

    revalidatePath("/inventory");
    revalidatePath(`/inventory/${result.request.inventoryItemId}`);
    revalidatePath("/notifications");

    return {
      status: result.notification?.status === "SENT" ? "success" : "error",
      message: result.message,
    };
  } catch (error) {
    return {
      status: "error",
      message: toUserMessage(error, "The restock request could not be created."),
    };
  }
}
