"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/actions";
import { toUserMessage } from "@/lib/errors";
import { createInventoryItem } from "@/services/inventory/create-item";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    unit: String(formData.get("unit") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
    reorderLevel: String(formData.get("reorderLevel") ?? ""),
    managerPhone: String(formData.get("managerPhone") ?? ""),
    supplierName: String(formData.get("supplierName") ?? ""),
    supplierPhone: String(formData.get("supplierPhone") ?? ""),
  };
}

export async function createInventoryItemAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const result = await createInventoryItem(readForm(formData));

    if (!result.item) {
      return {
        status: "error",
        message: result.message ?? "The material could not be saved.",
        fieldErrors: result.fieldErrors,
      };
    }

    revalidatePath("/inventory");
    redirect(`/inventory/${result.item.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }

    return {
      status: "error",
      message: toUserMessage(error, "The material could not be saved."),
    };
  }
}
