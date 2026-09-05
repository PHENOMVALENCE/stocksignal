import { notificationRepository } from "@/repositories/notifications";
import type { NotificationRecord } from "@/repositories/mappers";
import { sendTextMessage } from "@/services/africas-talking/sms";

export const MAX_SMS_ATTEMPTS = 3;

export interface DeliverNotificationResult {
  notification: NotificationRecord;
  delivered: boolean;
}

export async function deliverNotification(
  id: string,
  deps: {
    notifications?: ReturnType<typeof notificationRepository>;
    send?: typeof sendTextMessage;
  } = {},
): Promise<DeliverNotificationResult> {
  const notifications = deps.notifications ?? notificationRepository();
  const send = deps.send ?? sendTextMessage;
  const existing = await notifications.requireById(id);

  if (existing.status === "SENT") {
    return { notification: existing, delivered: true };
  }

  const nextAttempt = existing.attemptCount + 1;

  if (existing.attemptCount >= MAX_SMS_ATTEMPTS) {
    const notification = await notifications.updateDelivery(id, {
      status: "FAILED",
      errorMessage: "Delivery stopped after the maximum number of attempts.",
      attemptCount: existing.attemptCount,
    });
    return { notification, delivered: false };
  }

  const result = await send({
    recipient: existing.recipient,
    message: existing.message,
  });

  const notification = await notifications.updateDelivery(id, {
    status: result.ok ? "SENT" : "FAILED",
    providerMessageId: result.providerMessageId,
    errorMessage: result.ok ? null : result.errorMessage,
    attemptCount: nextAttempt,
  });

  return { notification, delivered: result.ok };
}
