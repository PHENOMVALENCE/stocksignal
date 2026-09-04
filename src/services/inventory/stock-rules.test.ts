import { describe, expect, it } from "vitest";

import {
  calculateNewStock,
  isLowStock,
  shouldResetLowStockAlert,
  shouldSendLowStockAlert,
} from "./stock-rules";

describe("calculateNewStock", () => {
  it("adds a stock-in movement to the current balance", () => {
    expect(
      calculateNewStock({ currentQuantity: 20, movementQuantity: 30, type: "STOCK_IN" }),
    ).toBe(50);
  });

  it("subtracts a stock-out movement from the current balance", () => {
    expect(
      calculateNewStock({ currentQuantity: 50, movementQuantity: 40, type: "STOCK_OUT" }),
    ).toBe(10);
  });

  it("treats an adjustment as the counted absolute balance", () => {
    expect(
      calculateNewStock({ currentQuantity: 50, movementQuantity: 12, type: "ADJUSTMENT" }),
    ).toBe(12);
  });

  it("allows an adjustment to zero when stock is exhausted", () => {
    expect(
      calculateNewStock({ currentQuantity: 50, movementQuantity: 0, type: "ADJUSTMENT" }),
    ).toBe(0);
  });

  it("allows a stock-out that empties the balance exactly", () => {
    expect(
      calculateNewStock({ currentQuantity: 10, movementQuantity: 10, type: "STOCK_OUT" }),
    ).toBe(0);
  });

  it("rejects a resulting negative balance", () => {
    expect(() =>
      calculateNewStock({ currentQuantity: 10, movementQuantity: 11, type: "STOCK_OUT" }),
    ).toThrow(RangeError);
  });

  it("rejects a non-positive relative movement", () => {
    expect(() =>
      calculateNewStock({ currentQuantity: 10, movementQuantity: 0, type: "STOCK_IN" }),
    ).toThrow(RangeError);
  });

  it("rejects a negative adjustment target", () => {
    expect(() =>
      calculateNewStock({ currentQuantity: 10, movementQuantity: -1, type: "ADJUSTMENT" }),
    ).toThrow(RangeError);
  });

  it("rejects a negative opening balance", () => {
    expect(() =>
      calculateNewStock({ currentQuantity: -1, movementQuantity: 5, type: "STOCK_IN" }),
    ).toThrow(RangeError);
  });

  it("rejects a non-finite quantity", () => {
    expect(() =>
      calculateNewStock({ currentQuantity: 10, movementQuantity: Number.NaN, type: "STOCK_IN" }),
    ).toThrow(RangeError);
  });
});

describe("isLowStock", () => {
  it("treats a balance at the reorder level as low", () => {
    expect(isLowStock(15, 15)).toBe(true);
  });

  it("treats a balance above the reorder level as healthy", () => {
    expect(isLowStock(16, 15)).toBe(false);
  });
});

describe("low-stock alert lifecycle", () => {
  it("alerts on the transition into a low balance", () => {
    const quantity = calculateNewStock({
      currentQuantity: 50,
      movementQuantity: 40,
      type: "STOCK_OUT",
    });

    expect(isLowStock(quantity, 15)).toBe(true);
    expect(shouldSendLowStockAlert(quantity, 15, false)).toBe(true);
  });

  it("suppresses a repeat alert while one is already active", () => {
    expect(shouldSendLowStockAlert(13, 15, true)).toBe(false);
  });

  it("resets the signal after replenishment above the threshold", () => {
    expect(shouldResetLowStockAlert(30, 15, true)).toBe(true);
  });

  it("does not reset while the balance is still low", () => {
    expect(shouldResetLowStockAlert(13, 15, true)).toBe(false);
  });

  it("alerts again after a reset", () => {
    expect(shouldSendLowStockAlert(14, 15, false)).toBe(true);
  });
});
