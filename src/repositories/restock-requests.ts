import "server-only";

import { quantityToDatabase } from "@/lib/quantity";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError, requireData } from "@/repositories/errors";
import { mapRestockRequest, type RestockRequest } from "@/repositories/mappers";

export interface CreateRestockRequestInput {
  inventoryItemId: string;
  requestedQuantity: number;
  supplierName: string;
  supplierPhone: string;
  notificationId?: string | null;
}

export function createRestockRequestRepository(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
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

    async create(input: CreateRestockRequestInput): Promise<RestockRequest> {
      const { data, error } = await client
        .from("restock_requests")
        .insert({
          inventory_item_id: input.inventoryItemId,
          requested_quantity: quantityToDatabase(input.requestedQuantity),
          supplier_name: input.supplierName,
          supplier_phone: input.supplierPhone,
          notification_id: input.notificationId ?? null,
        })
        .select("*")
        .single();

      return mapRestockRequest(requireData(data, error, "The restock request could not be created."));
    },

    async linkNotification(id: string, notificationId: string): Promise<RestockRequest> {
      const { data, error } = await client
        .from("restock_requests")
        .update({ notification_id: notificationId })
        .eq("id", id)
        .select("*")
        .single();

      return mapRestockRequest(requireData(data, error, "The restock request could not be updated."));
    },
  };
}

export function restockRequestRepository(client?: StockSignalDatabaseClient) {
  return createRestockRequestRepository(client ?? createSupabaseServerClient());
}
