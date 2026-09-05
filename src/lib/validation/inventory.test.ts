import { describe, expect, it } from "vitest";

import { createInventoryItemSchema } from "./inventory";

const valid = {
  name: "Cotton Fabric",
  sku: "COT-001",
  unit: "metres",
  quantity: "50",
  reorderLevel: "15",
  managerPhone: "+254712345678",
  supplierName: "",
  supplierPhone: "",
};

describe("createInventoryItemSchema", () => {
  it("accepts zero quantity and reorder level", () => {
    const result = createInventoryItemSchema.safeParse({
      ...valid,
      quantity: "0",
      reorderLevel: "0",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quantity).toBe(0);
      expect(result.data.reorderLevel).toBe(0);
    }
  });

  it("rejects a negative quantity", () => {
    const result = createInventoryItemSchema.safeParse({ ...valid, quantity: "-1" });
    expect(result.success).toBe(false);
  });

  it("rejects a domestic phone number", () => {
    const result = createInventoryItemSchema.safeParse({ ...valid, managerPhone: "0712345678" });
    expect(result.success).toBe(false);
  });

  it("requires both supplier fields when one is present", () => {
    const result = createInventoryItemSchema.safeParse({
      ...valid,
      supplierName: "Demo Mill",
    });

    expect(result.success).toBe(false);
  });
});
