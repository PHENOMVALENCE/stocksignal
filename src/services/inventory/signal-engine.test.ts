import { describe, expect, it } from "vitest";

import { MemoryStockStore } from "./memory-stock";

const itemId = "11111111-1111-4111-8111-111111111111";

function cotton(overrides: Partial<ConstructorParameters<typeof MemoryStockStore>[0][number]> = {}) {
  return {
    id: itemId,
    name: "Cotton Fabric",
    unit: "metres",
    quantity: 50,
    reorderLevel: 15,
    managerPhone: "+254712345678",
    alertActive: false,
    updatedAt: "2026-09-05T05:00:00.000Z",
    ...overrides,
  };
}

describe("persistent low-stock signal", () => {
  it("creates one pending LOW_STOCK notification for 50 - 40 at reorder 15", async () => {
    const store = new MemoryStockStore([cotton()]);
    const result = await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 40 });

    expect(result.newQuantity).toBe(10);
    expect(result.alertActive).toBe(true);
    expect(store.notifications).toHaveLength(1);
    expect(store.notifications[0]?.type).toBe("LOW_STOCK");
    expect(store.notifications[0]?.status).toBe("PENDING");
    expect(store.notifications[0]?.message).toContain("Available: 10 metres");
  });

  it("suppresses further alerts while the item stays below the threshold", async () => {
    const store = new MemoryStockStore([cotton({ quantity: 14, alertActive: true })]);

    await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 1 });
    await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 1 });
    await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 1 });

    expect(store.items.get(itemId)?.quantity).toBe(11);
    expect(store.notifications).toHaveLength(0);
  });

  it("resets the alert on replenishment without creating a notification", async () => {
    const store = new MemoryStockStore([cotton({ quantity: 12, alertActive: true })]);
    const result = await store.apply({ inventoryItemId: itemId, type: "STOCK_IN", quantity: 18 });

    expect(result.newQuantity).toBe(30);
    expect(result.alertActive).toBe(false);
    expect(store.notifications).toHaveLength(0);
  });

  it("creates a new alert after a later crossing", async () => {
    const store = new MemoryStockStore([cotton({ quantity: 30, alertActive: false })]);
    const result = await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 16 });

    expect(result.newQuantity).toBe(14);
    expect(store.notifications).toHaveLength(1);
  });

  it("treats equality as low stock", async () => {
    const store = new MemoryStockStore([cotton({ quantity: 16, reorderLevel: 15 })]);
    await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 1 });

    expect(store.items.get(itemId)?.quantity).toBe(15);
    expect(store.notifications).toHaveLength(1);
  });
});
