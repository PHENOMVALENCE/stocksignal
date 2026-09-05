import Link from "next/link";

import { InventoryTable } from "@/components/inventory/inventory-table";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { loadDashboard } from "@/lib/data";
import { formatQuantity } from "@/lib/quantity";

export const dynamic = "force-dynamic";

const movementLabels = {
  STOCK_IN: "Stock in",
  STOCK_OUT: "Stock out",
  ADJUSTMENT: "Adjustment",
} as const;

export default async function DashboardPage() {
  const result = await loadDashboard();

  if (!result.ok) {
    return (
      <AppShell
        description="Live counts come from the StockSignal inventory record. No sample metrics are shown."
        eyebrow="JengaFlow"
        title="Dashboard"
      >
        <ErrorState
          body={result.message}
          title={result.reason === "configuration" ? "Database is not configured" : "Dashboard could not be loaded"}
        />
      </AppShell>
    );
  }

  const { totalItems, lowStockCount, lowStockItems, recentMovements, itemsById } = result.data;

  return (
    <AppShell
      actions={
        <Link className="button-primary" href="/inventory/new">
          Add material
        </Link>
      }
      description="Action-required materials and the latest recorded movements from the StockSignal inventory module. Counts are calculated from persisted inventory."
      eyebrow="JengaFlow"
      title="Dashboard"
    >
      <section className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
        <article className="bg-white p-6">
          <p className="field-label">Materials on record</p>
          <p className="quantity-display">{totalItems}</p>
        </article>
        <article className="bg-white p-6">
          <p className="field-label">Low stock now</p>
          <p className="quantity-display">{lowStockCount}</p>
        </article>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Needs attention</h2>
          <Link className="text-sm font-semibold underline-offset-4 hover:underline" href="/inventory">
            All inventory
          </Link>
        </div>
        {lowStockItems.length === 0 ? (
          <EmptyState
            body={
              totalItems === 0
                ? "No materials have been recorded yet, so there is nothing to replenish."
                : "Every recorded material is currently above its reorder level."
            }
            title="No low-stock items"
          />
        ) : (
          <InventoryTable items={lowStockItems} />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">Recent movements</h2>
        {recentMovements.length === 0 ? (
          <EmptyState body="Movements will appear here after stock is received, consumed, or counted." title="No movements yet" />
        ) : (
          <div className="overflow-x-auto border border-[var(--line)] bg-white">
            <table className="data-table">
              <caption className="sr-only">Recent stock movements</caption>
              <thead>
                <tr>
                  <th scope="col">Material</th>
                  <th scope="col">Type</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">New balance</th>
                  <th scope="col">When</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.map((movement) => {
                  const item = itemsById[movement.inventoryItemId];
                  return (
                    <tr key={movement.id}>
                      <th scope="row">
                        {item ? (
                          <Link className="font-semibold underline-offset-4 hover:underline" href={`/inventory/${item.id}`}>
                            {item.name}
                          </Link>
                        ) : (
                          "Unknown material"
                        )}
                      </th>
                      <td>{movementLabels[movement.type]}</td>
                      <td className="quantity-cell">{formatQuantity(movement.quantity)}</td>
                      <td className="quantity-cell">{formatQuantity(movement.newQuantity)}</td>
                      <td>{new Date(movement.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
