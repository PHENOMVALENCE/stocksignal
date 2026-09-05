import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { loadInventoryItem } from "@/lib/data";
import { formatQuantity } from "@/lib/quantity";
import { inventoryItemIdSchema } from "@/lib/validation/inventory";

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

  const result = await loadInventoryItem(parsedId.data);

  if (!result.ok) {
    return (
      <AppShell eyebrow="Materials" title="Inventory item">
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

  const item = result.data;

  return (
    <AppShell
      actions={
        <Link className="button-secondary" href="/inventory">
          Back to inventory
        </Link>
      }
      description={`SKU ${item.sku}`}
      eyebrow="Materials"
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
    </AppShell>
  );
}
