import { describe, expect, it } from "vitest";

import { formatQuantity, parseQuantity, quantityToDatabase } from "./quantity";

describe("quantity helpers", () => {
  it("accepts zero and three decimal places", () => {
    expect(parseQuantity("0", "Quantity")).toBe(0);
    expect(parseQuantity("15.250", "Reorder level")).toBe(15.25);
    expect(quantityToDatabase(10)).toBe("10.000");
  });

  it("rejects negative-looking invalid strings and extra precision", () => {
    expect(() => parseQuantity("10.2501", "Quantity")).toThrow(/three decimal places/);
    expect(() => parseQuantity("abc", "Quantity")).toThrow(/three decimal places/);
  });

  it("formats quantities without trailing zeros", () => {
    expect(formatQuantity(10)).toBe("10");
    expect(formatQuantity(10.5)).toBe("10.5");
  });
});
