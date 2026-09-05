import type { Database as GeneratedDatabase } from "./database.generated";

export type Database = GeneratedDatabase;

export type StockMovementType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
export type NotificationType = "LOW_STOCK" | "RESTOCK_REQUEST";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED";
export type RestockRequestStatus = "REQUESTED" | "ACKNOWLEDGED" | "CANCELLED" | "FULFILLED";

export type InventoryItemRow = Database["public"]["Tables"]["inventory_items"]["Row"];
export type StockMovementRow = Database["public"]["Tables"]["stock_movements"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type RestockRequestRow = Database["public"]["Tables"]["restock_requests"]["Row"];
