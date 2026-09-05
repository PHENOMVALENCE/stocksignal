import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError } from "@/repositories/errors";
import { mapStockMovement, type StockMovement } from "@/repositories/mappers";

export function createStockMovementRepository(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
    async listByItem(inventoryItemId: string, limit = 50): Promise<StockMovement[]> {
      const { data, error } = await client
        .from("stock_movements")
        .select("*")
        .eq("inventory_item_id", inventoryItemId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw mapDatabaseError(error, "Stock movements could not be loaded.");
      }

      return (data ?? []).map(mapStockMovement);
    },

    async listRecent(limit = 8): Promise<StockMovement[]> {
      const { data, error } = await client
        .from("stock_movements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw mapDatabaseError(error, "Recent stock movements could not be loaded.");
      }

      return (data ?? []).map(mapStockMovement);
    },
  };
}

export function stockMovementRepository(client?: StockSignalDatabaseClient) {
  return createStockMovementRepository(client ?? createSupabaseServerClient());
}
