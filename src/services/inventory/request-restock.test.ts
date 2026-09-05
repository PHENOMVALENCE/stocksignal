import { describe, expect, it } from "vitest";

import type { InventoryItem, NotificationRecord, RestockRequest } from "@/repositories/mappers";

import { requestRestock } from "./request-restock";

const item: InventoryItem = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Cotton Fabric",
  sku: "COT-001",
  unit: "metres",
  quantity: 10,
  reorderLevel: 15,
  managerPhone: "+254712345678",
  supplierName: "Demo Mill",
  supplierPhone: "+254700000002",
  alertActive: true,
  createdAt: "2026-09-05T05:00:00.000Z",
  updatedAt: "2026-09-05T05:00:00.000Z",
};

const notification: NotificationRecord = {
  id: "33333333-3333-4333-8333-333333333333",
  inventoryItemId: item.id,
  type: "RESTOCK_REQUEST",
  recipient: "+254700000002",
  message: "JENGAFLOW RESTOCK REQUEST",
  provider: "AFRICAS_TALKING",
  providerMessageId: "ATXid_2",
  status: "SENT",
  errorMessage: null,
  attemptCount: 1,
  lastAttemptedAt: "2026-09-05T05:01:00.000Z",
  createdAt: "2026-09-05T05:01:00.000Z",
};

const request: RestockRequest = {
  id: "44444444-4444-4444-8444-444444444444",
  inventoryItemId: item.id,
  requestedQuantity: 50,
  supplierName: "Demo Mill",
  supplierPhone: "+254700000002",
  status: "REQUESTED",
  notificationId: notification.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("requestRestock", () => {
  it("rejects a restock when the item is not low", async () => {
    const result = await requestRestock(
      {
        inventoryItemId: item.id,
        requestedQuantity: "50",
        supplierName: "Demo Mill",
        supplierPhone: "+254700000002",
        unit: "metres",
      },
      {
        items: { requireById: async () => ({ ...item, quantity: 40 }) } as never,
      },
    );

    expect(result.request).toBeUndefined();
    expect(result.message).toMatch(/only while the material is low stock/);
  });

  it("creates a linked request and notification, then delivers SMS", async () => {
    const result = await requestRestock(
      {
        inventoryItemId: item.id,
        requestedQuantity: "50",
        supplierName: "Demo Mill",
        supplierPhone: "+254700000002",
        unit: "metres",
      },
      {
        items: { requireById: async () => item } as never,
        requests: {
          listByItem: async () => [],
          requireById: async () => request,
        } as never,
        rpc: {
          createRequest: async () => ({
            restockRequestId: request.id,
            notificationId: notification.id,
          }),
        } as never,
        notifications: {
          getById: async () => notification,
        } as never,
        deliver: async () => ({ notification, delivered: true }),
      },
    );

    expect(result.request?.notificationId).toBe(notification.id);
    expect(result.notification?.status).toBe("SENT");
    expect(result.message).toMatch(/sent to the supplier/);
  });

  it("is idempotent for a recent identical request", async () => {
    const result = await requestRestock(
      {
        inventoryItemId: item.id,
        requestedQuantity: "50",
        supplierName: "Demo Mill",
        supplierPhone: "+254700000002",
        unit: "metres",
      },
      {
        items: { requireById: async () => item } as never,
        requests: { listByItem: async () => [request] } as never,
        notifications: { getById: async () => notification } as never,
        deliver: async () => {
          throw new Error("should not send again");
        },
      },
    );

    expect(result.duplicate).toBe(true);
    expect(result.request?.id).toBe(request.id);
  });

  it("rejects a unit that does not match the material", async () => {
    const result = await requestRestock(
      {
        inventoryItemId: item.id,
        requestedQuantity: "50",
        supplierName: "Demo Mill",
        supplierPhone: "+254700000002",
        unit: "kg",
      },
      {
        items: { requireById: async () => item } as never,
      },
    );

    expect(result.request).toBeUndefined();
    expect(result.fieldErrors?.unit).toMatch(/does not match the material unit/);
  });

  it("requires a positive requested quantity", async () => {
    const result = await requestRestock({
      inventoryItemId: item.id,
      requestedQuantity: "0",
      supplierName: "Demo Mill",
      supplierPhone: "+254700000002",
      unit: "metres",
    });

    expect(result.fieldErrors?.requestedQuantity).toMatch(/greater than zero/);
  });
});
