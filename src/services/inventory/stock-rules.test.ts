import { describe, expect, it } from "vitest";
import { calculateNewStock, isLowStock, shouldResetLowStockAlert, shouldSendLowStockAlert } from "./stock-rules";
describe("stock rules", () => {
  it("marks 10 as low after consuming 40 from 50 at a reorder level of 15", () => { const quantity = calculateNewStock({ currentQuantity: 50, movementQuantity: 40, type: "STOCK_OUT" }); expect(quantity).toBe(10); expect(isLowStock(quantity, 15)).toBe(true); expect(shouldSendLowStockAlert(quantity, 15, false)).toBe(true); });
  it("suppresses another active alert below threshold", () => expect(shouldSendLowStockAlert(13, 15, true)).toBe(false));
  it("resets after replenishment above threshold", () => expect(shouldResetLowStockAlert(30, 15, true)).toBe(true));
  it("allows a new alert after reset", () => expect(shouldSendLowStockAlert(14, 15, false)).toBe(true));
  it("rejects a negative resulting balance", () => expect(() => calculateNewStock({ currentQuantity: 10, movementQuantity: 11, type: "STOCK_OUT" })).toThrow(RangeError));
});
