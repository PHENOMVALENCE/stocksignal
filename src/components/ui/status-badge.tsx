import { isLowStock } from "@/services/inventory/stock-rules";

interface StatusBadgeProps {
  quantity: number;
  reorderLevel: number;
}

export function StatusBadge({ quantity, reorderLevel }: StatusBadgeProps) {
  const low = isLowStock(quantity, reorderLevel);

  return (
    <span
      className={
        low
          ? "inline-flex min-h-7 items-center border border-red-800 bg-red-50 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-800"
          : "inline-flex min-h-7 items-center border border-emerald-800 bg-emerald-50 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900"
      }
    >
      {low ? "Low stock" : "Healthy"}
    </span>
  );
}
