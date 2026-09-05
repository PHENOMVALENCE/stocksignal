import { describe, expect, it } from "vitest";

import { createInventoryItemRepository } from "./inventory-items";
import { createFakeClient } from "./test-client";

const sampleRow = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Cotton Fabric",
  sku: "COT-001",
  unit: "metres",
  quantity: "50.000",
  reorder_level: "15.000",
  manager_phone: "+254700000001",
  supplier_name: "Demo Mill",
  supplier_phone: "+254700000002",
  alert_active: false,
  created_at: "2026-09-05T05:00:00.000Z",
  updated_at: "2026-09-05T05:00:00.000Z",
};

describe("inventory item repository", () => {
  it("maps numeric columns and lists items", async () => {
    const repository = createInventoryItemRepository(
      createFakeClient(() => ({ data: [sampleRow], error: null })),
    );

    const items = await repository.list();

    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(50);
    expect(items[0]?.reorderLevel).toBe(15);
    expect(items[0]?.sku).toBe("COT-001");
  });

  it("normalizes a duplicate SKU insert error", async () => {
    const repository = createInventoryItemRepository(
      createFakeClient(() => ({
        data: null,
        error: {
          code: "23505",
          message: "duplicate key value violates unique constraint inventory_items_sku_key",
        },
      })),
    );

    await expect(
      repository.create({
        name: "Cotton Fabric",
        sku: "COT-001",
        unit: "metres",
        quantity: 50,
        reorderLevel: 15,
        managerPhone: "+254700000001",
      }),
    ).rejects.toMatchObject({
      code: "SKU_DUPLICATE",
      message: "An item with this SKU already exists.",
    });
  });

  it("returns null when an item is missing", async () => {
    const repository = createInventoryItemRepository(createFakeClient(() => ({ data: null, error: null })));

    await expect(repository.getById(sampleRow.id)).resolves.toBeNull();
  });
});
