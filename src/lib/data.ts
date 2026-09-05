import { hasSupabaseServerEnv } from "@/lib/env";
import { toUserMessage } from "@/lib/errors";
import { inventoryItemRepository } from "@/repositories/inventory-items";
import type { InventoryItem, RestockRequest, StockMovement } from "@/repositories/mappers";
import { notificationRepository, type NotificationFilters, type NotificationPage } from "@/repositories/notifications";
import { restockRequestRepository } from "@/repositories/restock-requests";
import { stockMovementRepository } from "@/repositories/stock-movements";
import { compareLowStockUrgency } from "@/services/inventory/urgency";
import { isLowStock } from "@/services/inventory/stock-rules";

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "configuration" | "error"; message: string };

const configurationMessage =
  "Supabase is not configured on this server. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable inventory.";

export async function loadInventoryItem(id: string): Promise<DataResult<InventoryItem | null>> {
  if (!hasSupabaseServerEnv()) {
    return { ok: false, reason: "configuration", message: configurationMessage };
  }

  try {
    return { ok: true, data: await inventoryItemRepository().getById(id) };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message: toUserMessage(error, "The inventory item could not be loaded."),
    };
  }
}

export async function loadInventoryItemDetail(
  id: string,
): Promise<DataResult<{ item: InventoryItem; movements: StockMovement[]; restockRequests: RestockRequest[] } | null>> {
  if (!hasSupabaseServerEnv()) {
    return { ok: false, reason: "configuration", message: configurationMessage };
  }

  try {
    const item = await inventoryItemRepository().getById(id);

    if (!item) {
      return { ok: true, data: null };
    }

    const [movements, restockRequests] = await Promise.all([
      stockMovementRepository().listByItem(id),
      restockRequestRepository().listByItem(id),
    ]);
    return { ok: true, data: { item, movements, restockRequests } };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message: toUserMessage(error, "The inventory item could not be loaded."),
    };
  }
}

export interface DashboardData {
  totalItems: number;
  lowStockCount: number;
  lowStockItems: InventoryItem[];
  recentMovements: StockMovement[];
  itemsById: Record<string, InventoryItem>;
}

export async function loadDashboard(): Promise<DataResult<DashboardData>> {
  if (!hasSupabaseServerEnv()) {
    return { ok: false, reason: "configuration", message: configurationMessage };
  }

  try {
    const [items, recentMovements] = await Promise.all([
      inventoryItemRepository().list(),
      stockMovementRepository().listRecent(8),
    ]);
    const lowStockItems = items.filter((item) => isLowStock(item.quantity, item.reorderLevel)).sort(compareLowStockUrgency);
    const itemsById = Object.fromEntries(items.map((item) => [item.id, item]));

    return {
      ok: true,
      data: {
        totalItems: items.length,
        lowStockCount: lowStockItems.length,
        lowStockItems,
        recentMovements,
        itemsById,
      },
    };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message: toUserMessage(error, "The dashboard could not be loaded."),
    };
  }
}

export async function loadNotificationHistory(
  filters: NotificationFilters,
  page: number,
): Promise<DataResult<NotificationPage & { itemsById: Record<string, InventoryItem> }>> {
  if (!hasSupabaseServerEnv()) {
    return { ok: false, reason: "configuration", message: configurationMessage };
  }

  try {
    const [pageResult, items] = await Promise.all([
      notificationRepository().listPage(filters, page, 20),
      inventoryItemRepository().list(),
    ]);

    return {
      ok: true,
      data: {
        ...pageResult,
        itemsById: Object.fromEntries(items.map((item) => [item.id, item])),
      },
    };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message: toUserMessage(error, "Notifications could not be loaded."),
    };
  }
}

export async function loadInventoryItems(): Promise<DataResult<InventoryItem[]>> {
  if (!hasSupabaseServerEnv()) {
    return { ok: false, reason: "configuration", message: configurationMessage };
  }

  try {
    return { ok: true, data: await inventoryItemRepository().list() };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message: toUserMessage(error, "Inventory items could not be loaded."),
    };
  }
}
