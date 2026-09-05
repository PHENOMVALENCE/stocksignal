import { describe, expect, it } from "vitest";

import { MemoryStockStore } from "./memory-stock";
import { recordStockMovement } from "./record-movement";

const itemId = "11111111-1111-4111-8111-111111111111";

describe("recordStockMovement", () => {
  it("records previous and new quantities for a stock-out", async () => {
    const store = new MemoryStockStore([
      {
        id: itemId,
        name: "Cotton Fabric",
        unit: "metres",
        quantity: 50,
        reorderLevel: 15,
        managerPhone: "+254712345678",
        alertActive: false,
        updatedAt: "2026-09-05T05:00:00.000Z",
      },
    ]);

    const result = await recordStockMovement(
      { inventoryItemId: itemId, type: "STOCK_OUT", quantity: "40" },
      { applyMovement: (input) => store.apply(input) },
    );

    expect(result.movement?.previousQuantity).toBe(50);
    expect(result.movement?.newQuantity).toBe(10);
    expect(store.movements[0]?.previousQuantity).toBe(50);
    expect(store.movements[0]?.newQuantity).toBe(10);
  });

  it("rejects a stock-out that would go negative", async () => {
    const store = new MemoryStockStore([
      {
        id: itemId,
        name: "Cotton Fabric",
        unit: "metres",
        quantity: 10,
        reorderLevel: 15,
        managerPhone: "+254712345678",
        alertActive: true,
        updatedAt: "2026-09-05T05:00:00.000Z",
      },
    ]);

    await expect(store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 11 })).rejects.toThrow(
      /negative balance/,
    );
  });

  it("allows an adjustment to zero", async () => {
    const store = new MemoryStockStore([
      {
        id: itemId,
        name: "Cotton Fabric",
        unit: "metres",
        quantity: 8,
        reorderLevel: 15,
        managerPhone: "+254712345678",
        alertActive: true,
        updatedAt: "2026-09-05T05:00:00.000Z",
      },
    ]);

    const result = await store.apply({ inventoryItemId: itemId, type: "ADJUSTMENT", quantity: 0 });
    expect(result.newQuantity).toBe(0);
  });

  it("does not lose updates when two movements run concurrently", async () => {
    const store = new MemoryStockStore([
      {
        id: itemId,
        name: "Cotton Fabric",
        unit: "metres",
        quantity: 50,
        reorderLevel: 15,
        managerPhone: "+254712345678",
        alertActive: false,
        updatedAt: "2026-09-05T05:00:00.000Z",
      },
    ]);

    const results = await Promise.allSettled([
      store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 40 }),
      store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 40 }),
    ]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(store.items.get(itemId)?.quantity).toBe(10);
    expect(store.movements).toHaveLength(1);
  });

  it("keeps movement history newest first and updates the item timestamp", async () => {
    const store = new MemoryStockStore([
      {
        id: itemId,
        name: "Cotton Fabric",
        unit: "metres",
        quantity: 50,
        reorderLevel: 15,
        managerPhone: "+254712345678",
        alertActive: false,
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    await store.apply({ inventoryItemId: itemId, type: "STOCK_OUT", quantity: 5 });
    await store.apply({ inventoryItemId: itemId, type: "STOCK_IN", quantity: 2 });

    expect(store.movements[0]?.type).toBe("STOCK_IN");
    expect(store.movements[1]?.type).toBe("STOCK_OUT");
    expect(store.items.get(itemId)?.updatedAt).not.toBe("2026-01-01T00:00:00.000Z");
  });

  it("rejects a non-positive relative quantity at the validation boundary", async () => {
    const result = await recordStockMovement({
      inventoryItemId: itemId,
      type: "STOCK_IN",
      quantity: "0",
    });

    expect(result.movement).toBeUndefined();
    expect(result.fieldErrors?.quantity).toMatch(/greater than zero/);
  });
});
