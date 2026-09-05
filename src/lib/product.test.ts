import { describe, expect, it } from "vitest";

import {
  INVENTORY_MODULE_NAME,
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  primaryNavigation,
  productMetadata,
} from "./product";

describe("product shell", () => {
  it("presents MFGFlow as the product and StockSignal as the inventory module", () => {
    expect(PRODUCT_NAME).toBe("MFGFlow");
    expect(INVENTORY_MODULE_NAME).toBe("StockSignal");
    expect(PRODUCT_DESCRIPTION).toContain("MFGFlow");
    expect(PRODUCT_DESCRIPTION).toContain("StockSignal");
    expect(PRODUCT_DESCRIPTION).toMatch(/inventory/i);
  });

  it("uses MFGFlow metadata titles", () => {
    expect(productMetadata.title.default).toBe("MFGFlow");
    expect(productMetadata.title.template).toBe("%s | MFGFlow");
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
