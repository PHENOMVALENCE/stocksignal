import { describe, expect, it } from "vitest";

import type { NotificationRecord } from "@/repositories/mappers";

import { deliverNotification, MAX_SMS_ATTEMPTS } from "./deliver";

function notification(overrides: Partial<NotificationRecord> = {}): NotificationRecord {
  return {
    id: "33333333-3333-4333-8333-333333333333",
    inventoryItemId: "11111111-1111-4111-8111-111111111111",
    type: "LOW_STOCK",
    recipient: "+254712345678",
    message: "STOCKSIGNAL ALERT",
    provider: "AFRICAS_TALKING",
    providerMessageId: null,
    status: "PENDING",
    errorMessage: null,
    attemptCount: 0,
    lastAttemptedAt: null,
    createdAt: "2026-09-05T05:00:00.000Z",
    ...overrides,
  };
}

describe("deliverNotification", () => {
  it("marks a successful send as SENT with the provider id", async () => {
    const existing = notification();
    let updated: NotificationRecord = existing;

    const result = await deliverNotification(existing.id, {
      notifications: {
        requireById: async () => existing,
        updateDelivery: async (_id: string, update: Partial<NotificationRecord>) => {
          updated = { ...existing, ...update, attemptCount: update.attemptCount ?? existing.attemptCount };
          return updated;
        },
      } as never,
      send: async () => ({ ok: true, providerMessageId: "ATXid_1", errorMessage: null }),
    });

    expect(result.delivered).toBe(true);
    expect(updated.status).toBe("SENT");
    expect(updated.providerMessageId).toBe("ATXid_1");
    expect(updated.attemptCount).toBe(1);
  });

  it("records a provider failure without throwing", async () => {
    const existing = notification();

    const result = await deliverNotification(existing.id, {
      notifications: {
        requireById: async () => existing,
        updateDelivery: async (_id: string, update: Partial<NotificationRecord>) => ({ ...existing, ...update }),
      } as never,
      send: async () => ({ ok: false, providerMessageId: null, errorMessage: "Network unavailable" }),
    });

    expect(result.delivered).toBe(false);
    expect(result.notification.status).toBe("FAILED");
  });

  it("stops after the bounded attempt policy", async () => {
    const existing = notification({ attemptCount: MAX_SMS_ATTEMPTS, status: "FAILED" });

    const result = await deliverNotification(existing.id, {
      notifications: {
        requireById: async () => existing,
        updateDelivery: async (_id: string, update: Partial<NotificationRecord>) => ({ ...existing, ...update }),
      } as never,
      send: async () => {
        throw new Error("should not send");
      },
    });

    expect(result.delivered).toBe(false);
    expect(result.notification.errorMessage).toMatch(/maximum number of attempts/);
  });
});
