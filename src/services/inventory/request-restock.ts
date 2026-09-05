import { fieldErrorsFromZod } from "@/lib/actions";
import { AppError, isAppError } from "@/lib/errors";
import { restockRequestSchema } from "@/lib/validation/restock";
import { inventoryItemRepository } from "@/repositories/inventory-items";
import type { NotificationRecord, RestockRequest } from "@/repositories/mappers";
import { notificationRepository } from "@/repositories/notifications";
import { restockRequestRepository } from "@/repositories/restock-requests";
import { buildRestockRequestMessage } from "@/services/inventory/messages";
import { isLowStock } from "@/services/inventory/stock-rules";
import { deliverNotification } from "@/services/notifications/deliver";

const IDEMPOTENCY_WINDOW_MS = 2 * 60 * 1000;

export interface RequestRestockResult {
  request?: RestockRequest;
  notification?: NotificationRecord;
  fieldErrors?: Record<string, string>;
  message?: string;
  duplicate?: boolean;
}

function manufacturerName() {
  return process.env.MANUFACTURER_NAME?.trim() || "StockSignal";
}

export async function requestRestock(
  input: unknown,
  deps: {
    items?: ReturnType<typeof inventoryItemRepository>;
    requests?: ReturnType<typeof restockRequestRepository>;
    notifications?: ReturnType<typeof notificationRepository>;
    deliver?: typeof deliverNotification;
  } = {},
): Promise<RequestRestockResult> {
  const parsed = restockRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Check the highlighted fields and try again.",
    };
  }

  try {
    const items = deps.items ?? inventoryItemRepository();
    const item = await items.requireById(parsed.data.inventoryItemId);

    if (!isLowStock(item.quantity, item.reorderLevel)) {
      return { message: "Restock requests are available only while the material is low stock." };
    }

    const requests = deps.requests ?? restockRequestRepository();
    const notifications = deps.notifications ?? notificationRepository();
    const deliver = deps.deliver ?? deliverNotification;
    const existing = await requests.listByItem(item.id);
    const recent = existing.find((request) => {
      const age = Date.now() - Date.parse(request.createdAt);
      return (
        request.requestedQuantity === parsed.data.requestedQuantity &&
        request.supplierPhone === parsed.data.supplierPhone &&
        request.status === "REQUESTED" &&
        Number.isFinite(age) &&
        age < IDEMPOTENCY_WINDOW_MS
      );
    });

    if (recent) {
      const notification = recent.notificationId ? await notifications.getById(recent.notificationId) : null;
      return {
        request: recent,
        notification: notification ?? undefined,
        duplicate: true,
        message: "That restock request was already submitted.",
      };
    }

    const message = buildRestockRequestMessage({
      manufacturerName: manufacturerName(),
      name: item.name,
      requestedQuantity: parsed.data.requestedQuantity,
      unit: item.unit,
    });

    const notification = await notifications.create({
      inventoryItemId: item.id,
      type: "RESTOCK_REQUEST",
      recipient: parsed.data.supplierPhone,
      message,
      status: "PENDING",
    });

    const request = await requests.create({
      inventoryItemId: item.id,
      requestedQuantity: parsed.data.requestedQuantity,
      supplierName: parsed.data.supplierName,
      supplierPhone: parsed.data.supplierPhone,
      notificationId: notification.id,
    });

    const delivery = await deliver(notification.id, { notifications });

    return {
      request,
      notification: delivery.notification,
      message: delivery.delivered
        ? "The restock request was sent to the supplier."
        : "The restock request was recorded, but the SMS could not be delivered.",
    };
  } catch (error) {
    if (isAppError(error)) {
      return { message: error.message };
    }

    throw new AppError("The restock request could not be created.", "DATABASE", 500);
  }
}
