import { describe, expect, it } from "vitest";

import { createNotificationRepository } from "./notifications";
import { createFakeClient } from "./test-client";

const row = {
  id: "22222222-2222-4222-8222-222222222222",
  inventory_item_id: "11111111-1111-4111-8111-111111111111",
  type: "LOW_STOCK" as const,
  recipient: "+254700000001",
  message: "STOCKSIGNAL ALERT",
  provider: "AFRICAS_TALKING",
  provider_message_id: null,
  status: "PENDING" as const,
  error_message: null,
  attempt_count: 0,
  last_attempted_at: null,
  created_at: "2026-09-05T05:00:00.000Z",
};

describe("notification repository", () => {
  it("creates a pending notification and maps the row", async () => {
    const repository = createNotificationRepository(
      createFakeClient(() => ({ data: row, error: null })),
    );

    const created = await repository.create({
      inventoryItemId: row.inventory_item_id,
      type: "LOW_STOCK",
      recipient: row.recipient,
      message: row.message,
    });

    expect(created.status).toBe("PENDING");
    expect(created.provider).toBe("AFRICAS_TALKING");
  });

  it("pages filtered notifications", async () => {
    const repository = createNotificationRepository(
      createFakeClient(() => ({ data: [row], error: null, count: 1 })),
    );

    const page = await repository.listPage({ type: "LOW_STOCK", status: "PENDING" }, 1, 20);

    expect(page.total).toBe(1);
    expect(page.items[0]?.type).toBe("LOW_STOCK");
  });
});
