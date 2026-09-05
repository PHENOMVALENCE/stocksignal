import "server-only";

import { AppError } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError } from "@/repositories/errors";
import { mapRestockRequest, type RestockRequest } from "@/repositories/mappers";

export function createRestockRequestRepository(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
    async getById(id: string): Promise<RestockRequest | null> {
      const { data, error } = await client.from("restock_requests").select("*").eq("id", id).maybeSingle();

      if (error) {
        throw mapDatabaseError(error, "The restock request could not be loaded.");
      }

      return data ? mapRestockRequest(data) : null;
    },

    async requireById(id: string): Promise<RestockRequest> {
      const request = await this.getById(id);

      if (!request) {
        throw new AppError("The restock request was not found.", "NOT_FOUND", 404);
      }

      return request;
    },

    async listByItem(inventoryItemId: string): Promise<RestockRequest[]> {
      const { data, error } = await client
        .from("restock_requests")
        .select("*")
        .eq("inventory_item_id", inventoryItemId)
        .order("created_at", { ascending: false });

      if (error) {
        throw mapDatabaseError(error, "Restock requests could not be loaded.");
      }

      return (data ?? []).map(mapRestockRequest);
    },
  };
}

export function restockRequestRepository(client?: StockSignalDatabaseClient) {
  return createRestockRequestRepository(client ?? createSupabaseServerClient());
}
