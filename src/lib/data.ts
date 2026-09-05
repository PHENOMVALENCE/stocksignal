import { hasSupabaseServerEnv } from "@/lib/env";
import { toUserMessage } from "@/lib/errors";
import { inventoryItemRepository } from "@/repositories/inventory-items";
import type { InventoryItem } from "@/repositories/mappers";

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
