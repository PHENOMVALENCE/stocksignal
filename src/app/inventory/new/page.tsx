import Link from "next/link";

import { CreateInventoryForm } from "@/components/inventory/create-inventory-form";
import { AppShell } from "@/components/layout/app-shell";

export default function NewInventoryPage() {
  return (
    <AppShell
      actions={
        <Link className="button-secondary" href="/inventory">
          Back to inventory
        </Link>
      }
      description="Name, SKU, unit, opening quantity, reorder level, and the manager who should receive low-stock alerts."
      eyebrow="Materials"
      title="Add material"
    >
      <CreateInventoryForm />
    </AppShell>
  );
}
