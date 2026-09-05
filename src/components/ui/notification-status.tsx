import type { NotificationStatus } from "@/types/database";

const styles: Record<NotificationStatus, string> = {
  PENDING: "border-amber-800 bg-amber-50 text-amber-950",
  SENT: "border-emerald-800 bg-emerald-50 text-emerald-950",
  FAILED: "border-red-800 bg-red-50 text-red-950",
};

const labels: Record<NotificationStatus, string> = {
  PENDING: "Pending",
  SENT: "Sent",
  FAILED: "Failed",
};

export function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  return (
    <span className={`inline-flex min-h-7 items-center border px-2 text-xs font-semibold uppercase tracking-[0.12em] ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
