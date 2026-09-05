import Link from "next/link";

import { InventoryTable } from "@/components/inventory/inventory-table";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { loadInventoryItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const result = await loadInventoryItems();

  return (
    <AppShell
      actions={
        <Link className="button-primary" href="/inventory/new">
          Add material
        </Link>
      }
      description="StockSignal tracks materials, quantities, and reorder status from the live inventory record."
      eyebrow="StockSignal"
      title="Inventory"
    >
      {!result.ok ? (
        <ErrorState
          body={result.message}
          title={result.reason === "configuration" ? "Database is not configured" : "Inventory could not be loaded"}
        />
      ) : result.data.length === 0 ? (
        <EmptyState
          action={
            <Link className="button-primary" href="/inventory/new">
              Add the first material
            </Link>
          }
          body="No materials have been recorded yet. Add a raw material to start tracking stock."
          title="No inventory yet"
        />
      ) : (
        <InventoryTable items={result.data} />
      )}
    </AppShell>
  );
}
