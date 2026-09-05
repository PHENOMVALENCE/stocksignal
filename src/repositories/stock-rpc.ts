import "server-only";

import { parseQuantity, quantityToDatabase } from "@/lib/quantity";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError } from "@/repositories/errors";
import type { StockMovementType } from "@/types/database";

export interface ApplyStockMovementInput {
  inventoryItemId: string;
  type: StockMovementType;
  quantity: number;
  notes?: string;
}

export interface AppliedStockMovement {
  movementId: string;
  previousQuantity: number;
  newQuantity: number;
  alertActive: boolean;
  notificationId: string | null;
}

export function createStockRpc(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
    async applyMovement(input: ApplyStockMovementInput): Promise<AppliedStockMovement> {
      const { data, error } = await client.rpc("apply_stock_movement", {
        p_inventory_item_id: input.inventoryItemId,
        p_type: input.type,
        p_quantity: quantityToDatabase(input.quantity),
        p_notes: input.notes ?? null,
      });

      if (error) {
        throw mapDatabaseError(error, "The stock movement could not be recorded.");
      }

      const row = Array.isArray(data) ? data[0] : data;

      if (!row) {
        throw mapDatabaseError({ message: "empty" }, "The stock movement could not be recorded.");
      }

      return {
        movementId: row.movement_id,
        previousQuantity: parseQuantity(row.previous_quantity, "Previous quantity"),
        newQuantity: parseQuantity(row.new_quantity, "New quantity"),
        alertActive: row.alert_active,
        notificationId: row.notification_id,
      };
    },
  };
}

export function stockRpc(client?: StockSignalDatabaseClient) {
  return createStockRpc(client ?? createSupabaseServerClient());
}
