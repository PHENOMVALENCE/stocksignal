import { describe, expect, it } from "vitest";

import {
  INVENTORY_MODULE_NAME,
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  primaryNavigation,
  productMetadata,
} from "./product";

describe("product shell", () => {
  it("presents JengaFlow as the product and StockSignal as the inventory module", () => {
    expect(PRODUCT_NAME).toBe("JengaFlow");
    expect(INVENTORY_MODULE_NAME).toBe("StockSignal");
    expect(PRODUCT_DESCRIPTION).toContain("JengaFlow");
    expect(PRODUCT_DESCRIPTION).toContain("StockSignal");
    expect(PRODUCT_DESCRIPTION).toMatch(/inventory/i);
  });

  it("uses JengaFlow metadata titles", () => {
    expect(productMetadata.title.default).toBe("JengaFlow");
    expect(productMetadata.title.template).toBe("%s | JengaFlow");
    expect(productMetadata.description).toBe(PRODUCT_DESCRIPTION);
  });

  it("keeps inventory and notification routes while labeling the working module", () => {
    expect(primaryNavigation).toEqual([
      { href: "/", label: "Dashboard" },
      { href: "/inventory", label: "Inventory" },
      { href: "/notifications", label: "Notifications" },
    ]);
  });
});
