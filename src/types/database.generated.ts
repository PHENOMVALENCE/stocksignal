export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          alert_active: boolean
          created_at: string
          id: string
          manager_phone: string | null
          name: string
          quantity: number
          reorder_level: number
          sku: string
          supplier_name: string | null
          supplier_phone: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          alert_active?: boolean
          created_at?: string
          id?: string
          manager_phone?: string | null
          name: string
          quantity?: number
          reorder_level?: number
          sku: string
          supplier_name?: string | null
          supplier_phone?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          alert_active?: boolean
          created_at?: string
          id?: string
          manager_phone?: string | null
          name?: string
          quantity?: number
          reorder_level?: number
          sku?: string
          supplier_name?: string | null
          supplier_phone?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          attempt_count: number
          created_at: string
          error_message: string | null
          id: string
          inventory_item_id: string
          last_attempted_at: string | null
          message: string
          provider: string
          provider_message_id: string | null
          recipient: string
          status: string
          type: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          error_message?: string | null
          id?: string
          inventory_item_id: string
          last_attempted_at?: string | null
          message: string
          provider?: string
          provider_message_id?: string | null
          recipient: string
          status: string
          type: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          error_message?: string | null
          id?: string
          inventory_item_id?: string
          last_attempted_at?: string | null
          message?: string
          provider?: string
          provider_message_id?: string | null
          recipient?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      restock_requests: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string
          notification_id: string | null
          requested_quantity: number
          status: string
          supplier_name: string
          supplier_phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id: string
          notification_id?: string | null
          requested_quantity: number
          status?: string
          supplier_name: string
          supplier_phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string
          notification_id?: string | null
          requested_quantity?: number
          status?: string
          supplier_name?: string
          supplier_phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restock_requests_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restock_requests_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          quantity: number
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          quantity: number
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          quantity?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_stock_movement: {
        Args: {
          p_inventory_item_id: string
          p_notes?: string
          p_quantity: number
          p_type: string
        }
        Returns: {
          alert_active: boolean
          movement_id: string
          new_quantity: number
          notification_id: string
          previous_quantity: number
        }[]
      }
      create_restock_request: {
        Args: {
          p_inventory_item_id: string
          p_message: string
          p_requested_quantity: number
          p_supplier_name: string
          p_supplier_phone: string
          p_unit: string
        }
        Returns: {
          notification_id: string
          restock_request_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

