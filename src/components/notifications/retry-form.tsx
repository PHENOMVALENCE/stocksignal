"use client";

import { useActionState } from "react";

import { retryNotificationAction } from "@/app/actions/notifications";
import { idleActionState } from "@/lib/actions";

export function RetryNotificationForm({ notificationId }: { notificationId: string }) {
  const [state, action, pending] = useActionState(retryNotificationAction, idleActionState);

  return (
    <form action={action} className="inline">
      <input name="notificationId" type="hidden" value={notificationId} />
      <button className="text-sm font-semibold underline-offset-4 hover:underline disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Retrying…" : "Retry send"}
      </button>
      {state.message ? (
        <span className="ml-2 text-sm text-[var(--muted)]" role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
