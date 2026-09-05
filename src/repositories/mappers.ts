import { parseQuantity } from "@/lib/quantity";
import type {
  InventoryItemRow,
  NotificationRow,
  RestockRequestRow,
  StockMovementRow,
} from "@/types/database";
import type { NotificationStatus, NotificationType, RestockRequestStatus, StockMovementType } from "@/types/database";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  managerPhone: string | null;
  supplierName: string | null;
  supplierPhone: string | null;
  alertActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes: string | null;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  inventoryItemId: string;
  type: NotificationType;
  recipient: string;
  message: string;
  provider: string;
  providerMessageId: string | null;
  status: NotificationStatus;
  errorMessage: string | null;
  attemptCount: number;
  lastAttemptedAt: string | null;
  createdAt: string;
}

export interface RestockRequest {
  id: string;
  inventoryItemId: string;
  requestedQuantity: number;
  supplierName: string;
  supplierPhone: string;
  status: RestockRequestStatus;
  notificationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function mapInventoryItem(row: InventoryItemRow): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    unit: row.unit,
    quantity: parseQuantity(row.quantity, "Quantity"),
    reorderLevel: parseQuantity(row.reorder_level, "Reorder level"),
    managerPhone: row.manager_phone,
    supplierName: row.supplier_name,
    supplierPhone: row.supplier_phone,
    alertActive: row.alert_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapStockMovement(row: StockMovementRow): StockMovement {
  return {
    id: row.id,
    inventoryItemId: row.inventory_item_id,
    type: row.type as StockMovementType,
    quantity: parseQuantity(row.quantity, "Movement quantity"),
    previousQuantity: parseQuantity(row.previous_quantity, "Previous quantity"),
    newQuantity: parseQuantity(row.new_quantity, "New quantity"),
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function mapNotification(row: NotificationRow): NotificationRecord {
  return {
    id: row.id,
    inventoryItemId: row.inventory_item_id,
    type: row.type as NotificationType,
    recipient: row.recipient,
    message: row.message,
    provider: row.provider,
    providerMessageId: row.provider_message_id,
    status: row.status as NotificationStatus,
    errorMessage: row.error_message,
    attemptCount: row.attempt_count,
    lastAttemptedAt: row.last_attempted_at,
    createdAt: row.created_at,
  };
}

export function mapRestockRequest(row: RestockRequestRow): RestockRequest {
  return {
    id: row.id,
    inventoryItemId: row.inventory_item_id,
    requestedQuantity: parseQuantity(row.requested_quantity, "Requested quantity"),
    supplierName: row.supplier_name,
    supplierPhone: row.supplier_phone,
    status: row.status as RestockRequestStatus,
    notificationId: row.notification_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
