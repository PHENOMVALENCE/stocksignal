import "server-only";

import { AppError } from "@/lib/errors";
import { quantityToDatabase } from "@/lib/quantity";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError, requireData } from "@/repositories/errors";
import { mapInventoryItem, type InventoryItem } from "@/repositories/mappers";
import type { Database } from "@/types/database";

export interface CreateInventoryItemInput {
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  managerPhone: string;
  supplierName?: string | null;
  supplierPhone?: string | null;
}

type InventoryItemInsert = Database["public"]["Tables"]["inventory_items"]["Insert"];

export function createInventoryItemRepository(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
    async list(): Promise<InventoryItem[]> {
      const { data, error } = await client
        .from("inventory_items")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw mapDatabaseError(error, "Inventory items could not be loaded.");
      }

      return (data ?? []).map(mapInventoryItem);
    },

    async getById(id: string): Promise<InventoryItem | null> {
      const { data, error } = await client.from("inventory_items").select("*").eq("id", id).maybeSingle();

      if (error) {
        throw mapDatabaseError(error, "The inventory item could not be loaded.");
      }

      return data ? mapInventoryItem(data) : null;
    },

    async requireById(id: string): Promise<InventoryItem> {
      const item = await this.getById(id);

      if (!item) {
        throw new AppError("The inventory item was not found.", "NOT_FOUND", 404);
      }

      return item;
    },

    async create(input: CreateInventoryItemInput): Promise<InventoryItem> {
      const payload: InventoryItemInsert = {
        name: input.name,
        sku: input.sku,
        unit: input.unit,
        quantity: quantityToDatabase(input.quantity),
        reorder_level: quantityToDatabase(input.reorderLevel),
        manager_phone: input.managerPhone,
        supplier_name: input.supplierName ?? null,
        supplier_phone: input.supplierPhone ?? null,
        alert_active: input.quantity <= input.reorderLevel,
      };

      const { data, error } = await client.from("inventory_items").insert(payload).select("*").single();

      return mapInventoryItem(requireData(data, error, "The inventory item could not be created."));
    },

    async countLowStock(): Promise<number> {
      const { data, error } = await client.from("inventory_items").select("id, quantity, reorder_level");

      if (error) {
        throw mapDatabaseError(error, "Low-stock items could not be counted.");
      }

      return (data ?? []).filter((row) => Number(row.quantity) <= Number(row.reorder_level)).length;
    },

    async listLowStock(): Promise<InventoryItem[]> {
      const items = await this.list();
      return items
        .filter((item) => item.quantity <= item.reorderLevel)
        .sort((left, right) => {
          const leftRatio = left.reorderLevel === 0 ? left.quantity : left.quantity / left.reorderLevel;
          const rightRatio = right.reorderLevel === 0 ? right.quantity : right.quantity / right.reorderLevel;

          if (leftRatio !== rightRatio) {
            return leftRatio - rightRatio;
          }

          return left.quantity - right.quantity;
        });
    },
  };
}

export function inventoryItemRepository(client?: StockSignalDatabaseClient) {
  return createInventoryItemRepository(client ?? createSupabaseServerClient());
}
