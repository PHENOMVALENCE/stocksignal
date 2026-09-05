import { describe, expect, it } from "vitest";

import { AppError } from "@/lib/errors";
import type { InventoryItem } from "@/repositories/mappers";

import { createInventoryItem } from "./create-item";

const validInput = {
  name: "Cotton Fabric",
  sku: "COT-001",
  unit: "metres",
  quantity: "50",
  reorderLevel: "15",
  managerPhone: "+254712345678",
};

const item: InventoryItem = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Cotton Fabric",
  sku: "COT-001",
  unit: "metres",
  quantity: 50,
  reorderLevel: 15,
  managerPhone: "+254712345678",
  supplierName: null,
  supplierPhone: null,
  alertActive: false,
  createdAt: "2026-09-05T05:00:00.000Z",
  updatedAt: "2026-09-05T05:00:00.000Z",
};

describe("createInventoryItem", () => {
  it("returns field errors instead of calling the repository", async () => {
    const created = await createInventoryItem(
      { ...validInput, quantity: "-2" },
      { create: async () => item } as never,
    );

    expect(created.item).toBeUndefined();
    expect(created.fieldErrors?.quantity).toMatch(/cannot be negative/);
  });

  it("surfaces a duplicate SKU as a field error", async () => {
    const created = await createInventoryItem(validInput, {
      create: async () => {
        throw new AppError("An item with this SKU already exists.", "SKU_DUPLICATE", 409);
      },
    } as never);

    expect(created.fieldErrors?.sku).toBe("An item with this SKU already exists.");
  });

  it("creates a valid material", async () => {
    const created = await createInventoryItem(validInput, {
      create: async () => item,
    } as never);

    expect(created.item?.sku).toBe("COT-001");
  });
});
