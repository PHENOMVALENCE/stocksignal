import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { RetryNotificationForm } from "@/components/notifications/retry-form";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { NotificationStatusBadge } from "@/components/ui/notification-status";
import { loadNotificationHistory } from "@/lib/data";
import type { NotificationStatus, NotificationType } from "@/types/database";

export const dynamic = "force-dynamic";

interface NotificationsPageProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

const types: NotificationType[] = ["LOW_STOCK", "RESTOCK_REQUEST"];
const statuses: NotificationStatus[] = ["PENDING", "SENT", "FAILED"];

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const params = await searchParams;
  const type = types.includes(params.type as NotificationType) ? (params.type as NotificationType) : undefined;
  const status = statuses.includes(params.status as NotificationStatus)
    ? (params.status as NotificationStatus)
    : undefined;
  const page = Math.max(Number(params.page) || 1, 1);
  const from = params.from ? new Date(`${params.from}T00:00:00.000Z`).toISOString() : undefined;
  const to = params.to ? new Date(`${params.to}T23:59:59.999Z`).toISOString() : undefined;

  const result = await loadNotificationHistory({ type, status, from, to }, page);

  return (
    <AppShell
      description="StockSignal records every SMS attempt with type, recipient, and delivery status."
      eyebrow="StockSignal"
      title="Notifications"
    >
      <form className="mb-8 grid gap-4 border border-[var(--line)] bg-white p-5 sm:grid-cols-4" method="get">
        <label className="block">
          <span className="field-label">Type</span>
          <select className="field-input" defaultValue={type ?? ""} name="type">
            <option value="">All types</option>
            <option value="LOW_STOCK">Low stock</option>
            <option value="RESTOCK_REQUEST">Restock request</option>
          </select>
        </label>
        <label className="block">
          <span className="field-label">Status</span>
          <select className="field-input" defaultValue={status ?? ""} name="status">
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
          </select>
        </label>
        <label className="block">
          <span className="field-label">From</span>
          <input className="field-input" defaultValue={params.from ?? ""} name="from" type="date" />
        </label>
        <label className="block">
          <span className="field-label">To</span>
          <input className="field-input" defaultValue={params.to ?? ""} name="to" type="date" />
        </label>
        <div className="sm:col-span-4">
          <button className="button-secondary" type="submit">
            Apply filters
          </button>
        </div>
      </form>

      {!result.ok ? (
        <ErrorState
          body={result.message}
          title={result.reason === "configuration" ? "Database is not configured" : "Notifications could not be loaded"}
        />
      ) : result.data.items.length === 0 ? (
        <EmptyState
          body="No notification attempts match these filters. Alerts appear after a material first crosses its reorder level."
          title="No notifications"
        />
      ) : (
        <>
          <div className="overflow-x-auto border border-[var(--line)] bg-white">
            <table className="data-table">
              <caption className="sr-only">Notification attempts</caption>
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Material</th>
                  <th scope="col">Type</th>
                  <th scope="col">Recipient</th>
                  <th scope="col">Status</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {result.data.items.map((notification) => {
                  const item = result.data.itemsById[notification.inventoryItemId];
                  return (
                    <tr key={notification.id}>
                      <td>{new Date(notification.createdAt).toLocaleString()}</td>
                      <th scope="row">
                        {item ? (
                          <Link className="font-semibold underline-offset-4 hover:underline" href={`/inventory/${item.id}`}>
                            {item.name}
                          </Link>
                        ) : (
                          "Unknown material"
                        )}
                      </th>
                      <td>{notification.type === "LOW_STOCK" ? "Low stock" : "Restock request"}</td>
                      <td className="font-mono text-sm">{notification.recipient}</td>
                      <td>
                        <NotificationStatusBadge status={notification.status} />
                      </td>
                      <td>
                        {notification.status === "FAILED" ? (
                          <div>
                            <p>{notification.errorMessage ?? "Delivery failed."}</p>
                            <RetryNotificationForm notificationId={notification.id} />
                          </div>
                        ) : notification.providerMessageId ? (
                          `Provider reference recorded`
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <nav aria-label="Notification pages" className="mt-6 flex items-center justify-between text-sm">
            <p className="text-[var(--muted)]">
              Page {result.data.page} of {Math.max(Math.ceil(result.data.total / result.data.pageSize), 1)} · {result.data.total}{" "}
              recorded
            </p>
            <div className="flex gap-3">
              {page > 1 ? (
                <Link className="font-semibold underline-offset-4 hover:underline" href={pageHref(params, page - 1)}>
                  Previous
                </Link>
              ) : null}
              {page * result.data.pageSize < result.data.total ? (
                <Link className="font-semibold underline-offset-4 hover:underline" href={pageHref(params, page + 1)}>
                  Next
                </Link>
              ) : null}
            </div>
          </nav>
        </>
      )}
    </AppShell>
  );
}

function pageHref(
  params: { type?: string; status?: string; from?: string; to?: string },
  page: number,
) {
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.status) search.set("status", params.status);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  search.set("page", String(page));
  return `/notifications?${search.toString()}`;
}
