import Link from "next/link";
import { notFound } from "next/navigation";

import { MovementForm } from "@/components/inventory/movement-form";
import { MovementHistory } from "@/components/inventory/movement-history";
import { RestockForm } from "@/components/inventory/restock-form";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { loadInventoryItemDetail } from "@/lib/data";
import { formatQuantity } from "@/lib/quantity";
import { inventoryItemIdSchema } from "@/lib/validation/inventory";
import { isLowStock } from "@/services/inventory/stock-rules";

export const dynamic = "force-dynamic";

interface InventoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InventoryDetailPage({ params }: InventoryDetailPageProps) {
  const { id } = await params;
  const parsedId = inventoryItemIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const result = await loadInventoryItemDetail(parsedId.data);

  if (!result.ok) {
    return (
      <AppShell eyebrow="StockSignal" title="Inventory item">
        <ErrorState
          body={result.message}
          title={result.reason === "configuration" ? "Database is not configured" : "Item could not be loaded"}
        />
      </AppShell>
    );
  }

  if (!result.data) {
    notFound();
  }

  const { item, movements, restockRequests } = result.data;
  const low = isLowStock(item.quantity, item.reorderLevel);

  return (
    <AppShell
      actions={
        <Link className="button-secondary" href="/inventory">
          Back to inventory
        </Link>
      }
      description={`SKU ${item.sku}`}
      eyebrow="StockSignal"
      title={item.name}
    >
      <dl className="grid gap-6 border border-[var(--line)] bg-white p-6 sm:grid-cols-3">
        <div>
          <dt className="field-label">On hand</dt>
          <dd className="quantity-display">
            {formatQuantity(item.quantity)} <span className="unit-label">{item.unit}</span>
          </dd>
        </div>
        <div>
          <dt className="field-label">Reorder level</dt>
          <dd className="text-xl font-semibold">
            {formatQuantity(item.reorderLevel)} <span className="unit-label">{item.unit}</span>
          </dd>
        </div>
        <div>
          <dt className="field-label">Status</dt>
          <dd className="mt-2">
            <StatusBadge quantity={item.quantity} reorderLevel={item.reorderLevel} />
          </dd>
        </div>
      </dl>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="space-y-8">
          <MovementForm inventoryItemId={item.id} unit={item.unit} />
          {low ? (
            <RestockForm
              inventoryItemId={item.id}
              supplierName={item.supplierName ?? ""}
              supplierPhone={item.supplierPhone ?? ""}
              unit={item.unit}
            />
          ) : null}
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">Movement history</h2>
            <MovementHistory movements={movements} unit={item.unit} />
          </section>
          <section>
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">Restock requests</h2>
            {restockRequests.length === 0 ? (
              <p className="text-[var(--muted)]">No supplier restock requests have been recorded for this material.</p>
            ) : (
              <ul className="space-y-3">
                {restockRequests.map((request) => (
                  <li className="border border-[var(--line)] bg-white px-4 py-3" key={request.id}>
                    <p className="font-semibold">
                      {formatQuantity(request.requestedQuantity)} {item.unit} · {request.supplierName}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {request.status} · {new Date(request.createdAt).toLocaleString()}
                      {request.notificationId ? " · notification recorded" : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
