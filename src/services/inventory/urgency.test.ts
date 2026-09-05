import { describe, expect, it } from "vitest";

import { compareLowStockUrgency } from "./urgency";

describe("compareLowStockUrgency", () => {
  it("orders closer-to-zero balances ahead of healthier low-stock items", () => {
    const items = [
      { name: "Buttons", quantity: 12, reorderLevel: 15 },
      { name: "Cotton Fabric", quantity: 2, reorderLevel: 15 },
      { name: "Thread", quantity: 0, reorderLevel: 5 },
    ].sort(compareLowStockUrgency);

    expect(items.map((item) => item.name)).toEqual(["Thread", "Cotton Fabric", "Buttons"]);
  });
});
