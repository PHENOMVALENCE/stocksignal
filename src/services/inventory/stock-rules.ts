export type StockMovementType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
interface CalculateNewStockInput { currentQuantity: number; movementQuantity: number; type: StockMovementType }
export function calculateNewStock({ currentQuantity, movementQuantity, type }: CalculateNewStockInput): number {
  if (currentQuantity < 0 || movementQuantity <= 0) throw new RangeError("Stock quantities must be valid non-negative values.");
  const nextQuantity = type === "STOCK_OUT" ? currentQuantity - movementQuantity : type === "STOCK_IN" ? currentQuantity + movementQuantity : movementQuantity;
  if (nextQuantity < 0) throw new RangeError("A stock movement cannot create a negative balance.");
  return nextQuantity;
}
export function isLowStock(quantity: number, reorderLevel: number): boolean { return quantity <= reorderLevel; }
export function shouldSendLowStockAlert(quantity: number, reorderLevel: number, alertActive: boolean): boolean { return isLowStock(quantity, reorderLevel) && !alertActive; }
export function shouldResetLowStockAlert(quantity: number, reorderLevel: number, alertActive: boolean): boolean { return alertActive && !isLowStock(quantity, reorderLevel); }
