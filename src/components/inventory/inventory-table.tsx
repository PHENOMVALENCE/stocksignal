import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatQuantity } from "@/lib/quantity";
import type { InventoryItem } from "@/repositories/mappers";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--line)] bg-white">
      <table className="data-table">
        <caption className="sr-only">Inventory materials and stock status</caption>
        <thead>
          <tr>
            <th scope="col">Material</th>
            <th scope="col">SKU</th>
            <th scope="col">On hand</th>
            <th scope="col">Reorder level</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <th scope="row">
                <Link className="font-semibold text-[var(--ink)] underline-offset-4 hover:underline" href={`/inventory/${item.id}`}>
                  {item.name}
                </Link>
              </th>
              <td className="font-mono text-sm">{item.sku}</td>
              <td className="quantity-cell">
                {formatQuantity(item.quantity)} <span className="unit-label">{item.unit}</span>
              </td>
              <td>
                {formatQuantity(item.reorderLevel)} <span className="unit-label">{item.unit}</span>
              </td>
              <td>
                <StatusBadge quantity={item.quantity} reorderLevel={item.reorderLevel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
