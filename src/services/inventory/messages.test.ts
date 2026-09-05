import { describe, expect, it } from "vitest";

import { buildLowStockMessage, buildRestockRequestMessage } from "./messages";

describe("notification messages", () => {
  it("builds the documented low-stock manager message", () => {
    expect(
      buildLowStockMessage({
        name: "Cotton Fabric",
        quantity: 10,
        reorderLevel: 15,
        unit: "metres",
      }),
    ).toBe(
      [
        "STOCKSIGNAL ALERT",
        "",
        "Cotton Fabric is running low.",
        "",
        "Available: 10 metres",
        "Minimum level: 15 metres.",
        "",
        "Restocking is recommended.",
      ].join("\n"),
    );
  });

  it("builds the documented restock request message", () => {
    expect(
      buildRestockRequestMessage({
        manufacturerName: "Mwigani Manufacturing",
        name: "Cotton Fabric",
        requestedQuantity: 50,
        unit: "metres",
      }),
    ).toContain("50 metres");
  });
});
