"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/actions";
import { toUserMessage } from "@/lib/errors";
import { inventoryItemIdSchema } from "@/lib/validation/inventory";
import { deliverNotification } from "@/services/notifications/deliver";
import { z } from "zod";

export async function retryNotificationAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.uuid().safeParse(String(formData.get("notificationId") ?? ""));

  if (!parsed.success) {
    return { status: "error", message: "Choose a valid notification to retry." };
  }

  try {
    const result = await deliverNotification(parsed.data);
    revalidatePath("/notifications");
    const itemId = inventoryItemIdSchema.safeParse(result.notification.inventoryItemId);
    if (itemId.success) {
      revalidatePath(`/inventory/${itemId.data}`);
    }

    return {
      status: result.delivered ? "success" : "error",
      message: result.delivered ? "The message was sent." : result.notification.errorMessage ?? "Delivery failed.",
    };
  } catch (error) {
    return {
      status: "error",
      message: toUserMessage(error, "The notification could not be retried."),
    };
  }
}
