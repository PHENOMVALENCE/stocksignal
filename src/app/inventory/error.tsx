"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function InventoryError() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <ErrorState body="Inventory could not be displayed. Try again, or check the server configuration." />
    </div>
  );
}
