import { calculateNewStock, isLowStock, type StockMovementType } from "./stock-rules";

export interface MemoryInventoryItem {
  id: string;
  quantity: number;
  reorderLevel: number;
  alertActive: boolean;
  updatedAt: string;
}

export interface MemoryMovement {
  id: string;
  inventoryItemId: string;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  createdAt: string;
}

export class MemoryStockStore {
  private readonly locks = new Map<string, Promise<void>>();
  readonly items = new Map<string, MemoryInventoryItem>();
  readonly movements: MemoryMovement[] = [];

  constructor(items: MemoryInventoryItem[]) {
    for (const item of items) {
      this.items.set(item.id, { ...item });
    }
  }

  async apply(input: { inventoryItemId: string; type: StockMovementType; quantity: number }) {
    return this.withLock(input.inventoryItemId, async () => {
      const item = this.items.get(input.inventoryItemId);

      if (!item) {
        throw new Error("The inventory item was not found.");
      }

      const previousQuantity = item.quantity;
      const newQuantity = calculateNewStock({
        currentQuantity: item.quantity,
        movementQuantity: input.quantity,
        type: input.type,
      });

      item.quantity = newQuantity;
      item.alertActive = isLowStock(newQuantity, item.reorderLevel);
      item.updatedAt = new Date().toISOString();

      const movement: MemoryMovement = {
        id: crypto.randomUUID(),
        inventoryItemId: item.id,
        type: input.type,
        quantity: input.quantity,
        previousQuantity,
        newQuantity,
        createdAt: new Date().toISOString(),
      };

      this.movements.unshift(movement);

      return {
        movementId: movement.id,
        previousQuantity,
        newQuantity,
        alertActive: item.alertActive,
        notificationId: null as string | null,
      };
    });
  }

  private async withLock<T>(id: string, work: () => Promise<T> | T): Promise<T> {
    const previous = this.locks.get(id) ?? Promise.resolve();
    let release: () => void = () => undefined;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });

    this.locks.set(
      id,
      previous.then(() => current),
    );

    await previous;

    try {
      return await work();
    } finally {
      release();
    }
  }
}
