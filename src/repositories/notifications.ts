import "server-only";

import { AppError } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import { mapDatabaseError, requireData } from "@/repositories/errors";
import { mapNotification, type NotificationRecord } from "@/repositories/mappers";
import type { NotificationStatus, NotificationType } from "@/types/database";

export interface CreateNotificationInput {
  inventoryItemId: string;
  type: NotificationType;
  recipient: string;
  message: string;
  status?: NotificationStatus;
  provider?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
  from?: string;
  to?: string;
}

export interface NotificationPage {
  items: NotificationRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export function createNotificationRepository(client: StockSignalDatabaseClient = createSupabaseServerClient()) {
  return {
    async getById(id: string): Promise<NotificationRecord | null> {
      const { data, error } = await client.from("notifications").select("*").eq("id", id).maybeSingle();

      if (error) {
        throw mapDatabaseError(error, "The notification could not be loaded.");
      }

      return data ? mapNotification(data) : null;
    },

    async requireById(id: string): Promise<NotificationRecord> {
      const notification = await this.getById(id);

      if (!notification) {
        throw new AppError("The notification was not found.", "NOT_FOUND", 404);
      }

      return notification;
    },

    async create(input: CreateNotificationInput): Promise<NotificationRecord> {
      const { data, error } = await client
        .from("notifications")
        .insert({
          inventory_item_id: input.inventoryItemId,
          type: input.type,
          recipient: input.recipient,
          message: input.message,
          status: input.status ?? "PENDING",
          provider: input.provider ?? "AFRICAS_TALKING",
        })
        .select("*")
        .single();

      return mapNotification(requireData(data, error, "The notification could not be created."));
    },

    async updateDelivery(
      id: string,
      update: {
        status: NotificationStatus;
        providerMessageId?: string | null;
        errorMessage?: string | null;
      },
    ): Promise<NotificationRecord> {
      const { data, error } = await client
        .from("notifications")
        .update({
          status: update.status,
          provider_message_id: update.providerMessageId ?? null,
          error_message: update.errorMessage ?? null,
        })
        .eq("id", id)
        .select("*")
        .single();

      return mapNotification(requireData(data, error, "The notification could not be updated."));
    },

    async listPage(filters: NotificationFilters, page = 1, pageSize = 20): Promise<NotificationPage> {
      const from = Math.max(page - 1, 0) * pageSize;
      const to = from + pageSize - 1;

      let query = client
        .from("notifications")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.from) {
        query = query.gte("created_at", filters.from);
      }

      if (filters.to) {
        query = query.lte("created_at", filters.to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw mapDatabaseError(error, "Notifications could not be loaded.");
      }

      return {
        items: (data ?? []).map(mapNotification),
        total: count ?? 0,
        page,
        pageSize,
      };
    },
  };
}

export function notificationRepository(client?: StockSignalDatabaseClient) {
  return createNotificationRepository(client ?? createSupabaseServerClient());
}
