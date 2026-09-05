/**
 * Typed definitions for the StockSignal MVP schema.
 *
 * These match the reviewed public tables and are the contract for server-only
 * Supabase clients. After applying new migrations, regenerate from a linked
 * project or local CLI database:
 *
 *   npx supabase gen types typescript --local > src/types/database.ts
 *   npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
 *
 * Manual edits must preserve RLS-era column names and numeric string values.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StockMovementType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
export type NotificationType = "LOW_STOCK" | "RESTOCK_REQUEST";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED";
export type RestockRequestStatus =
  | "REQUESTED"
  | "ACKNOWLEDGED"
  | "CANCELLED"
  | "FULFILLED";

export interface Database {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string;
          name: string;
          sku: string;
          unit: string;
          quantity: string;
          reorder_level: string;
          manager_phone: string | null;
          supplier_name: string | null;
          supplier_phone: string | null;
          alert_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          unit: string;
          quantity?: string | number;
          reorder_level?: string | number;
          manager_phone?: string | null;
          supplier_name?: string | null;
          supplier_phone?: string | null;
          alert_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          unit?: string;
          quantity?: string | number;
          reorder_level?: string | number;
          manager_phone?: string | null;
          supplier_name?: string | null;
          supplier_phone?: string | null;
          alert_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stock_movements: {
        Row: {
          id: string;
          inventory_item_id: string;
          type: StockMovementType;
          quantity: string;
          previous_quantity: string;
          new_quantity: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inventory_item_id: string;
          type: StockMovementType;
          quantity: string | number;
          previous_quantity: string | number;
          new_quantity: string | number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          inventory_item_id?: string;
          type?: StockMovementType;
          quantity?: string | number;
          previous_quantity?: string | number;
          new_quantity?: string | number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stock_movements_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          inventory_item_id: string;
          type: NotificationType;
          recipient: string;
          message: string;
          provider: string;
          provider_message_id: string | null;
          status: NotificationStatus;
          error_message: string | null;
          attempt_count: number;
          last_attempted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inventory_item_id: string;
          type: NotificationType;
          recipient: string;
          message: string;
          provider?: string;
          provider_message_id?: string | null;
          status: NotificationStatus;
          error_message?: string | null;
          attempt_count?: number;
          last_attempted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          inventory_item_id?: string;
          type?: NotificationType;
          recipient?: string;
          message?: string;
          provider?: string;
          provider_message_id?: string | null;
          status?: NotificationStatus;
          error_message?: string | null;
          attempt_count?: number;
          last_attempted_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
      restock_requests: {
        Row: {
          id: string;
          inventory_item_id: string;
          requested_quantity: string;
          supplier_name: string;
          supplier_phone: string;
          status: RestockRequestStatus;
          notification_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          inventory_item_id: string;
          requested_quantity: string | number;
          supplier_name: string;
          supplier_phone: string;
          status?: RestockRequestStatus;
          notification_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          inventory_item_id?: string;
          requested_quantity?: string | number;
          supplier_name?: string;
          supplier_phone?: string;
          status?: RestockRequestStatus;
          notification_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restock_requests_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "restock_requests_notification_id_fkey";
            columns: ["notification_id"];
            isOneToOne: false;
            referencedRelation: "notifications";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      apply_stock_movement: {
        Args: {
          p_inventory_item_id: string;
          p_type: StockMovementType;
          p_quantity: number | string;
          p_notes?: string | null;
        };
        Returns: {
          movement_id: string;
          previous_quantity: string;
          new_quantity: string;
          alert_active: boolean;
          notification_id: string | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type InventoryItemRow = Database["public"]["Tables"]["inventory_items"]["Row"];
export type StockMovementRow = Database["public"]["Tables"]["stock_movements"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type RestockRequestRow = Database["public"]["Tables"]["restock_requests"]["Row"];
