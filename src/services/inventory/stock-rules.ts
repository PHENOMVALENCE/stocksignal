export type StockMovementType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";

interface CalculateNewStockInput {
  currentQuantity: number;
  movementQuantity: number;
  type: StockMovementType;
}

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number.`);
  }
}

/**
 * Resolves the balance a movement produces.
 *
 * STOCK_IN and STOCK_OUT are relative and require a positive quantity.
 * ADJUSTMENT is absolute: it sets the balance to the counted amount, which
 * may legitimately be zero when stock is exhausted or written off.
 */
export function calculateNewStock({
  currentQuantity,
  movementQuantity,
  type,
}: CalculateNewStockInput): number {
  assertFinite(currentQuantity, "The current quantity");
  assertFinite(movementQuantity, "The movement quantity");

  if (currentQuantity < 0) {
    throw new RangeError("The current quantity cannot be negative.");
  }

  if (type === "ADJUSTMENT") {
    if (movementQuantity < 0) {
      throw new RangeError("An adjustment cannot set a negative balance.");
    }

    return movementQuantity;
  }

  if (movementQuantity <= 0) {
    throw new RangeError("A stock movement quantity must be greater than zero.");
  }

  const nextQuantity =
    type === "STOCK_OUT"
      ? currentQuantity - movementQuantity
      : currentQuantity + movementQuantity;

  if (nextQuantity < 0) {
    throw new RangeError("A stock movement cannot create a negative balance.");
  }

  return nextQuantity;
}

export function isLowStock(quantity: number, reorderLevel: number): boolean {
  return quantity <= reorderLevel;
}

/**
 * An alert fires only on the transition into a low state, so an item that
 * stays below its reorder level does not notify the manager repeatedly.
 */
export function shouldSendLowStockAlert(
  quantity: number,
  reorderLevel: number,
  alertActive: boolean,
): boolean {
  return isLowStock(quantity, reorderLevel) && !alertActive;
}

export function shouldResetLowStockAlert(
  quantity: number,
  reorderLevel: number,
  alertActive: boolean,
): boolean {
  return alertActive && !isLowStock(quantity, reorderLevel);
}
