"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function NotificationsError() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <ErrorState body="Notifications could not be displayed. Try again, or check the server configuration." />
    </div>
  );
}
