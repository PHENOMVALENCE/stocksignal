import "server-only";

import { quantityToDatabase } from "@/lib/quantity";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError } from "@/repositories/errors";

export interface CreateRestockRequestRpcInput {
  inventoryItemId: string;
  requestedQuantity: number;
  supplierName: string;
  supplierPhone: string;
  message: string;
  unit: string;
}

export interface CreatedRestockRequestIds {
  restockRequestId: string;
  notificationId: string;
}

export function createRestockRpc(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
    async createRequest(input: CreateRestockRequestRpcInput): Promise<CreatedRestockRequestIds> {
      const { data, error } = await client.rpc("create_restock_request", {
        p_inventory_item_id: input.inventoryItemId,
        p_requested_quantity: Number(quantityToDatabase(input.requestedQuantity)),
        p_supplier_name: input.supplierName,
        p_supplier_phone: input.supplierPhone,
        p_message: input.message,
        p_unit: input.unit,
      });

      if (error) {
        throw mapDatabaseError(error, "The restock request could not be created.");
      }

      const row = Array.isArray(data) ? data[0] : data;

      if (!row) {
        throw mapDatabaseError({ message: "empty" }, "The restock request could not be created.");
      }

      return {
        restockRequestId: row.restock_request_id,
        notificationId: row.notification_id,
      };
    },
  };
}

export function restockRpc(client?: StockSignalDatabaseClient) {
  return createRestockRpc(client ?? createSupabaseServerClient());
}
